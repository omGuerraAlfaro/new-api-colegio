import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateFullNoticiaDto } from '../../../src/dto/noticia.dto';
import { NoticiasColegio } from 'src/models/Noticias.entity';


@Controller('noticias')
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) { }
    
    @Post()
    create(@Body() createFullNoticiaDto: CreateFullNoticiaDto): Promise<NoticiasColegio> {
        console.log('Función create llamada con data:', createFullNoticiaDto);
        
        try {
            return this.noticiasService.createNoticiaWithImages(createFullNoticiaDto);            
        } catch (error) {
            throw new HttpException('Error al crear noticia', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    findAll(): Promise<NoticiasColegio[]> {
        return this.noticiasService.getAllNoticias();
    }

    
}
