import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Estudiante } from 'src/models/Estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>
  ) { }

 
  async findAll() {
    return await this.estudianteRepository.find();
  }

  async findOne(id: number) {
    return await this.estudianteRepository.findOne({ where: { id: id } });
  }

}

