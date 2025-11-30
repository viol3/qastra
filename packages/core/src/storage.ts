import { StoredWallet } from './types';

/**
 * Abstract storage interface for different platforms
 * Browser extension will use chrome.storage
 * Mobile apps will use AsyncStorage or SecureStore
 */
export interface IStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class WalletStorage {
  private readonly WALLET_KEY = 'starcade_wallet';
  private readonly ENCRYPTED_KEYS_PREFIX = 'starcade_key_';

  constructor(private storage: IStorage) {}

  /**
   * Save wallet state (without private keys)
   */
  async saveWallet(wallet: StoredWallet): Promise<void> {
    const data = JSON.stringify(wallet);
    await this.storage.set(this.WALLET_KEY, data);
  }

  /**
   * Load wallet state
   */
  async loadWallet(): Promise<StoredWallet | null> {
    const data = await this.storage.get(this.WALLET_KEY);
    if (!data) return null;
    return JSON.parse(data);
  }

  /**
   * Save encrypted private key for an account
   * Note: In production, implement proper encryption
   */
  async saveSecretKey(publicKey: string, encryptedSecret: string): Promise<void> {
    const key = this.ENCRYPTED_KEYS_PREFIX + publicKey;
    await this.storage.set(key, encryptedSecret);
  }

  /**
   * Load encrypted private key for an account
   */
  async loadSecretKey(publicKey: string): Promise<string | null> {
    const key = this.ENCRYPTED_KEYS_PREFIX + publicKey;
    return await this.storage.get(key);
  }

  /**
   * Remove private key for an account
   */
  async removeSecretKey(publicKey: string): Promise<void> {
    const key = this.ENCRYPTED_KEYS_PREFIX + publicKey;
    await this.storage.remove(key);
  }

  /**
   * Clear all wallet data
   */
  async clearAll(): Promise<void> {
    await this.storage.clear();
  }
}
