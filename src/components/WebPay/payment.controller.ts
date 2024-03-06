// payment.controller.ts
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateTransactionDto } from '../../dto/create-transaction.dto';
import { ConfirmTransactionDto } from '../../dto/confirm-transaction.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WebPay')
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post('initiate')
    async initiate(@Body(ValidationPipe) createTransactionDto: CreateTransactionDto): Promise<any> {
        const response = await this.paymentService.createTransaction(
            createTransactionDto.buyOrder, 
            createTransactionDto.sessionId, 
            createTransactionDto.amount, 
            createTransactionDto.returnUrl
        );
        return response;
    }

    @Post('confirm')
    async confirm(@Body(ValidationPipe) confirmTransactionDto: ConfirmTransactionDto): Promise<any> {
        const transactionResult = await this.paymentService.confirmTransaction(confirmTransactionDto.token);
        return transactionResult;
    }
}

