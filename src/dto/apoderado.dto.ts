import { IsEmail, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ApoderadoDTO {
    @ApiProperty()
    @IsOptional()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    primer_nombre: string;

    @ApiProperty()
    @IsOptional()
    segundo_nombre?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    primer_apellido: string;

    @ApiProperty()
    @IsOptional()
    segundo_apellido?: string | null;

    @ApiProperty()
    @IsNotEmpty()
    fecha_nacimiento: Date;

    @ApiProperty()
    @IsNotEmpty()
    rut: string;

    @ApiProperty()
    @IsNotEmpty()
    dv: string;

    @ApiProperty()
    @IsOptional()
    telefono?: string | null;

    @ApiProperty()
    @IsEmail()
    correo_electronico: string;

    @ApiProperty()
    @IsOptional()
    estado_civil?: string | null;

    @ApiProperty()
    @IsOptional()
    nacionalidad?: string | null;

    @ApiProperty()
    @IsOptional()
    actividad?: string | null;

    @ApiProperty()
    @IsOptional()
    escolaridad?: string | null;
}
