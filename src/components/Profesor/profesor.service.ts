import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profesor } from 'src/models/Profesor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesorService {

  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>
  ) { }


  async findAll() {
    return await this.profesorRepository.find();
  }

  async findOne(id: number) {
    return await this.profesorRepository.findOne({ where: { id: id } });
  }

  async findProfesoresWithCursos() {
    const result = await this.profesorRepository
      .createQueryBuilder("curso")
      .leftJoinAndSelect("curso.profesorConnection", "profesor")
      .select([
        "curso.id",
        "curso.nombre",
        "curso.descripcion",
        "curso.nivel_grado",
        "profesor.id",
        "profesor.primer_nombre",
        "profesor.segundo_nombre",
        "profesor.primer_apellido",
        "profesor.segundo_apellido",
        "profesor.rut",
        "profesor.dv",
        "profesor.telefono",
        "profesor.especialidad",
        "profesor.correo_electronico"
      ])
      .getMany();
    return result;
  }




}




