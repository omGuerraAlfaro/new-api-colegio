import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticiasColegio } from '../../../src/models/Noticias.entity';
import { NoticiasImages } from '../../../src/models/Noticias.entity';
import { CreateFullNoticiaDto, CreateNoticiaDto } from '../../../src/dto/noticia.dto';
import { CreateImageDto } from '../../../src/dto/noticia.dto';

@Injectable()
export class NoticiasService {
    constructor(
        @InjectRepository(NoticiasColegio)
        private noticiasRepository: Repository<NoticiasColegio>,
        @InjectRepository(NoticiasImages)
        private imagenesRepository: Repository<NoticiasImages>,
    ) { }

    async createNoticiaWithImages(data: CreateFullNoticiaDto): Promise<NoticiasColegio> {
        // console.log('Función createNoticiaWithImages llamada con data:', data);
        const noticia = this.noticiasRepository.create(data.noticia);
        await this.noticiasRepository.save(noticia);

        for (let imgDto of data.images) {
            let imagenEntity = this.imagenesRepository.create({
                image_data: Buffer.from(imgDto.imageData, 'base64'),
                noticia
            });
            await this.imagenesRepository.save(imagenEntity);
        }

        return noticia;
    }

    async getAllNoticias(): Promise<NoticiasColegio[]> {
        return await this.noticiasRepository.find({ relations: ["images"] });
    }


    async getNoticiaById(noticiaId: number): Promise<NoticiasColegio> {
        const noticia = await this.noticiasRepository.findOne({
            where: { noticiaId: noticiaId },
            relations: ["images"]
        });
        if (!noticia) {
            throw new NotFoundException(`Noticia with ID ${noticiaId} not found`);
        }
        return noticia;
    }



}
