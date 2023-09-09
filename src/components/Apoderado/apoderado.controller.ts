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
import { ApoderadoService } from './apoderado.service';
import { ApoderadoDTO } from 'src/dto/apoderado.dto';

@Controller('apoderado')
export class ApoderadoController {
  constructor(private readonly apoderadoService: ApoderadoService) { }

  @Post()
  async createApoderadoWithEstudiantes(@Body() apoderadoData: ApoderadoDTO) {
      return this.apoderadoService.createApoderadoWithEstudiantes(apoderadoData);
  }


  @Get()
  async getApoderados() {
    return await this.apoderadoService.findAll();
  }

  @Get(':id')
  async getApoderado(@Param('id') id: number) {
    return await this.apoderadoService.findOne(id);
  }

  @Get(':id/only-estudents')
  async getStudentsByApoderadoId(@Param('id') id: number) {
    return await this.apoderadoService.findStudentsByApoderadoId(id);
  }

  @Get(':id/with-estudents')
  async getStudentsWithApoderadoId(@Param('id') id: number) {
    return await this.apoderadoService.findStudentsWithApoderadoId(id);
  }

  @Get(':id/with-address')
  async getApoderadoWhitDireccion(@Param('id') id: number) {
    return await this.apoderadoService.findAddressWithApoderadoId(id);
  }


}

