import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correo } from 'src/models/Correo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CorreoService {
    constructor(
        @InjectRepository(Correo)
        private readonly correoRepository: Repository<Correo>,
    ) { }

    async getCorreoSmtp() {
        try {
            return await this.correoRepository.find();
        } catch (error) {
            console.error('Failed to fetch SMTP info:', error);
            throw new InternalServerErrorException('Failed to fetch SMTP information');
        }
    }
    


}

