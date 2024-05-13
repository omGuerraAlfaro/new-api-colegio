import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Boleta } from 'src/models/Boleta.entity';
import { BoletaModule } from '../Boleta/boleta.module';

@Module({
  imports: [BoletaModule, TypeOrmModule.forFeature([TransactionEntity])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
