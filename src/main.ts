import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interseptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Блог API')
    .setDescription('API для блога. Автор: Демаков Д.М.')
    .setVersion('1.0.0')
    .setContact('github', 'https://github.com/distinkt-dd', 'dpemvr@yandex.ru')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: 'swagger.json',
    yamlDocumentUrl: 'swagger.yaml',
    customSiteTitle: 'Blog API',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
