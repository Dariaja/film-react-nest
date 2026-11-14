import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolve(__dirname, '..', '.env'),
    }),

    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: resolve(
            __dirname,
            '..',
            config.getOrThrow<string>('STATIC_ROOT'),
          ),
          serveRoot: config.getOrThrow<string>('STATIC_PREFIX'),
          serveStaticOptions: {
            index: false,
          },
        },
      ],
    }),

    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
