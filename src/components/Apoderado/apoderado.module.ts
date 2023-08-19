import { Module } from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoController } from './apoderado.controller';
import { Estudiante } from 'src/models/Estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Apoderado,
      ApoderadoController,
      Estudiante,
    ]),
  ],
  controllers: [ApoderadoController],
  providers: [ApoderadoService],
})
export class ApoderadoModule {}
