import { Inject, Injectable } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { DATABASE_CONNECTION } from '../database/database.module';
import { FilmEntity } from './entities/film.entity';
import { filmSchema } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  private readonly filmModel: Model<FilmEntity>;

  constructor(@Inject(DATABASE_CONNECTION) connection: Connection) {
    this.filmModel = connection.model<FilmEntity>('Film', filmSchema);
  }

  async findAll(): Promise<FilmEntity[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const film = await this.filmModel
      .findOneAndUpdate(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              taken: { $nin: places },
            },
          },
        },
        {
          $addToSet: {
            'schedule.$.taken': { $each: places },
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    return film !== null;
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $pull: {
            'schedule.$.taken': { $in: places },
          },
        },
        {
          runValidators: true,
        },
      )
      .exec();
  }
}
