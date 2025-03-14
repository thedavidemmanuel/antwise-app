// services/DummyDataService.ts - Enhanced version that integrates with your components
import { supabase } from '@/lib/supabase';

// Define interfaces for our data structures
interface Transaction {
  user_id: string;
  wallet_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
}

interface WalletHistoryRecord {
  user_id: string;
  wallet_id: string;
  balance: number;
  changed_amount: number;
  transaction_type: 'income' | 'expense';
  timestamp: string;
  created_at?: string; // Add optional created_at property
}

export class DummyDataService {
  /**
   * Generate dummy data for a new user, ensuring it shows up in the UI
   */
  static async generateDummyDataForUser(userId: string, insertWalletHistory: boolean = false): Promise<boolean> {
    try {
      console.log('Generating dummy data for new user:', userId);
      
      // Step 1: Create a wallet first with zero balance
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: userId,
          name: 'Main Wallet',
          balance: 0, // Starting with zero balance
          currency: 'RWF',
          is_locked: false,
          color: '#7C00FE',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (walletError) {
        console.error('Error creating wallet:', walletError);
        return false;
      }
      
      // Step 2: Generate transactions across two months
      const transactions: Transaction[] = [];
      let currentBalance = 0;
      const walletHistoryRecords: WalletHistoryRecord[] = [];
      
      // Calculate dates for the past two months
      const today = new Date();
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      
      // Names for money transfers
      const senderNames = ['Ali Mutijima', 'Tito Paris', 'Jeff Dauda'];
      
      // Supermarkets
      const supermarkets = ['Simba Supermarket', '250 Stores', 'Horebu Supermarket'];
      
      // Process for each of the last two months
      [lastMonth, currentMonth].forEach((monthStart, monthIndex) => {
        const month = monthStart.toLocaleString('default', { month: 'long' });
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        
        // 1. Add monthly salary/income at the beginning of month
        const salaryAmount = 350000 + Math.floor(Math.random() * 50000); // 350k-400k RWF
        const salaryDate = new Date(monthStart);
        salaryDate.setDate(2); // Income on 2nd day of month
        
        // Random selection of sender name
        const senderName = senderNames[Math.floor(Math.random() * senderNames.length)];
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'income',
          amount: salaryAmount,
          currency: 'RWF',
          merchant: senderName,
          category: 'Income',
          description: `Monthly salary from ${senderName}`,
          transaction_date: salaryDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance += salaryAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: salaryAmount,
          transaction_type: 'income',
          timestamp: salaryDate.toISOString(),
        });
        
        // 2. Add recurring bills
        
        // Rent (usually beginning of month)
        const rentDate = new Date(monthStart);
        rentDate.setDate(4);
        const rentAmount = 120000; // 120k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: rentAmount,
          currency: 'RWF',
          merchant: 'Monthly Rent',
          category: 'Rent',
          description: `${month} rent payment`,
          transaction_date: rentDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= rentAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -rentAmount,
          transaction_type: 'expense',
          timestamp: rentDate.toISOString(),
        });
        
        // Electricity bill (mid-month)
        const electricityDate = new Date(monthStart);
        electricityDate.setDate(15);
        const electricityAmount = 20000 + Math.floor(Math.random() * 8000); // 20k-28k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: electricityAmount,
          currency: 'RWF',
          merchant: 'REG Rwanda Energy',
          category: 'Utilities',
          description: `${month} electricity bill`,
          transaction_date: electricityDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= electricityAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -electricityAmount,
          transaction_type: 'expense',
          timestamp: electricityDate.toISOString(),
        });
        
        // Water bill (around 20th)
        const waterDate = new Date(monthStart);
        waterDate.setDate(20);
        const waterAmount = 15000 + Math.floor(Math.random() * 5000); // 15k-20k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: waterAmount,
          currency: 'RWF',
          merchant: 'WASAC Water',
          category: 'Utilities',
          description: `${month} water bill`,
          transaction_date: waterDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= waterAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -waterAmount,
          transaction_type: 'expense',
          timestamp: waterDate.toISOString(),
        });
        
        // 3. Subscriptions
        
        // Netflix subscription (beginning of month)
        const netflixDate = new Date(monthStart);
        netflixDate.setDate(3);
        const netflixAmount = 12000; // 12k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: netflixAmount,
          currency: 'RWF',
          merchant: 'Netflix',
          category: 'Subscription',
          description: `${month} Netflix subscription`,
          transaction_date: netflixDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= netflixAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -netflixAmount,
          transaction_type: 'expense',
          timestamp: netflixDate.toISOString(),
        });
        
        // Spotify subscription
        const spotifyDate = new Date(monthStart);
        spotifyDate.setDate(7);
        const spotifyAmount = 9000; // 9k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: spotifyAmount,
          currency: 'RWF',
          merchant: 'Spotify',
          category: 'Subscription',
          description: `${month} Spotify Premium`,
          transaction_date: spotifyDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= spotifyAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -spotifyAmount,
          transaction_type: 'expense',
          timestamp: spotifyDate.toISOString(),
        });
        
        // OpenAI ChatGPT
        const chatgptDate = new Date(monthStart);
        chatgptDate.setDate(10);
        const chatgptAmount = 20000; // 20k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: chatgptAmount,
          currency: 'RWF',
          merchant: 'OpenAI ChatGPT',
          category: 'Subscription',
          description: `${month} ChatGPT Plus subscription`,
          transaction_date: chatgptDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= chatgptAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -chatgptAmount,
          transaction_type: 'expense',
          timestamp: chatgptDate.toISOString(),
        });
        
        // 4. Vuba Vuba (food delivery) - twice per month
        for (let i = 0; i < 2; i++) {
          const vubaDate = new Date(monthStart);
          vubaDate.setDate(8 + (i * 12)); // Day 8 and 20
          const vubaAmount = 15000 + Math.floor(Math.random() * 10000); // 15k-25k RWF
          
          transactions.push({
            user_id: userId,
            wallet_id: wallet.id,
            type: 'expense',
            amount: vubaAmount,
            currency: 'RWF',
            merchant: 'Vuba Vuba',
            category: 'Dining',
            description: `Food delivery ${i === 0 ? 'lunch' : 'dinner'}`,
            transaction_date: vubaDate.toISOString(),
            created_at: new Date().toISOString()
          });
          
          currentBalance -= vubaAmount;
          walletHistoryRecords.push({
            user_id: userId,
            wallet_id: wallet.id,
            balance: currentBalance,
            changed_amount: -vubaAmount,
            transaction_type: 'expense',
            timestamp: vubaDate.toISOString(),
          });
        }
        
        // 5. Supermarket purchase
        const supermarket = supermarkets[Math.floor(Math.random() * supermarkets.length)];
        const supermarketDate = new Date(monthStart);
        supermarketDate.setDate(12);
        const supermarketAmount = 35000 + Math.floor(Math.random() * 15000); // 35k-50k RWF
        
        transactions.push({
          user_id: userId,
          wallet_id: wallet.id,
          type: 'expense',
          amount: supermarketAmount,
          currency: 'RWF',
          merchant: supermarket,
          category: 'Shopping',
          description: `${month} grocery shopping`,
          transaction_date: supermarketDate.toISOString(),
          created_at: new Date().toISOString()
        });
        
        currentBalance -= supermarketAmount;
        walletHistoryRecords.push({
          user_id: userId,
          wallet_id: wallet.id,
          balance: currentBalance,
          changed_amount: -supermarketAmount,
          transaction_type: 'expense',
          timestamp: supermarketDate.toISOString(),
        });
        
        // 6. Additional random transactions to reach 15 per month
        const remainingTransactionsCount = 15 - 8; // 8 transactions already added
        
        for (let i = 0; i < remainingTransactionsCount; i++) {
          // For the last transaction of the second month, ensure we zero out the balance
          const isLastTransaction = monthIndex === 1 && i === remainingTransactionsCount - 1;
          
          let type: 'income' | 'expense';
          let amount: number;
          let merchant: string;
          let category: string;
          let description: string;
          
          if (isLastTransaction) {
            // Make the final transaction balance to zero
            if (currentBalance > 0) {
              type = 'expense';
              amount = currentBalance;
              merchant = 'Bank Transfer';
              category = 'Transfer';
              description = 'Bank savings transfer';
            } else {
              // This shouldn't happen with our logic, but just in case
              type = 'income';
              amount = Math.abs(currentBalance);
              merchant = senderNames[Math.floor(Math.random() * senderNames.length)];
              category = 'Transfer';
              description = `Money received from ${merchant}`;
            }
          } else {
            // Random transaction
            const categories = ['Transfer', 'Shopping', 'Dining', 'Entertainment', 'Transportation'];
            category = categories[Math.floor(Math.random() * categories.length)];
            
            if (Math.random() > 0.7) { // 30% chance of income
              type = 'income';
              amount = 5000 + Math.floor(Math.random() * 30000); // 5k-35k RWF
              merchant = senderNames[Math.floor(Math.random() * senderNames.length)];
              description = `Money received from ${merchant}`;
            } else {
              type = 'expense';
              amount = 3000 + Math.floor(Math.random() * 20000); // 3k-23k RWF
              
              if (category === 'Shopping') {
                merchant = supermarkets[Math.floor(Math.random() * supermarkets.length)];
                description = 'Shopping';
              } else if (category === 'Dining') {
                const restaurants = ['Soko Restaurant', 'Mariott Restaurant', 'CasaKeza'];
                merchant = restaurants[Math.floor(Math.random() * restaurants.length)];
                description = 'Meal at restaurant';
              } else if (category === 'Transportation') {
                merchant = 'Yego Cab';
                description = 'Taxi ride';
              } else {
                merchant = 'Miscellaneous';
                description = `${category} expense`;
              }
            }
          }
          
          // Generate a random date within the month
          const transactionDate = new Date(monthStart);
          transactionDate.setDate(Math.floor(Math.random() * (monthEnd.getDate() - monthStart.getDate() + 1)) + monthStart.getDate());
          
          transactions.push({
            user_id: userId,
            wallet_id: wallet.id,
            type,
            amount,
            currency: 'RWF',
            merchant,
            category,
            description,
            transaction_date: transactionDate.toISOString(),
            created_at: new Date().toISOString()
          });
          
          currentBalance += (type === 'income' ? amount : -amount);
          walletHistoryRecords.push({
            user_id: userId,
            wallet_id: wallet.id,
            balance: currentBalance,
            changed_amount: type === 'income' ? amount : -amount,
            transaction_type: type,
            timestamp: transactionDate.toISOString(),
          });
        }
      });
      
      // Sort transactions by date
      transactions.sort((a: Transaction, b: Transaction) => 
        new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
      );
      
      // Insert all transactions at once
      const { error: txError } = await supabase
        .from('transactions')
        .insert(transactions);
      
      if (txError) {
        console.error('Error creating transactions:', txError);
        return false;
      }
      
      // Skip wallet history insertion by default until database issues are resolved
      let hasHistoryError = false;
      if (insertWalletHistory) {
        console.log('Attempting to insert wallet history (experimental)...');
        
        // Sort wallet history records by date
        walletHistoryRecords.sort((a: WalletHistoryRecord, b: WalletHistoryRecord) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Log wallet history record structure for debugging
        console.log(`Generated ${walletHistoryRecords.length} wallet history records`);
        if (walletHistoryRecords.length > 0) {
          console.log('First record structure:', JSON.stringify(walletHistoryRecords[0], null, 2));
        }
        
        // Try wallet history insertion
        try {
          // Instead of batching, try inserting a single simplified test record
          const testRecord = {
            user_id: userId,
            wallet_id: wallet.id,
            balance: currentBalance,
            changed_amount: 0,
            transaction_type: 'income',
            timestamp: new Date().toISOString(),
            created_at: new Date().toISOString()
          };
          
          const { error: testError } = await supabase
            .from('wallet_history')
            .insert(testRecord);
            
          if (testError) {
            console.error('Wallet history test insertion failed:', testError);
            hasHistoryError = true;
          } else {
            console.log('Test record inserted successfully, skipping remaining records');
          }
        } catch (batchingError) {
          console.error('Exception during wallet history processing:', batchingError);
          hasHistoryError = true;
        }
      } else {
        console.log('Skipping wallet history insertion (disabled by default)');
      }
      
      // Finally update the wallet balance
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ balance: currentBalance, updated_at: new Date().toISOString() })
        .eq('id', wallet.id);
      
      if (updateError) {
        console.error('Error updating wallet balance:', updateError);
        return false;
      }
      
      // Return true even if wallet history failed, as the primary transactions were inserted
      console.log('Successfully generated dummy data for user' + 
                 (hasHistoryError ? ' (with wallet history errors)' : ''));
      return true;
    } catch (err) {
      console.error('Error in generateDummyDataForUser:', err);
      return false;
    }
  }
}