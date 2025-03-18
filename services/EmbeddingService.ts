import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

// Conditionally create OpenAI client only when API key is available
let openai: OpenAI | null = null;
try {
  // Only initialize if we have an API key
  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
} catch (err) {
  console.log('OpenAI client initialization skipped (client environment)');
}

export class EmbeddingService {
  /**
   * Generate embeddings for a transaction and update the database
   */
  static async generateEmbeddingForTransaction(transactionId: string): Promise<boolean> {
    // Skip if OpenAI client isn't available (client-side environment)
    if (!openai) {
      console.log('Embedding generation skipped - OpenAI client not available');
      return false;
    }
    
    try {
      // Fetch the transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select('id, amount, currency, category, merchant, type, transaction_date')
        .eq('id', transactionId)
        .single();
      
      if (error || !transaction) {
        console.error('Error fetching transaction:', error);
        return false;
      }
      
      // Create text representation for embedding
      const text = `${transaction.type} ${transaction.category} ${transaction.merchant || ''} ${transaction.amount} ${transaction.currency}`;
      
      // Generate embedding
      const embeddingResp = await openai.embeddings.create({
        input: text,
        model: 'text-embedding-3-small',
      });
      
      // Update the transaction with the embedding
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ embedding: embeddingResp.data[0].embedding })
        .eq('id', transaction.id);
      
      if (updateError) {
        console.error('Error updating transaction with embedding:', updateError);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error generating embedding:', err);
      return false;
    }
  }

  /**
   * Generate embeddings for all transactions of a user
   */
  static async generateEmbeddingsForUser(userId: string): Promise<boolean> {
    // Skip if OpenAI client isn't available (client-side environment)
    if (!openai) {
      console.log('Bulk embedding generation skipped - OpenAI client not available');
      return false;
    }
    
    try {
      // Fetch transactions without embeddings
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id')
        .eq('user_id', userId)
        .is('embedding', null);
      
      if (error) {
        console.error('Error fetching transactions without embeddings:', error);
        return false;
      }
      
      // Process in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);
        await Promise.all(
          batch.map(t => this.generateEmbeddingForTransaction(t.id))
        );
        console.log(`Processed batch ${i/batchSize + 1} of ${Math.ceil(transactions.length/batchSize)}`);
      }
      
      return true;
    } catch (err) {
      console.error('Error generating embeddings for user:', err);
      return false;
    }
  }
}