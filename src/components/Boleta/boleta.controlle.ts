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

    @Post('repactar/:id/:meses')
    async repactarBoleta(
        @Param('id') boletaId: number,
        @Param('meses') meses: number
    ): Promise<any> {
        try {
            if (isNaN(meses) || meses < 1 || meses > 3) {
                throw new HttpException('Número de meses inválido. Debe ser 1, 2 o 3.', HttpStatus.BAD_REQUEST);
            }

            const boletasRepactadas = await this.boletaService.repactarBoleta(boletaId, meses);
            return {
                message: 'Repactación realizada con éxito.',
                boletasRepactadas: boletasRepactadas
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}