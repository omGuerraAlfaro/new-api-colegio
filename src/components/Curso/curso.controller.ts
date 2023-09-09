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
import { CursoService } from './curso.service';
import { log } from 'console';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) { }

  @Get()
  async getCursos() {
    return await this.cursoService.findAllWithTeacher();
  }

  @Get(':id')
  async getCursoId(@Param('id') id: number) {
    return await this.cursoService.findOneWithCurse(id);
  }

  @Get(':id/students')
  async getStudentsByCursoId(@Param('id') id: number) {
    try {
      const result = await this.cursoService.findStudentsWithCursoId(id);
      if (!result) {
        console.log('No se encontraron estudiantes para el curso con id: ' + id);

      }
      return result;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
  @Get(':id/apoderados-estudiantes')
  async getCursoWithAE(@Param('id') id: number) {
    try {
      const result = await this.cursoService.findCursoWithApoderadoAndEstudiante(id);
      if (!result) {
        console.log('No se encontraron estudiantes para el curso con id: ' + id);

      }
      return result;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

}