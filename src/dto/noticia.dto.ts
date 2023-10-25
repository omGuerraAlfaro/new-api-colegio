export class CreateNoticiaDto {
    src: string;
    fecha: Date;
    titulo: string;
    description: string;
}

export class CreateImageDto {
    imageData: Buffer;
}

export class CreateFullNoticiaDto {
    noticia: CreateNoticiaDto;
    images: CreateImageDto[];
}