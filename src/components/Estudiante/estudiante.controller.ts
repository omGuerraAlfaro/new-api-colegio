import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) { }

  @Get()
  async getEstudiantes() {
    return await this.estudianteService.findAll();
  }

  @Get(':id')
  async getEstudiante(@Param('id') id: number) {
    return await this.estudianteService.findOne(id);
  }
}

