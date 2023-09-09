import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    ManyToOne
} from 'typeorm';
import { Apoderado } from './Apoderado.entity';
import { Profesor } from './Profesor.entity';

@Entity()
export class Usuarios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    correo_electronico: string;

    @Column({ name: 'apoderado_id', nullable: true })
    apoderado_id: number;

    @ManyToOne(() => Apoderado, apoderado => apoderado.usuario)
    @JoinColumn({ name: 'apoderado_id' })
    apoderado: Apoderado;

    @Column({ name: 'profesor_id', nullable: true })
    profesor_id: number;

    @ManyToOne(() => Profesor, profesor => profesor.usuario)
    @JoinColumn({ name: 'profesor_id' })
    profesor: Profesor;
}
