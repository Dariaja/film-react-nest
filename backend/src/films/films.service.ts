import { Injectable, NotFoundException } from '@nestjs/common';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsRepository } from './films.repository';
import { toFilmDto, toScheduleDto } from './mappers/film.mapper';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ListResponseDto<FilmDto>> {
    const films = await this.filmsRepository.findAll();
    const items = films.map(toFilmDto);

    return { total: items.length, items };
  }

  async findSchedule(filmId: string): Promise<ListResponseDto<ScheduleDto>> {
    const film = await this.filmsRepository.findById(filmId);

    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }

    const items = film.schedule.map(toScheduleDto);

    return { total: items.length, items };
  }
}
