import { Get, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boleta } from 'src/models/Boleta.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
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

  async findAllBoletasConApoderado(): Promise<Boleta[]> {
    return this.boletaRepository.find({ relations: ['apoderado'] });
  }

  async reenumerateBoletas(): Promise<void> {
    const boletas = await this.boletaRepository.find({ order: { id: 'ASC' } });

    let newId = 1;
    for (const boleta of boletas) {
      await this.boletaRepository.update(boleta.id, { id: newId });
      newId++;
    }

    await this.boletaRepository.query(`ALTER TABLE boletas AUTO_INCREMENT = ${newId}`);
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
    try {
      // Tu código asíncrono aquí
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
            let anio = fechaActual.getFullYear();
            let mesIndex = meses.indexOf(mes);
            let valorMatricula = 220000;
            let subTotal = 0;
            let total = 0;

            if (mes === 'matricula') {
              mesIndex = 0;
              total = valorMatricula;
              subTotal = total
            } else {
              mesIndex += 1;
              total = descuentoApoderdado;
              subTotal = total
            }

            const fechaVencimiento = new Date(anio, mesIndex, 1);

            const boleta = this.boletaRepository.create({
              apoderado: apoderado,
              rut_estudiante: rutEstudiante,
              rut_apoderado: rutApoderado,
              // pago_id: , // ESTE CAMPO SE MODIFICA AL MOMENTO DE PAGAR
              estado_id: 1, // 1 es 'Pendiente'
              detalle: `Boleta de ${mes}`,
              subtotal: subTotal, // lógica para el subtotal
              iva: 19, // lógica para el IVA
              total: total, // Total incluyendo el IVA, ajustar lógica
              descuento: descuentoApoderdado, // Aplica descuento. CASE para mensualidades.
              nota: `Boleta mes de ${mes}`,
              fecha_vencimiento: fechaVencimiento,
            });

            // Guarda la boleta en la base de datos
            const savedBoleta = await this.boletaRepository.save(boleta);
            boletas.push(savedBoleta);

          }
          if (estudiante.infoPae) {
            for (const mesPae of mesesPae) {
              const fechaActual = new Date();
              let anio = fechaActual.getFullYear();
              let mesIndex = mesesPae.indexOf(mesPae) + 2;
              const { valor, descripcion } = estudiante.infoPae;
              let subtotal = valor;
              let total = subtotal;

              const fechaVencimiento = new Date(anio, mesIndex, 1);

              const boletaPae = this.boletaRepository.create({
                apoderado: apoderado,
                rut_estudiante: rutEstudiante,
                rut_apoderado: rutApoderado,
                // pago_id: , // ESTE CAMPO SE MODIFICA AL MOMENTO DE PAGAR
                estado_id: 1, // 1 es 'Pendiente'
                detalle: `Boleta de PAE de ${mesPae}, descripcion: ${descripcion}`,
                subtotal: subtotal,
                iva: 19,
                total: total,
                descuento: 0,
                nota: `Boleta PAE mes de ${mesPae}`,
                fecha_vencimiento: fechaVencimiento,
              });

              // Guarda la boleta en la base de datos
              const savedBoletaPae = await this.boletaRepository.save(boletaPae);
              boletasPae.push(savedBoletaPae);
            }
          }
        }
        return { boletas, boletasPae };
      }
    } catch (error) {
      console.error("Se ha producido un error:", error);
    }
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

  async updateBoletaStatus(idBoleta: number, nuevoEstado: number, idPago: string): Promise<void> {
    await this.boletaRepository.update(idBoleta, { estado_id: nuevoEstado, pago_id: idPago });
  }


  async findBoletaById(id: number): Promise<Boleta> {
    try {
      const boleta = await this.boletaRepository.findOne({ where: { id } });
      if (!boleta) {
        throw new NotFoundException('Boleta no encontrada');
      }
      return boleta;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar la boleta');
    }
  }

  async getPendientesVencidas(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const boletas = await this.boletaRepository.createQueryBuilder('boleta')
        .where('boleta.estado_id = :estadoId', { estadoId: 1 })
        .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .getMany();
      return { boletas };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las boletas pendientes y vencidas');
    }
  }

  async getTotalPendienteVencido(fecha: string) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const result = await this.boletaRepository.createQueryBuilder('boleta')
        .select('SUM(boleta.total)', 'total_pendiente_vencido')
        .where('boleta.estado_id = :estadoId', { estadoId: 1 })
        .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .getRawOne();
      return result.total_pendiente_vencido ? { total_pendiente_vencido: result.total_pendiente_vencido } : { total_pendiente_vencido: 0 };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el total pendiente vencido');
    }
  }

  async getApoderadosMorosos(fecha: string, estadoId: number) {
    try {
      const currentDate = fecha ? new Date(fecha) : new Date();
      const result = await this.boletaRepository.createQueryBuilder('boleta')
        .select([
          'boleta.apoderado_id',
          'COUNT(*) as cantidad_morosos',
          'apoderado.primer_nombre',
          'apoderado.segundo_nombre',
          'apoderado.primer_apellido',
          'apoderado.segundo_apellido',
          'apoderado.fecha_nacimiento',
          'apoderado.rut',
          'apoderado.dv',
          'apoderado.telefono',
          'apoderado.correo_electronico'
        ])
        .leftJoin('boleta.apoderado', 'apoderado')
        .where('boleta.estado_id = :estadoId', { estadoId })
        .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
        .groupBy('boleta.apoderado_id')
        .addGroupBy('apoderado.id')
        .getRawMany();

      const apoderadosMorosos = await Promise.all(result.map(async row => {
        const boletasPendientes = await this.boletaRepository.createQueryBuilder('boleta')
          .where('boleta.apoderado_id = :apoderadoId', { apoderadoId: row.apoderado_id })
          .andWhere('boleta.estado_id = :estadoId', { estadoId })
          .andWhere('boleta.fecha_vencimiento < :currentDate', { currentDate })
          .getMany();

        const nombreCompleto = [
          row.primer_nombre,
          row.segundo_nombre,
          row.primer_apellido,
          row.segundo_apellido,
        ].filter(Boolean).join(' ');

        const rutCompleto = [
          row.rut,
          row.dv,
        ].filter(Boolean).join('-');

        return {
          apoderado_id: row.apoderado_id,
          cantidad_morosos: row.cantidad_morosos,
          apoderado: {
            id: row['apoderado_id'],
            nombreCompleto,
            rut: rutCompleto,
            telefono: row['telefono'],
            correo_electronico: row['correo_electronico'],
          },
          boletasPendientes,
        };
      }));

      const totalApoderadosMorosos = apoderadosMorosos.length;

      return {
        total: totalApoderadosMorosos,
        apoderados: apoderadosMorosos,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los apoderados morosos');
    }
  }
}