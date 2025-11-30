export enum NetworkType {
  PUBLIC = 'PUBLIC',
  TESTNET = 'TESTNET',
}

export interface WalletConfig {
  network: NetworkType;
  horizonUrl?: string;
}

export interface Account {
  publicKey: string;
  name: string;
  balance?: string;
}

export interface StoredWallet {
  accounts: Account[];
  activeAccountIndex: number;
  network: NetworkType;
}

export interface TransactionParams {
  destination: string;
  amount: string;
  assetCode?: string;
  assetIssuer?: string;
  memo?: string;
}

export interface TransactionResult {
  hash: string;
  ledger: number;
  success: boolean;
}
