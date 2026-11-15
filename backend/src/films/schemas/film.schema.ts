import { Schema } from 'mongoose';
import { FilmEntity, ScheduleEntity } from '../entities/film.entity';

const scheduleSchema = new Schema<ScheduleEntity>(
  {
    id: { type: String, required: true },
    daytime: { type: String, required: true },
    hall: { type: Number, required: true, min: 0 },
    rows: { type: Number, required: true, min: 1 },
    seats: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    taken: { type: [String], default: [] },
  },
  { _id: false },
);

export const filmSchema = new Schema<FilmEntity>(
  {
    id: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], default: [] },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    schedule: { type: [scheduleSchema], default: [] },
  },
  { collection: 'films', versionKey: false },
);
