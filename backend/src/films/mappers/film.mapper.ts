import { FilmDto, ScheduleDto } from '../dto/films.dto';
import { FilmEntity, ScheduleEntity } from '../entities/film.entity';

export function toFilmDto(film: FilmEntity): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: [...film.tags],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function toScheduleDto(schedule: ScheduleEntity): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: String(schedule.hall),
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...schedule.taken],
  };
}
