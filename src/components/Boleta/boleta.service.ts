import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from 'src/models/Boleta.entity';
import { MoreThan, Repository } from 'typeorm';
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

  async findBoletas(rut_apoderado: string) {
    const boletas = await this.boletaRepository.find({ where: { rut_apoderado: rut_apoderado } });

    // Objeto para agrupar las boletas por estudiante
    const groupedBoletas = {};

    // Un conjunto para llevar un registro de los RUTs de los estudiantes únicos
    const estudianteRuts = new Set(boletas.map(boleta => boleta.rut_estudiante));

    // Contador para crear claves secuenciales
    let estudianteCounter = 1;

    estudianteRuts.forEach(rutEstudiante => {
      const boletasEstudiante = boletas.filter(boleta => boleta.rut_estudiante === rutEstudiante);
      
      // Separar las boletas en boletasColegiatura y boletasPae
      const boletasColegiatura = boletasEstudiante.filter(boleta => !boleta.detalle.startsWith("Boleta de PAE"));
      const boletasPae = boletasEstudiante.filter(boleta => boleta.detalle.startsWith("Boleta de PAE"));
      
      // Agregar las boletas separadas al objeto agrupado
      groupedBoletas[`estudiante${estudianteCounter}`] = {
        boletasColegiatura,
        boletasPae
      };
      
      estudianteCounter++;
    });

    return { boletas: groupedBoletas };
  }


  async findAll() {
    return await this.boletaRepository.find();
  }

  async findAllBoletasApoderado() {
    const boletas = await this.boletaRepository.find();
  
    const boletasConApoderado = await Promise.all(boletas.map(async (boleta) => {
      const apoderado = await this.apoderadoRepository.findOne({
        where: { rut: boleta.rut_apoderado }
      });
  
      return { ...boleta, apoderado };
    }));
  
    return boletasConApoderado;
  }
  

  async createAnnualBoletasForApoderadoRut(rut: string) { //malo
    // Obtén los estudiantes asociados al apoderado
    const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut);

    if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
      throw new Error('No se encontraron estudiantes para el apoderado con el RUT proporcionado.');
    }

    const meses = ['matricula', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const boletas = [];
    const boletasPae = [];

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
          fecha_vencimiento: new Date(), // Fecha actual, puedes ajustarla para que coincida con el mes de la boleta si es necesario
        });

        // Guarda la boleta en la base de datos
        const savedBoleta = await this.boletaRepository.save(boleta);
        boletas.push(savedBoleta);
      }
      if (estudiante.infoPae) {
        for (const mes of meses) {
          const boletaPae = this.boletaRepository.create({
            apoderado_id: apoderado.id,
            // pago_id: , // Dejar como NULL o establecer si es necesario
            estado_id: 1, // Suponiendo que 1 es un estado válido, por ejemplo 'Pendiente'
            detalle: `Boleta de PAE de ${mes}`,
            subtotal: 100, // Establece tu lógica para el subtotal
            iva: 19, // Establece tu lógica para el IVA
            total: 119, // Total incluyendo el IVA, ajusta según tu lógica
            descuento: 0, // Aplica descuento si es necesario
            nota: `Generada automáticamente para el mes de ${mes}`,
            fecha_vencimiento: new Date(), // Fecha actual, puedes ajustarla para que coincida con el mes de la boleta si es necesario
          });
  
          // Guarda la boleta en la base de datos
          const savedBoletaPae = await this.boletaRepository.save(boletaPae);
          boletasPae.push(savedBoletaPae);
        }
      }
    }

    // Retorna las boletas creadas
    return boletas;
  }

  async createAnnualBoletasForMultipleApoderados() {
    // Obtén un arreglo de todos los RUTs de apoderados
    const arrayRuts = await this.apoderadoService.findAllRut();

    const meses = ['matricula', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const boletas = [];
    const mesesPae = ['marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const boletasPae = [];

    for (const rut of arrayRuts) {
      const apoderado = await this.apoderadoService.findStudentsWithApoderadoId(rut.rut);

      if (!apoderado.estudiantes || apoderado.estudiantes.length === 0) {
        continue; // Si no hay estudiantes, continúa con el siguiente RUT
      }

      const rutApoderado = apoderado.rut;
      const descuentoApoderdado = apoderado.descuento_asignado;
      //trae de apoderado un descuento y este despues se calcula el subtotal con el descuento => total.

      for (const estudiante of apoderado.estudiantes) {
        const rutEstudiante = estudiante.rut;

        for (const mes of meses) {
          const fechaActual = new Date();
          let anio = fechaActual.getFullYear() + 1;
          let mesIndex = meses.indexOf(mes);
          let subtotal = 190000;
          let total = 0;

          if (mes === 'matricula') {
            mesIndex = fechaActual.getMonth();
            subtotal = 1000000;
            total = subtotal;
          } else {
            mesIndex += 2;
            subtotal = 190000;  
            total = subtotal - (subtotal * descuentoApoderdado) / 100;
          }

          const fechaVencimiento = new Date(anio, mesIndex, 5);

          const boleta = this.boletaRepository.create({
            apoderado: apoderado,
            rut_estudiante: rutEstudiante,
            rut_apoderado: rutApoderado,
            // pago_id: , // ESTE CAMPO SE MODIFICA AL MOMENTO DE PAGAR
            estado_id: 1, // 1 es 'Pendiente'
            detalle: `Boleta de ${mes}`,
            subtotal: subtotal, // lógica para el subtotal
            iva: 19, // lógica para el IVA
            total: total, // Total incluyendo el IVA, ajustar lógica
            descuento: descuentoApoderdado, // Aplica descuento. CASE para mensualidades.
            nota: `Generada automáticamente para el mes de ${mes}`,
            fecha_vencimiento: fechaVencimiento,
          });

          // Guarda la boleta en la base de datos
          const savedBoleta = await this.boletaRepository.save(boleta);
          boletas.push(savedBoleta);

        }
        if (estudiante.infoPae) {
          for (const mesPae of mesesPae) {
            const fechaActual = new Date();
            let anio = fechaActual.getFullYear() + 1;
            let mesIndex = mesesPae.indexOf(mesPae);
            const { valor, descripcion } = estudiante.infoPae;
            let subtotal = valor;
            let total = subtotal;
  
            const fechaVencimiento = new Date(anio, mesIndex, 5);
  
            const boletaPae = this.boletaRepository.create({
              apoderado: apoderado,
              rut_estudiante: rutEstudiante,
              rut_apoderado: rutApoderado,
              // pago_id: , // ESTE CAMPO SE MODIFICA AL MOMENTO DE PAGAR
              estado_id: 1, // 1 es 'Pendiente'
              detalle: `Boleta de PAE de ${mesPae}, descripcion: ${descripcion}`,
              subtotal: subtotal, // lógica para el subtotal
              iva: 19, // lógica para el IVA
              total: total, // Total incluyendo el IVA, ajustar lógica
              descuento: 0, // Aplica descuento. CASE para mensualidades.
              nota: `Generada automáticamente para el mes de ${mesPae}`,
              fecha_vencimiento: fechaVencimiento,
            });
  
            // Guarda la boleta en la base de datos
            const savedBoletaPae = await this.boletaRepository.save(boletaPae);
            boletasPae.push(savedBoletaPae);
          }
        }
      }
    }

    // Retorna las boletas creadas
    return {boletas, boletasPae};
  }

  async repactarBoleta(boletaId: number, meses: number): Promise<Boleta[]> {
    if (meses < 1 || meses > 2) {
      throw new Error('La repactación puede ser solo de 1 o 2 meses después del actual.');
    }
  
    const boletaActual = await this.boletaRepository.findOne({ where: { id: boletaId } });
    if (!boletaActual) {
      throw new Error('Boleta no encontrada.');
    }
  
    if (boletaActual.estado_id !== 1) { // Asumiendo que 1 es 'Pendiente'
      throw new Error('Solo se pueden repactar boletas que estén pendientes.');
    }
  
    // Encuentra las boletas de los meses siguientes
    const fechaVencimientoOriginal = boletaActual.fecha_vencimiento;
    const boletasFuturas = await this.boletaRepository.find({
      where: {
        rut_estudiante: boletaActual.rut_estudiante,
        fecha_vencimiento: MoreThan(fechaVencimientoOriginal)
      },
      order: {
        fecha_vencimiento: 'ASC'
      },
      take: meses
    });
  
    if (boletasFuturas.length < meses) {
      throw new Error('No hay suficientes boletas futuras para repactar.');
    }
  
    const montoPorMes = boletaActual.subtotal / meses;
  
    for (const [index, boletaFutura] of boletasFuturas.entries()) {
      const subtotalActualizado = Number(boletaFutura.subtotal) + montoPorMes;
    
      boletaFutura.subtotal = subtotalActualizado;
      const subSubtotal = subtotalActualizado - (subtotalActualizado * boletaActual.descuento) / 100;
      boletaFutura.total = subSubtotal;
      boletaFutura.nota += ` Incluye repactación de la boleta actual - Cuota ${index + 1}.`;
      await this.boletaRepository.save(boletaFutura);
    }
  
    // Cambiar estado de la boleta actual a 'Repactada'
    boletaActual.estado_id = 4; // Asumiendo que 4 es 'Repactada'
    await this.boletaRepository.save(boletaActual);
  
    return boletasFuturas;
  }
  


}






