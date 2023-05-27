import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('NODE_PORT');
  const config = new DocumentBuilder()
    .setTitle('Whooing Everyday API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  // config를 바탕으로 swagger document 생성
  const document = SwaggerModule.createDocument(app, config);
  /**
   * Swagger UI에 대한 path를 연결함
   * .setup('swagger ui endpoint', app, swagger_document)
   */
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // 같은 서버 내에 존재하는 Vue front app에서 api호출하기 위한 CORS 허용
  app.enableCors();
  await app.listen(port);
}
bootstrap();
