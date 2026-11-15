import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmsRepository } from '../films/films.repository';
import { CreateOrderDto, OrderTicketDto, TicketDto } from './dto/order.dto';

type Reservation = Pick<TicketDto, 'film' | 'session'> & {
  places: string[];
};

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(
    order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderTicketDto>> {
    const filmIds = [...new Set(order.tickets.map((ticket) => ticket.film))];

    const films = new Map(
      await Promise.all(
        filmIds.map(
          async (id) => [id, await this.filmsRepository.findById(id)] as const,
        ),
      ),
    );

    const seen = new Set<string>();
    const reservations = new Map<string, Reservation>();
    const items: OrderTicketDto[] = [];

    for (const ticket of order.tickets) {
      const film = films.get(ticket.film);

      if (!film) {
        throw new BadRequestException({
          error: 'Фильм не найден',
        });
      }

      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new BadRequestException({
          error: 'Сеанс не найден',
        });
      }

      if (ticket.row > session.rows || ticket.seat > session.seats) {
        throw new BadRequestException({
          error: 'Такого места нет в зале',
        });
      }

      if (ticket.price !== undefined && ticket.price !== session.price) {
        throw new BadRequestException({
          error: 'Стоимость билета изменилась',
        });
      }

      if (
        ticket.daytime !== undefined &&
        Date.parse(ticket.daytime) !== Date.parse(session.daytime)
      ) {
        throw new BadRequestException({
          error: 'Время сеанса не совпадает',
        });
      }

      const place = `${ticket.row}:${ticket.seat}`;
      const sessionKey = `${ticket.film}:${ticket.session}`;
      const ticketKey = `${sessionKey}:${place}`;

      if (seen.has(ticketKey)) {
        throw new BadRequestException({
          error: 'Место повторяется в заказе',
        });
      }

      if (session.taken.includes(place)) {
        throw new BadRequestException({
          error: 'Место уже забронировано',
        });
      }

      seen.add(ticketKey);

      let reservation = reservations.get(sessionKey);

      if (!reservation) {
        reservation = {
          film: ticket.film,
          session: ticket.session,
          places: [],
        };

        reservations.set(sessionKey, reservation);
      }

      reservation.places.push(place);

      items.push({
        id: randomUUID(),
        film: film.id,
        session: session.id,
        daytime: session.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: session.price,
      });
    }

    const reserved: Reservation[] = [];

    try {
      for (const reservation of reservations.values()) {
        const success = await this.filmsRepository.reserveSeats(
          reservation.film,
          reservation.session,
          reservation.places,
        );

        if (!success) {
          throw new BadRequestException({
            error: 'Одно из мест уже занято. Обновите расписание',
          });
        }

        reserved.push(reservation);
      }
    } catch (error) {
      await Promise.all(
        reserved.map((reservation) =>
          this.filmsRepository.releaseSeats(
            reservation.film,
            reservation.session,
            reservation.places,
          ),
        ),
      );

      throw error;
    }

    return {
      total: items.length,
      items,
    };
  }
}
