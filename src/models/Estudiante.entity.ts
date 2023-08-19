import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';

@Entity()
export class Estudiante {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    primer_nombre: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    segundo_nombre: string;

    @Column({ type: 'varchar', length: 50 })
    primer_apellido: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    segundo_apellido: string;

    @Column()
    fecha_nacimiento: Date;

    @Column({ type: 'varchar', length: 10 })
    rut: string;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    telefono_contacto: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    genero: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    alergico: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    vive_con: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    enfermedad_cronica: string;

    @OneToMany(() => ApoderadoEstudiante, apoderadoEstudiante => apoderadoEstudiante.estudiante)
    apoderadosConnection: ApoderadoEstudiante[];
}
