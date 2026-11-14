import { FilmDto, ScheduleDto } from '../dto/films.dto';

export type ScheduleEntity = ScheduleDto;

export interface FilmEntity extends FilmDto {
  schedule: ScheduleEntity[];
}
