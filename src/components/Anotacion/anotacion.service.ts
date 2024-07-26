import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnotacionDto } from 'src/dto/anotacion.dto';
import { Anotacion } from 'src/models/Anotaciones.entity';
import { AnotacionesEstudiante } from 'src/models/AnotacionesEstudiantes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnotacionService {
    constructor(
        @InjectRepository(Anotacion)
        private readonly anotacionRepository: Repository<Anotacion>,
        @InjectRepository(AnotacionesEstudiante)
        private readonly anotacionEstudianteRepository: Repository<AnotacionesEstudiante>
    ) { }

    async getAnotacionesByEstudianteId(estudianteId: number): Promise<AnotacionDto[]> {
        const anotacionesEstudiantes = await this.anotacionEstudianteRepository.find({
            where: { estudiante_id: estudianteId },
            relations: ['anotacion'],
        });

        return anotacionesEstudiantes.map(ae => ae.anotacion);
    }
}
