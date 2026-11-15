import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';

export const configProvider: FactoryProvider<AppConfig> = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (config: ConfigService): AppConfig => ({
    database: {
      driver: config.getOrThrow<string>('DATABASE_DRIVER'),
      url: config.getOrThrow<string>('DATABASE_URL'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
