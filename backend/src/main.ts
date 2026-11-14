import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.getOrThrow<string>('API_PREFIX'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: () =>
        new BadRequestException({
          error: 'Некорректные данные запроса',
        }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('CORS_ORIGIN'),
  });

  const port = Number(config.getOrThrow<string>('PORT'));
  await app.listen(port);
}

void bootstrap();
