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
import { ProfesorService } from './profesor.service';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) { }

  @Get()
  async getProfesores() {
    return await this.profesorService.findAll();
  }

  @Get(':id')
  async getProfesor(@Param('id') id: number) {
    return await this.profesorService.findOne(id);
  }

  
}

