import { IsInt, IsString, Min } from 'class-validator';

export class UpdateBoletaDto {
    @IsInt()
    @Min(1)
    idBoleta: number;

    @IsInt()
    estado: number;

    @IsString()
    idPago: string;
}
