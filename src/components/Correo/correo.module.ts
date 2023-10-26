import { Module } from '@nestjs/common';
import { CorreoController } from './correo.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CorreoController],
  providers: [],
})

export class CorreoModule { }
