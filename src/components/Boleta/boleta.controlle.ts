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

    @Get(':rut')
    async getBoleta(@Param('rut') rut: string) {
        return await this.boletaService.findBoletas(rut);
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