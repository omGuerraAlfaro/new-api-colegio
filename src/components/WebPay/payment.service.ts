// payment.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../../models/transaction.entity';
import { Boleta } from 'src/models/Boleta.entity';
import { BoletaService } from '../Boleta/boleta.service';

@Injectable()
export class PaymentService {
    private commerceCode: string;
    private apiKey: string;

    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
        private readonly boletaService: BoletaService,
    ) {
        this.commerceCode = process.env.COMMERCE_CODE;
        this.apiKey = process.env.API_KEY;

        if (!this.commerceCode || !this.apiKey) {
            throw new Error('COMMERCE_CODE and API_KEY must be defined in environment variables');
        }

        WebpayPlus.configureForProduction(this.commerceCode, this.apiKey);
    }


    async createTransaction(buyOrder: string, sessionId: string, amount: number, returnUrl: string) {
        //const tx = new WebpayPlus.Transaction(new Options(this.commerceCode, this.apiKey, Environment.Production));
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
        }
    }

    async confirmTransaction(token: string) {
        //const tx = new WebpayPlus.Transaction(new Options(this.commerceCode, this.apiKey, Environment.Production));
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        try {
            const response = await tx.commit(token);

            const { buy_order } = response;
            const parts = buy_order.split('-');
            const rawIds = parts.length === 4 ? parts.slice(-2) : parts.slice(-1);
            const idsBoletas = rawIds.map((rawId: string) => parseInt(rawId, 10));

            for (const idBoleta of idsBoletas) {
                await this.boletaService.updateBoletaStatus(idBoleta, 2, buy_order);
            }

            await this.updateTransactionStatus(token, 'aprobado');

            return response;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


    private async updateTransactionStatus(token: string, status: string) {
        const transaction = await this.transactionRepository.findOne({ where: { token } });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        transaction.status = status;
        await this.transactionRepository.save(transaction);
    }

    /* 
    para ver el estado es lo mismo debo utilizar status() -> const response = await tx.status(token);
    
    Reversar o Anular un pago -> const response = await tx.refund(token, amount);

    */
}
