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
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApoderadoService } from './apoderado.service';
import { ApoderadoDTO } from 'src/dto/apoderado.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
@ApiBearerAuth()
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

  // @UseGuards(JwtAuthGuard)
  @Get('/rut')
  async getRutApoderados() {
    return await this.apoderadoService.findAllRut();
  }

  @Get(':id')
  async getApoderado(@Param('id') id: number) {
    return await this.apoderadoService.findOne(id);
  }

  @Get(':rut/with-estudents')
  async getStudentsWithApoderadoId(@Param('rut') rut: string) {
    return await this.apoderadoService.findStudentsWithApoderadoId(rut);
  }

  @Get(':id/with-address')
  async getApoderadoWhitDireccion(@Param('id') id: number) {
    return await this.apoderadoService.findAddressWithApoderadoId(id);
  }

  @Get('rut/:rut')
  async getApoderadoByRut(@Param('rut') rut: string) {
    try {
      const apoderado = await this.apoderadoService.findApoderadoByRut(rut);
      if (!apoderado) {
        throw new NotFoundException('Apoderado no encontrado');
      }
      return apoderado;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el apoderado');
    }
  }

}

