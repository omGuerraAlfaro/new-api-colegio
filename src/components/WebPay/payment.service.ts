// payment.service.ts
import { Injectable } from '@nestjs/common';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes  } from 'transbank-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../../models/transaction.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(TransactionEntity)
        private transactionRepository: Repository<TransactionEntity>,
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
                status: 'pending',
            });

            return response;
        } catch (error) {
            throw new Error(`Error while creating a transaction: ${error}`);
        }
    }

    async confirmTransaction(token: string) {
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        try {
            const response = await tx.commit(token);

            await this.transactionRepository.update(
                { token: token },
                { status: response.getResponseCode() === 0 ? 'approved' : 'rejected' },
            );

            return response;
        } catch (error) {
            throw new Error(`Error while confirming the transaction: ${error}`);
        }
    }
}
