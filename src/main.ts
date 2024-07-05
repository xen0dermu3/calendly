import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);
  const port = configService.get('APP_PORT');

  await app.listen(port);

  Logger.log(`Application is running on: ${await app.getUrl()}`, 'main');
}
bootstrap();
