import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('NODE_PORT');
  const config = new DocumentBuilder()
    .setTitle('Whooing Everyday API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  // nestjs app내 api들의 url경로를 전부 /api/* 로 변경
  app.setGlobalPrefix('api');

  // config를 바탕으로 swagger document 생성
  const document = SwaggerModule.createDocument(app, config);
  /**
   * Swagger UI에 대한 path를 연결함
   * .setup('swagger ui endpoint', app, swagger_document)
   */
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  /**
   * 위 <NestExpressApplication>, 아래 3줄
   * hbs(handlebars) 사용을 위한 코드
   * https://docs.nestjs.com/techniques/mvc
   */
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(port);
}
bootstrap();
