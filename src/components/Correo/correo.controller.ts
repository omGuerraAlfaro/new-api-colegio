import { Controller, Post, Body, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Controller('correo')
export class CorreoController {

  constructor(@Inject(ConfigService) private configService: ConfigService) { }

  @Post('/enviar')
  @UsePipes(new ValidationPipe())
  async enviarCorreo(@Body() formData: any): Promise<any> {
    try {
      // Obteniendo credenciales de las variables de entorno
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      // Configuración del transporte de correo usando Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'mail.colegioandeschile.cl',
        port: 465,
        secure: true,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      // Construye el cuerpo del correo con los datos del formulario
      const correoHtml = `
        <h4><strong>Formulario Admisión 2024</strong></h4>
        <p><strong>Nombre completo del postulante:</strong> ${formData.pupilo}</p>
        <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
        <p><strong>Curso al que postula:</strong> ${formData.cursoPostula}</p>
        <p><strong>Teléfono:</strong> ${formData.telefono}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Colegio o Jardín de procedencia:</strong> ${formData.colegio}</p>
        <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
      `;

      // Opciones del correo
      const mailOptions = {
        from: emailUser,
        to: 'omar.guerra@outlook.cl',
        subject: 'Postulación Colegio Andes de Chile',
        html: correoHtml,
      };

      // Envía el correo
      const result = await transporter.sendMail(mailOptions);

      // Devuelve una respuesta de éxito
      return { message: 'Correo enviado con éxito', result };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
    }
  }
  @Post('/enviar/verano')
  @UsePipes(new ValidationPipe())
  async enviarCorreoVerano(@Body() formData: any): Promise<any> {
    try {
      // Obteniendo credenciales de las variables de entorno
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      // Configuración del transporte de correo usando Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'mail.colegioandeschile.cl',
        port: 465,
        secure: true,
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      // Construye el cuerpo del correo con los datos del formulario
      const correoHtml = `
        <h4><strong>Formulario Escuela de Verano</strong></h4>
        <p><strong>Nombre completo del postulante:</strong> ${formData.pupilo}</p>
        <p><strong>Nombre completo del apoderado:</strong> ${formData.apoderado}</p>
        <p><strong>Dirección:</strong> ${formData.direccion}</p>
        <p><strong>Teléfono:</strong> ${formData.telefono}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Consentimiento:</strong> ${formData.consentimiento ? 'Sí' : 'No'}</p>
      `;

      // Opciones del correo
      const mailOptions = {
        from: emailUser,
        to: 'omar.guerra@outlook.cl',
        subject: 'Postulación Escuela de Verano Colegio Andes de Chile',
        html: correoHtml,
      };

      // Envía el correo
      const result = await transporter.sendMail(mailOptions);

      // Devuelve una respuesta de éxito
      return { message: 'Correo enviado con éxito', result };
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Hubo un problema al enviar el correo. Por favor, intenta nuevamente.');
    }
  }
}
