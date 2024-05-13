// payment.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { Boleta } from 'src/models/Boleta.entity';
import { BoletaService } from '../Boleta/boleta.service';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        private readonly boletaService: BoletaService,
    ) {
        // Configure Transbank SDK with your keys
        WebpayPlus.configureForTesting();
    }


    async createTransaction(buyOrder: string, sessionId: string, amount: number, returnUrl: string) {
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        try {
            const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

            // Save transaction to database
            await this.transactionRepository.save({
                buyOrder: buyOrder,
                sessionId: sessionId,
                amount: amount,
                token: response.token,
                status: 'pendiente',
            });

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
            throw new Error(`Error while creating a transaction: ${error}`);
        }
    }

    async confirmTransaction(token: string) {
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        try {
            const response = await tx.commit(token);

            const { buy_order } = response;
            await this.transactionRepository.update(buy_order, { status: 'aprobado' })

            const parts = buy_order.split('-');
            const rawId = parts.pop();
            const idBoleta = parseInt(rawId, 10);

            await this.boletaService.updateBoletaStatus(idBoleta, 2, buy_order);

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
            throw new Error(`Error while confirming the transaction: ${error}`);
        }
    }

    /* 
    para ver el estado es lo mismo debo utilizar status() -> const response = await tx.status(token);
    
    Reversar o Anular un pago -> const response = await tx.refund(token, amount);

    */
}
