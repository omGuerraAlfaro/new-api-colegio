import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { ApoderadoDTO } from 'src/dto/apoderado.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Apoderados')
@Controller('apoderado')
export class ApoderadoController {
  constructor(private readonly apoderadoService: ApoderadoService) { }

  @Post()
  @HttpCode(201)
  async createApoderadoWithEstudiantes(@Body() apoderadoData: ApoderadoDTO) {
    return this.apoderadoService.createApoderadoWithEstudiantes(apoderadoData);
  }

  @Post('array-object')
  @HttpCode(201)
  async saveAllApoderadosWithEstudiantes(@Body() data: { apoderados: ApoderadoDTO[] }) {
    return this.apoderadoService.saveAllApoderadosWithEstudiantes(data);
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

  @Get(':rut/with-estudents')
  async getStudentsWithApoderadoId(@Param('rut') rut: string) {
    return await this.apoderadoService.findStudentsWithApoderadoId(rut);
  }

  @Get(':id/with-address')
  async getApoderadoWhitDireccion(@Param('id') id: number) {
    return await this.apoderadoService.findAddressWithApoderadoId(id);
  }


}

