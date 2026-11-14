import { FilmDto, ScheduleDto } from '../dto/films.dto';

export type ScheduleEntity = Omit<ScheduleDto, 'hall'> & {
  hall: number;
};

export interface FilmEntity extends FilmDto {
  schedule: ScheduleEntity[];
}
