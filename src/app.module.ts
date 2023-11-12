import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { entities } from './models';
import { ApoderadoModule, EstudianteModule, ProfesorModule, CursoModule, UsuarioModule, AuthModule, NoticiasModule, CorreoModule } from './components';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApoderadoModule,
    EstudianteModule,
    ProfesorModule,
    CursoModule,
    UsuarioModule,
    AuthModule,
    NoticiasModule,
    CorreoModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '44.207.168.60',
      port: 3306,
      username: 'colegioa_omarignacio',
      password: '068gJOWTJ@@k',
      database: 'colegioa_colegioandeschile',
      entities,
      synchronize: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

// type: 'mysql',
//       host: '44.207.168.60',
//       port: 3306,
//       username: 'colegioa_omarignacio',
//       password: '068gJOWTJ@@k',
//       database: 'colegioa_colegioandeschile',