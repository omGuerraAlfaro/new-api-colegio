import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AnotacionService } from './anotacion.service';
import { AnotacionDto } from 'src/dto/anotacion.dto';

@Controller('anotaciones')
export class AnotacionController {
    constructor(private readonly anotacionService: AnotacionService) {}

    @Get('estudiante/:id')
    async getAnotacionesByEstudianteId(@Param('id', ParseIntPipe) id: number): Promise<AnotacionDto[]> {
        return await this.anotacionService.getAnotacionesByEstudianteId(id);
    }
}
