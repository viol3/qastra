import { Keypair, Networks, Horizon, TransactionBuilder, BASE_FEE, Operation, Asset, Memo } from '@stellar/stellar-sdk';
import { WalletConfig, NetworkType, TransactionParams, TransactionResult } from './types';

export class StellarWallet {
  private horizonServer: Horizon.Server;
  private network: string;

  constructor(config: WalletConfig) {
    this.network = config.network === NetworkType.PUBLIC 
      ? Networks.PUBLIC 
      : Networks.TESTNET;
    
    const horizonUrl = config.horizonUrl || 
      (config.network === NetworkType.PUBLIC 
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org');
    
    this.horizonServer = new Horizon.Server(horizonUrl);
  }

  /**
   * Generate a new Stellar keypair
   */
  generateKeypair(): { publicKey: string; secretKey: string } {
    const keypair = Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Import account from secret key
   */
  importAccount(secretKey: string): { publicKey: string; secretKey: string } {
    const keypair = Keypair.fromSecret(secretKey);
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Get account balance and details
   */
  async getAccountDetails(publicKey: string) {
    try {
      const account = await this.horizonServer.loadAccount(publicKey);
      return {
        publicKey: account.accountId(),
        balances: account.balances,
        sequence: account.sequence,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load account: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Send payment transaction
   */
  async sendPayment(
    sourceSecretKey: string,
    params: TransactionParams
  ): Promise<TransactionResult> {
    try {
      const sourceKeypair = Keypair.fromSecret(sourceSecretKey);
      const sourceAccount = await this.horizonServer.loadAccount(sourceKeypair.publicKey());

      const asset = params.assetCode && params.assetIssuer
        ? new Asset(params.assetCode, params.assetIssuer)
        : Asset.native();

      let transactionBuilder = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network,
      }).addOperation(
        Operation.payment({
          destination: params.destination,
          asset: asset,
          amount: params.amount,
        })
      );

      if (params.memo) {
        transactionBuilder = transactionBuilder.addMemo(Memo.text(params.memo));
      }

      const transaction = transactionBuilder.setTimeout(30).build();
      transaction.sign(sourceKeypair);

      const result = await this.horizonServer.submitTransaction(transaction);

      return {
        hash: result.hash,
        ledger: result.ledger,
        success: result.successful,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Transaction failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fund testnet account (only works on testnet)
   */
  async fundTestnetAccount(publicKey: string): Promise<void> {
    if (this.network !== Networks.TESTNET) {
      throw new Error('Account funding is only available on testnet');
    }

    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (!response.ok) {
        throw new Error('Friendbot funding failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fund account: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(publicKey: string, limit: number = 10) {
    try {
      const transactions = await this.horizonServer
        .transactions()
        .forAccount(publicKey)
        .limit(limit)
        .order('desc')
        .call();

      return transactions.records;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get transaction history: ${error.message}`);
      }
      throw error;
    }
  }
}
