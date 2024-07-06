import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'app.module';
import { Env } from 'env';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);
  const port = configService.get('APP_PORT');
  const config = new DocumentBuilder()
    .setTitle('Calendly')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);

  Logger.log(`Application is running on: ${await app.getUrl()}`, 'main');
}
bootstrap();
