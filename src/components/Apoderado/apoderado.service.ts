import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApoderadoDTO } from 'src/dto/apoderado.dto';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoEstudiante } from 'src/models/ApoderadoEstudiante.entity';
import { EstudianteCurso } from 'src/models/CursoEstudiante.entity';
import { Estudiante } from 'src/models/Estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApoderadoService {
  constructor(
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(ApoderadoEstudiante)
    private readonly apoderadoEstudianteRepository: Repository<ApoderadoEstudiante>,
    @InjectRepository(EstudianteCurso)
    private readonly estudianteCursoRepository: Repository<EstudianteCurso>

  ) { }


  async createApoderadoWithEstudiantes(apoderadoData: ApoderadoDTO): Promise<any> {
    const apoderado = this.apoderadoRepository.create(apoderadoData);
    const savedApoderado = await this.apoderadoRepository.save(apoderado);

    const savedEstudiantes = [];
    for (const estudianteData of apoderadoData.estudiantes) {
      const estudiante = this.estudianteRepository.create(estudianteData);
      const savedEstudiante = await this.estudianteRepository.save(estudiante);
      savedEstudiantes.push(savedEstudiante);

      const apoderadoEstudiante = new ApoderadoEstudiante();
      apoderadoEstudiante.apoderado_id = savedApoderado.id;
      apoderadoEstudiante.estudiante_id = savedEstudiante.id;
      await this.apoderadoEstudianteRepository.save(apoderadoEstudiante);

      const estudianteCurso = new EstudianteCurso();
      estudianteCurso.curso_id = estudianteData.cursoId;
      estudianteCurso.estudiante_id = savedEstudiante.id;
      await this.estudianteCursoRepository.save(estudianteCurso);
    }

    return {
      apoderado: savedApoderado,
      estudiantes: savedEstudiantes
    };
  }

  async findAll() {
    return await this.apoderadoRepository.find();
  }

  async findOne(id: number) {
    return await this.apoderadoRepository.findOne({ where: { id: id } });
  }

  async findStudentsByApoderadoId(apoderadoId: number) {
    return await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .innerJoin("apoderado_estudiante", "ae", "apoderado.id = ae.apoderado_id")
      .innerJoinAndSelect("estudiante", "estudiante", "estudiante.id = ae.estudiante_id")
      .where("apoderado.id = :apoderadoId", { apoderadoId })
      .select("estudiante.*")
      .getRawMany();
  }

  //desuso por el momento
  async findStudentsWithApoderadoIdRelation(apoderadoId: number) {
    const apoderadoWithEstudiantes = await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .leftJoinAndSelect("apoderado.estudiantesConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.estudiante", "estudiante")
      .where("apoderado.id = :apoderadoId", { apoderadoId })
      .getOne();

    if (apoderadoWithEstudiantes) {
      return {
        ...apoderadoWithEstudiantes,
        estudiantes: apoderadoWithEstudiantes.estudiantesConnection.map(conn => conn.estudiante)
      };
    }
    return null;
  }

  async findStudentsWithApoderadoId(apoderadoRut: string) {
    const result = await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .leftJoinAndSelect("apoderado.estudiantesConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.estudiante", "estudiante")
      .where("apoderado.rut = :apoderadoRut", { apoderadoRut })
      .getOne();

    if (result) {
      const { estudiantesConnection, ...apoderadoData } = result;
      return {
        ...apoderadoData,
        estudiantes: estudiantesConnection.map(conn => conn.estudiante)
      };
    }
    return null;
  }

  async findAddressWithApoderadoId(apoderadoId: number) {
    const result = await this.apoderadoRepository
      .createQueryBuilder("apoderado")
      .leftJoinAndSelect("apoderado.estudiantesConnection", "apoderadoEstudiante")
      .leftJoinAndSelect("apoderadoEstudiante.estudiante", "estudiante")
      .leftJoinAndSelect("apoderado.direccionConnection", "apoderadoDireccion")
      .leftJoinAndSelect("apoderadoDireccion.direccion", "direccion")
      .leftJoinAndSelect("direccion.ciudad", "ciudad")
      .leftJoinAndSelect("ciudad.region", "region")
      .where("apoderado.id = :apoderadoId", { apoderadoId })
      .getOne();

    if (result) {
      const { estudiantesConnection, direccionConnection, ...otherData } = result;

      return {
        ...otherData,
        estudiantes: estudiantesConnection.map(conn => conn.estudiante),
        direccion: direccionConnection.map(conn => conn.direccion)
      };
    }
    return null;
  }


  /* ************************************************************ */

  async createApoderadoWithEstudiantes2(apoderadoData: ApoderadoDTO): Promise<any> {
    const apoderado = this.apoderadoRepository.create(apoderadoData);
    const savedApoderado = await this.apoderadoRepository.save(apoderado);

    const savedEstudiantes = [];
    for (const estudianteData of apoderadoData.estudiantes) {
      const estudiante = this.estudianteRepository.create(estudianteData);
      const savedEstudiante = await this.estudianteRepository.save(estudiante);
      savedEstudiantes.push(savedEstudiante);

      const apoderadoEstudiante = new ApoderadoEstudiante();
      apoderadoEstudiante.apoderado_id = savedApoderado.id;
      apoderadoEstudiante.estudiante_id = savedEstudiante.id;
      await this.apoderadoEstudianteRepository.save(apoderadoEstudiante);

      const estudianteCurso = new EstudianteCurso();
      estudianteCurso.curso_id = estudianteData.cursoId;
      estudianteCurso.estudiante_id = savedEstudiante.id;
      await this.estudianteCursoRepository.save(estudianteCurso);
    }

    return {
      apoderado: savedApoderado,
      estudiantes: savedEstudiantes
    };
  }

  async saveAllApoderadosWithEstudiantes(data: { apoderados: ApoderadoDTO[] }): Promise<any[]> {
    const results = [];

    for (const apoderadoData of data.apoderados) {
      const result = await this.createApoderadoWithEstudiantes2(apoderadoData);
      results.push(result);
    }

    return results;
  }

  /* ************************************************************ */

}

