import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FilmsController } from './films.controller';
import { FilmsRepository } from './films.repository';
import { FilmsService } from './films.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
