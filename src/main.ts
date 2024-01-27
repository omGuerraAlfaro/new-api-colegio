import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'filters/all-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://www.colegioandeschile.cl',
        'http://localhost:8200',
        'http://localhost:8100',
        'http://localhost:4200',
        'http://192.168.2.103:8100'
      ];
      // Permitir con una lista blanca o para cualquier origen en modo desarrollo
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });


  const config = new DocumentBuilder()
    .setTitle('API COLEGIO')
    .setDescription('ENDPOINTS COLEGIO')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Usuarios')
    .addTag('Apoderados')
    .addTag('Estudiantes')
    .addTag('Profesores')
    .addTag('Cursos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3200);
}
bootstrap();
