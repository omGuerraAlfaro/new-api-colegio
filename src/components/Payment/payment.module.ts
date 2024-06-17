import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { BoletaModule } from '../Boleta/boleta.module';
import { CorreoModule } from '../Correo/correo.module';
import { ApoderadoModule } from '../Apoderado/apoderado.module';
import { EstudianteModule } from '../Estudiante/estudiante.module';

@Module({
  imports: [EstudianteModule, ApoderadoModule, BoletaModule, CorreoModule, TypeOrmModule.forFeature([TransactionEntity])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
