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
import { BoletaService } from './boleta.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Boletas')
@Controller('boleta')
export class BoletaController {
    constructor(private readonly boletaService: BoletaService) { }

    @Get()
    async getBoletas() {
        return await this.boletaService.findAll();
    }

    @Get(':id')
    async getBoleta(@Param('id') id: number) {
        return await this.boletaService.findOne(id);
    }

    @Get('conteoEstudiante/:rut')
    getBoletasEstudiante(@Param('rut') rut: string) {
        return this.boletaService.createAnnualBoletasForApoderadoRut(rut);
    }

    @Post('generar-boletas')
    async getBoletasEstudiantes() {
        return await this.boletaService.createAnnualBoletasForMultipleApoderados();
    }

}