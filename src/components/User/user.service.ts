import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { Profesor } from 'src/models/Profesor.entity';
import { Usuarios } from 'src/models/User.entity';
import { Repository } from 'typeorm';
import { hash } from "bcrypt";
import { Administrador } from 'src/models/Administrador.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly usuarioRepository: Repository<Usuarios>,
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Administrador)
    private readonly administradorRepository: Repository<Administrador>,
  ) { }

  async findAll(): Promise<Usuarios[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuarios[]> {
    return this.usuarioRepository.find({where: {id: id}});
  }

  async findUserWithApoderadoAndAlumnos(userId: number): Promise<Usuarios> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['apoderado', 'apoderado.estudiantesConnection', 'apoderado.estudiantesConnection.estudiante']
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.apoderado && user.profesor_id) {
      throw new NotFoundException('This user is a teacher (profesor), not a guardian (apoderado).');
    }

    // Transformar la estructura de estudiantesConnection para obtener solo los estudiantes
    if (user.apoderado) {
      user.apoderado.estudiantes = user.apoderado.estudiantesConnection.map(conn => conn.estudiante);
      delete user.apoderado.estudiantesConnection; // Eliminar la conexión para no enviarla en la respuesta
    }

    return user;
  }


  async findUserWithProfesor(userId: number): Promise<Usuarios> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['profesor']
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.profesor && user.apoderado_id) {
      throw new NotFoundException('This user is a (apoderado), not a (profesor).');
    }

    return user;
  }




  async createUsersForAllApoderados(): Promise<Usuarios[]> {
    const apoderados = await this.apoderadoRepository.find();
    const createdUsers: Usuarios[] = [];

    for (const apoderado of apoderados) {
      const username = this.generateUsername(apoderado.primer_nombre, apoderado.primer_apellido);
      const plainPassword = apoderado.rut;
      const hashedPassword = await hash(plainPassword, 5); // Hash the password

      const existingUser = await this.usuarioRepository.findOne({ where: { username } });
      if (existingUser) {
        // Si el usuario ya existe, puedes decidir saltarte este apoderado o actualizar el usuario existente.
        continue;
      }

      const usuario = new Usuarios();
      usuario.username = username;
      usuario.password = hashedPassword; // Store the hashed password
      usuario.correo_electronico = apoderado.correo_electronico; 
      usuario.apoderado_id = apoderado.id;
      usuario.rut = apoderado.rut;
      

      const savedUser = await this.usuarioRepository.save(usuario);
      createdUsers.push(savedUser);
    }

    return createdUsers;
  }


  async createUsersForAllProfesores(): Promise<Usuarios[]> {
    const profesores = await this.profesorRepository.find();
    const createdUsers: Usuarios[] = [];

    for (const profesor of profesores) {
      const username = this.generateUsername(profesor.primer_nombre, profesor.primer_apellido);
      const plainPassword = profesor.rut;
      const hashedPassword = await hash(plainPassword, 5);

      const existingUser = await this.usuarioRepository.findOne({ where: { username } });
      if (existingUser) {
        // Si el usuario ya existe, puedes decidir saltarte este profesor o actualizar el usuario existente.
        continue;
      }

      const usuario = new Usuarios();
      usuario.username = username;
      usuario.password = hashedPassword;
      usuario.correo_electronico = profesor.correo_electronico; // Asumiendo que el campo se llama correo_electronico en profesor
      usuario.profesor_id = profesor.id; // Asumiendo que el campo se llama id en profesor

      const savedUser = await this.usuarioRepository.save(usuario);
      createdUsers.push(savedUser);
    }

    return createdUsers;
  }

  async createUsersForAllAdministradores(): Promise<Usuarios[]> {
    const administradores = await this.administradorRepository.find();
    const createdUsers: Usuarios[] = [];

    for (const administrador of administradores) {
      const username = this.generateUsername(administrador.primer_nombre, administrador.primer_apellido);
      const plainPassword = administrador.rut;
      const hashedPassword = await hash(plainPassword, 5);

      const existingUser = await this.usuarioRepository.findOne({ where: { username } });
      if (existingUser) {
        continue;
      }

      const usuario = new Usuarios();
      usuario.username = username;
      usuario.password = hashedPassword;
      usuario.correo_electronico = administrador.correo_electronico; 
      usuario.administrador_id = administrador.id;

      const savedUser = await this.usuarioRepository.save(usuario);
      createdUsers.push(savedUser);
    }

    return createdUsers;
}


  private generateUsername(primerNombre: string, primerApellido: string): string {
    let baseUsername = `${primerNombre}.${primerApellido}`;
    baseUsername = baseUsername.toLowerCase();
    // Puedes agregar lógica adicional para manejar nombres de usuario duplicados
    return baseUsername;
  }

}
