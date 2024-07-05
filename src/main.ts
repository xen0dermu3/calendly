import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from '@app/app.module';
import { Env } from '@app/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);
  const port = configService.get('APP_PORT');

  await app.listen(port);

  Logger.log(`Application is running on: ${await app.getUrl()}`, 'main');
}
bootstrap();
