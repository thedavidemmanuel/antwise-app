// services/TransactionService.ts
import { supabase } from '@/lib/supabase';

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  currency: string;
  goal?: number;
  is_locked: boolean;
  lock_until?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id?: string;
  card_id?: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  merchant?: string;
  category: string;
  description?: string;
  transaction_date: string;
  created_at: string;
}

export class TransactionService {
  /**
   * Fetch user's default wallet or create one if it doesn't exist
   */
  static async getUserDefaultWallet(userId: string): Promise<Wallet | null> {
    try {
      // Try to fetch the user's main wallet
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching default wallet:', error);
        return null;
      }

      if (data) {
        return data as Wallet;
      }

      // If no wallet exists, create one
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          name: 'Main Wallet',
          balance: 0,
          currency: 'RWF',
          is_locked: false,
          color: '#7C00FE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating default wallet:', createError);
        return null;
      }

      return newWallet as Wallet;
    } catch (err) {
      console.error('Error in getUserDefaultWallet:', err);
      return null;
    }
  }

  /**
   * Add money to wallet and create a transaction record
   * 
   * This function now uses the direct method instead of RPC to avoid potential duplicate updates
   */
  static async addMoneyToWallet(
    userId: string,
    amount: number,
    walletId?: string,
    transactionDetails: Partial<Transaction> = {}
  ): Promise<boolean> {
    try {
      // Get wallet or create one if it doesn't exist
      let wallet: Wallet | null;
      
      if (walletId) {
        const { data, error } = await supabase
          .from('wallets')
          .select('*')
          .eq('id', walletId)
          .eq('user_id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching specified wallet:', error);
          return false;
        }
        
        wallet = data as Wallet;
      } else {
        wallet = await this.getUserDefaultWallet(userId);
      }
      
      if (!wallet) {
        console.error('No wallet found or could not be created');
        return false;
      }
      
      // Important: Ensure amount is a valid number and properly formatted
      const validAmount = Number(amount);
      if (isNaN(validAmount) || validAmount <= 0) {
        console.error('Invalid amount:', amount);
        return false;
      }
      
      console.log('Adding amount to wallet:', validAmount, 'Current balance:', wallet.balance);
      const newBalance = wallet.balance + validAmount;
      console.log('New balance will be:', newBalance);
      
      // REPLACING RPC CALL WITH DIRECT OPERATIONS
      // First create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'income',
          amount: validAmount,
          currency: wallet.currency,
          merchant: transactionDetails.merchant || 'Deposit',
          category: transactionDetails.category || 'Deposit',
          description: transactionDetails.description || 'Money added to wallet',
          transaction_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        });
        
      if (transactionError) {
        console.error('Error creating transaction record:', transactionError);
        return false;
      }
      
      // Then update wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating wallet balance:', updateError);
        // Try to rollback the transaction since we couldn't update the balance
        await supabase
          .from('transactions')
          .delete()
          .eq('user_id', userId)
          .eq('wallet_id', wallet.id)
          .eq('amount', validAmount)
          .order('created_at', { ascending: false })
          .limit(1);
        
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in addMoneyToWallet:', err);
      return false;
    }
  }

  /**
   * Fallback method for adding money when RPC is not available
   * This method is now maintained for backwards compatibility
   */
  static async addMoneyToWalletFallback(
    userId: string,
    amount: number,
    walletId?: string,
    transactionDetails: Partial<Transaction> = {}
  ): Promise<boolean> {
    return this.addMoneyToWallet(userId, amount, walletId, transactionDetails);
  }

  /**
   * Get user's total balance across all wallets
   */
  static async getUserTotalBalance(userId: string): Promise<{ balance: number, currency: string }> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance, currency')
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error fetching wallets for balance calculation:', error);
        return { balance: 0, currency: 'RWF' };
      }
      
      if (!data || data.length === 0) {
        return { balance: 0, currency: 'RWF' };
      }
      
      // Sum all wallet balances, ensuring numbers are properly converted
      const totalBalance = data.reduce((total, wallet) => {
        const walletBalance = Number(wallet.balance) || 0;
        return total + walletBalance;
      }, 0);
      
      const currency = data[0].currency || 'RWF';
      
      return { balance: totalBalance, currency };
    } catch (err) {
      console.error('Error in getUserTotalBalance:', err);
      return { balance: 0, currency: 'RWF' };
    }
  }

  /**
   * Get recent transactions for a user
   */
  static async getRecentTransactions(userId: string, limit: number = 5): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false })
        .limit(limit);
        
      if (error) {
        console.error('Error fetching recent transactions:', error);
        return [];
      }
      
      return data as Transaction[];
    } catch (err) {
      console.error('Error in getRecentTransactions:', err);
      return [];
    }
  }

  /**
   * Format date for display in the UI
   */
  static formatTransactionDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
               `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    } catch (err) {
      return dateString;
    }
  }

  /**
   * Format amount for display in the UI
   */
  static formatAmount(amount: number, currency: string): string {
    return `${amount.toLocaleString()} ${currency}`;
  }
}