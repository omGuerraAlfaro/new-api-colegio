import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { entities } from './models';

import { ApoderadoModule } from './components';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),    
    ApoderadoModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'colegio',
      entities
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
