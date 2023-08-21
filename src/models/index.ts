import { TransactionEntity } from './transaction.entity';
import { Apoderado } from './Apoderado.entity';
import { Estudiante } from './Estudiante.entity';
import { ApoderadoEstudiante } from './ApoderadoEstudiante.entity';
import { ApoderadoDireccion } from './ApoderadoDireccion.entity';
import { Direccion } from './Direccion.entity';
import { Ciudad } from './Ciudad.entity';
import { Region } from './Region.entity';
import { Profesor } from './Profesor.entity';
import { Curso } from './Curso.entity';


export const entities = [Apoderado, ApoderadoEstudiante, ApoderadoDireccion,
                        Estudiante, Profesor, Curso,
                        Direccion, Ciudad, Region
                        ];

