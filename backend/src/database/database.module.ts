import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection, createConnection } from 'mongoose';
import { AppConfig, configProvider } from '../app.config.provider';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    configProvider,
    {
      provide: DATABASE_CONNECTION,
      inject: ['CONFIG'],
      useFactory: (config: AppConfig): Promise<Connection> => {
        if (config.database.driver !== 'mongodb') {
          throw new Error('DATABASE_DRIVER должен быть mongodb');
        }

        return createConnection(config.database.url).asPromise();
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly connection: Connection,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.connection.close();
  }
}
