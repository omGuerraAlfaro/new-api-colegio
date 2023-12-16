import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from 'src/models/Boleta.entity';
import { Repository } from 'typeorm';
import { Apoderado } from 'src/models/Apoderado.entity';
import { ApoderadoService } from '../Apoderado/apoderado.service';

@Injectable()
export class BoletaService {

  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepository: Repository<Boleta>,
    @InjectRepository(Apoderado)
    private readonly apoderadoRepository: Repository<Apoderado>,
    private readonly apoderadoService: ApoderadoService,
  ) { }


  async findOne(id: number) {
    return await this.boletaRepository.findOne({ where: { id: id } });
  }

  async findAll() {
    return await this.boletaRepository.find();
  }

  async createAnnualBoletasForApoderadoRut(rut: string) {
    // Obtén los estudiantes asociados al apoderado
    const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut);

    if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
      throw new Error('No se encontraron estudiantes para el apoderado con el RUT proporcionado.');
    }

    const meses = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'matricula'];

    const boletas = [];

    for (const estudiante of apoderado.estudiantes) {
      for (const mes of meses) {
        const boleta = this.boletaRepository.create({
          apoderado_id: apoderado.id,
          // pago_id: , // Dejar como NULL o establecer si es necesario
          estado_id: 1, // Suponiendo que 1 es un estado válido, por ejemplo 'Pendiente'
          detalle: `Boleta de ${mes}`,
          subtotal: 100, // Establece tu lógica para el subtotal
          iva: 19, // Establece tu lógica para el IVA
          total: 119, // Total incluyendo el IVA, ajusta según tu lógica
          descuento: 0, // Aplica descuento si es necesario
          nota: `Generada automáticamente para el mes de ${mes}`,
          fecha: new Date(), // Fecha actual, puedes ajustarla para que coincida con el mes de la boleta si es necesario
        });

        // Guarda la boleta en la base de datos
        const savedBoleta = await this.boletaRepository.save(boleta);
        boletas.push(savedBoleta);
      }
    }

    // Retorna las boletas creadas
    return boletas;
  }

  async createAnnualBoletasForMultipleApoderados() {
    // Obtén un arreglo de todos los RUTs de apoderados
    const arrayRuts = await this.apoderadoService.findAllRut();

    const meses = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre', 'matricula'];
    const boletas = [];

    for (const rut of arrayRuts) {
      // Obtén los estudiantes asociados al apoderado
      const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut.rut);

      if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
        continue; // Si no hay estudiantes, continúa con el siguiente RUT
      }

      const rutEstudiante = apoderado.estudiantes[0].rut;
      
      for (const mes of meses) {
        const boleta = this.boletaRepository.create({
          apoderado: apoderado,
          // pago_id: , // Dejar como NULL o establecer si es necesario
          estado_id: 1, // Suponiendo que 1 es un estado válido, por ejemplo 'Pendiente'
          detalle: `Boleta de ${mes}`,
          subtotal: 100, // Establece tu lógica para el subtotal
          iva: 19, // Establece tu lógica para el IVA
          total: 119, // Total incluyendo el IVA, ajusta según tu lógica
          descuento: 0, // Aplica descuento si es necesario
          nota: `Generada automáticamente para el mes de ${mes}`,
          fecha: new Date(), // Fecha actual, puedes ajustarla para que coincida con el mes de la boleta si es necesario
        });

        // Guarda la boleta en la base de datos
        const savedBoleta = await this.boletaRepository.save(boleta);
        boletas.push(savedBoleta);
      }
    }

    // Retorna las boletas creadas
    return boletas;
  }

}






