import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { Estudiante } from 'src/models/Estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Estudiante,
    ]),
  ],
  controllers: [EstudianteController],
  providers: [EstudianteService],
})
export class EstudianteModule {}
