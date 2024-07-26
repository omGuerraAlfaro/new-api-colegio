// anotacion.dto.ts
import { IsNumber } from 'class-validator';

export class AnotacionDto {
    @IsNumber()
    id: number;

    anotacion_descripcion: string;

    fecha_ingreso: Date;

    es_positiva: boolean;

    es_negativa: boolean;

    anotacion_estado: boolean;
}
