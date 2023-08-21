import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Profesor } from './Profesor.entity';
@Entity()
export class Curso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nombre: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nivel_grado: string;

    @ManyToOne(() => Profesor, profesor => profesor.cursoConnection)
    @JoinColumn({ name: 'profesor_id' })
    profesorConnection: Profesor;


   
}
    // addStudent(student: Estudiante) {
    //     const connection = new ApoderadoEstudiante();
    //     connection.apoderado = this;
    //     connection.estudiante = student;
    //     this.estudiantesConnection.push(connection);
    // }

    // addAddress(address: Direccion) {
    //     const connection = new ApoderadoDireccion();
    //     connection.apoderado = this;
    //     connection.direccion = address;
    //     this.direccionConnection.push(connection);
    // }
