import { Account } from './types';

export class AccountManager {
  private accounts: Account[] = [];

  /**
   * Add a new account
   */
  addAccount(account: Account): void {
    const exists = this.accounts.some(acc => acc.publicKey === account.publicKey);
    if (exists) {
      throw new Error('Account already exists');
    }
    this.accounts.push(account);
  }

  /**
   * Remove an account
   */
  removeAccount(publicKey: string): void {
    const index = this.accounts.findIndex(acc => acc.publicKey === publicKey);
    if (index === -1) {
      throw new Error('Account not found');
    }
    this.accounts.splice(index, 1);
  }

  /**
   * Get all accounts
   */
  getAccounts(): Account[] {
    return [...this.accounts];
  }

  /**
   * Get account by public key
   */
  getAccount(publicKey: string): Account | undefined {
    return this.accounts.find(acc => acc.publicKey === publicKey);
  }

  /**
   * Update account name
   */
  updateAccountName(publicKey: string, name: string): void {
    const account = this.accounts.find(acc => acc.publicKey === publicKey);
    if (!account) {
      throw new Error('Account not found');
    }
    account.name = name;
  }

  /**
   * Update account balance
   */
  updateAccountBalance(publicKey: string, balance: string): void {
    const account = this.accounts.find(acc => acc.publicKey === publicKey);
    if (!account) {
      throw new Error('Account not found');
    }
    account.balance = balance;
  }
}
