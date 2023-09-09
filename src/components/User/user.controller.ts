import { Controller, Get, Post, Body, Response, Param } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { Usuarios } from 'src/models/User.entity';
import { Apoderado } from 'src/models/Apoderado.entity';


@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Get()
  findAll(): Promise<Usuarios[]> {
    return this.usuarioService.findAll();
  }


  @Get(':id/apoderado-alumnos')
  async getUserWithApoderadoAndAlumnos(@Param('id') userId: number): Promise<Usuarios> {
    return this.usuarioService.findUserWithApoderadoAndAlumnos(userId);
  }

  @Get(':id/profesor')
  async getUserWithProfesor(@Param('id') userId: number): Promise<Usuarios> {
    return this.usuarioService.findUserWithProfesor(userId);
  }

  @Post('/create-for-all-apoderados')
  async createUsersForAllApoderados(@Response() res): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllApoderados();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }

  @Post('/create-for-all-profesores')
  async createUsersForAllProfesores(@Response() res): Promise<void> {
    try {
      const createdUsers = await this.usuarioService.createUsersForAllProfesores();
      res.status(201).json({
        message: `${createdUsers.length} usuarios creados exitosamente.`,
        data: createdUsers
      });
    } catch (error) {
      res.status(500).json({
        message: 'Hubo un error al crear los usuarios.',
        error: error.message
      });
    }
  }
}
