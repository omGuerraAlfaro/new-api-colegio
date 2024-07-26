import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import { Estudiante } from './Estudiante.entity';
import { AnotacionesEstudiante } from './AnotacionesEstudiantes.entity';

@Entity()
export class Anotacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    anotacion_titulo: string;

    @Column({ type: 'varchar', length: 1000 })
    anotacion_descripcion: string;

    @CreateDateColumn({ nullable: false })
    fecha_ingreso: Date;

    @Column({ type: 'boolean', default: false })
    es_positiva: boolean;

    @Column({ type: 'boolean', default: false })
    es_negativa: boolean;

    @Column({ type: 'boolean', default: true })
    anotacion_estado: boolean;

    @OneToMany(() => AnotacionesEstudiante, anotacionesEstudiante => anotacionesEstudiante.anotacion, {
        cascade: true,
    })
    estudiantesConnection: AnotacionesEstudiante[];
}
