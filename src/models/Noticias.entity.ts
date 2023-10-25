import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('noticias_colegio')
export class NoticiasColegio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    src: string;

    @Column('date')
    fecha: Date;

    @Column()
    titulo: string;

    @Column('text')
    description: string;

    @Column({ default: 0 })
    likes_count: number;

    @OneToMany(() => NoticiasImages, image => image.noticia)
    images: NoticiasImages[];
}

@Entity('noticias_images')
export class NoticiasImages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('mediumblob')
    image_data: Buffer;

    @ManyToOne(() => NoticiasColegio, noticia => noticia.images)
    noticia: NoticiasColegio;
}
