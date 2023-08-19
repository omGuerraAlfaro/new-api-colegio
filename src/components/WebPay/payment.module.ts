import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
