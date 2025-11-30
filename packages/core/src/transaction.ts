import { TransactionParams, TransactionResult } from './types';
import { StellarWallet } from './wallet';

export class TransactionManager {
  constructor(private wallet: StellarWallet) {}

  /**
   * Prepare and validate transaction parameters
   */
  validateTransaction(params: TransactionParams): void {
    if (!params.destination || params.destination.length !== 56) {
      throw new Error('Invalid destination address');
    }

    const amount = parseFloat(params.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (params.assetCode && !params.assetIssuer) {
      throw new Error('Asset issuer required when asset code is provided');
    }

    if (params.assetIssuer && !params.assetCode) {
      throw new Error('Asset code required when asset issuer is provided');
    }
  }

  /**
   * Execute a payment transaction
   */
  async executePayment(
    secretKey: string,
    params: TransactionParams
  ): Promise<TransactionResult> {
    this.validateTransaction(params);
    return await this.wallet.sendPayment(secretKey, params);
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(): Promise<string> {
    // Stellar base fee is 100 stroops (0.00001 XLM)
    // For simple transactions, this is usually sufficient
    return '0.00001';
  }
}
