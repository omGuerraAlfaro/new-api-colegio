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
    origin: ['https://www.colegioandeschile.cl', 'http://localhost', 'http://localhost:8200', 'http://localhost:8100', 'http://localhost:4200', 'http://localhost:8101', '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204, // 204 es típicamente usado para respuestas preflight exitosas
    // allowedHeaders: 'Content-Type, Accept, Authorization',
    allowedHeaders: ['Content-Type', 'Tbk-Api-Key-Id', 'Tbk-Api-Key-Secret'],
    credentials: true, // si necesitas enviar/recibir cookies o autenticación basada en encabezados
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
    .addTag('Administrador')
    .addTag('Noticias')
    .addTag('Correos')
    .addTag('WebPay')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3200);
}
bootstrap();
