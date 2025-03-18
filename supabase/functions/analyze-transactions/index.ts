// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { OpenAI } from "https://esm.sh/openai@4.20.1"

console.log("Enhanced Financial Analysis Function Initialized")

// Interface for transactions
interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  transaction_date: string;
  similarity?: number;
}

// New interface for query classification
interface QueryClassification {
  requiresTransactions: boolean;
  queryType: 'greeting' | 'general_financial' | 'transaction_analysis' | 'account_info';
  timeRange?: {
    startDate?: string;
    endDate?: string;
  };
  filters?: {
    category?: string;
    merchant?: string;
    amount?: {
      min?: number;
      max?: number;
    };
  };
}

// Interface for structured AI responses
interface AIResponse {
  message: string;  // The actual message content
  suggestions?: string[];  // Optional follow-up suggestions
}

// Edge function handler
Deno.serve(async (req) => {
  try {
    // Check URL path to handle different actions
    const url = new URL(req.url);
    
    // Handle embedding generation endpoint
    if (url.pathname.endsWith('/generate-embedding')) {
      return await handleEmbeddingGeneration(req);
    }
    
    // Original transaction analysis logic
    const { userId, query } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request' }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // STEP 1: Classify the query to determine what data we need
    const classifierResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a financial query classifier. Your job is to determine:
1. If a query requires transaction data
2. What type of query it is
3. What time range of transactions might be needed
4. What filters should be applied to transactions

Respond with a JSON object only, no other text.`
        },
        {
          role: "user",
          content: `Classify this financial assistant query: "${query}"`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });
    
    // Parse the classification
    let classification: QueryClassification;
    try {
      classification = JSON.parse(classifierResponse.choices[0].message.content) as QueryClassification;
    } catch (e) {
      console.error("Error parsing classifier response:", e);
      classification = {
        requiresTransactions: false,
        queryType: 'general_financial'
      };
    }

    // STEP 2: Based on classification, fetch only the necessary data
    let transactions = [];
    
    if (classification.requiresTransactions) {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);
      
      // Apply time range if specified
      if (classification.timeRange?.startDate) {
        query = query.gte('transaction_date', classification.timeRange.startDate);
      }
      if (classification.timeRange?.endDate) {
        query = query.lte('transaction_date', classification.timeRange.endDate);
      }
      
      // Apply filters if specified
      if (classification.filters?.category) {
        query = query.ilike('category', `%${classification.filters.category}%`);
      }
      if (classification.filters?.merchant) {
        query = query.ilike('merchant', `%${classification.filters.merchant}%`);
      }
      if (classification.filters?.amount?.min) {
        query = query.gte('amount', classification.filters.amount.min);
      }
      if (classification.filters?.amount?.max) {
        query = query.lte('amount', classification.filters.amount.max);
      }
      
      // Order by transaction date, most recent first
      query = query.order('transaction_date', { ascending: false });
      
      // Limit to a reasonable number for non-specific queries
      if (classification.queryType !== 'transaction_analysis') {
        query = query.limit(20);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching filtered transactions:', error);
        return new Response(
          JSON.stringify({ error: 'Could not fetch transaction data' }),
          { headers: { "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      transactions = data || [];
    }

    // STEP 3: Generate appropriate response based on query type and available data
    const systemPrompt = {
      greeting: "You are a friendly financial assistant. Respond to the user's greeting warmly without mentioning transactions.",
      general_financial: "You are a knowledgeable financial advisor. Provide general financial advice without discussing the user's specific transactions.",
      transaction_analysis: "You are a detailed financial analyst. Analyze the provided transactions and answer the user's specific question.",
      account_info: "You are a helpful account manager. Provide information about the user's account based on available data."
    }[classification.queryType];
    
    // Prepare the content for the user message
    let userMessageContent = query;
    if (classification.requiresTransactions && transactions.length > 0) {
      userMessageContent = `My transactions: ${JSON.stringify(transactions)}\n\nUser query: ${query}`;
    } else if (classification.requiresTransactions && transactions.length === 0) {
      userMessageContent = `I don't have any transactions that match your criteria. User query: ${query}`;
    }
    
    // Generate the final response with structured JSON format
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${systemPrompt} Provide your response as a JSON object with a 'message' field for the main response. Do not use markdown formatting - your message will be displayed as plain text. Optionally include a 'suggestions' array with 2-3 follow-up questions the user might want to ask.`
        },
        {
          role: "user",
          content: userMessageContent
        }
      ],
      response_format: { type: "json_object" },  // Force structured JSON response
      temperature: 0.7,
      max_tokens: 800
    });
    
    // Parse the JSON response with error handling
    let responseData: AIResponse;
    try {
      responseData = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      console.error("Error parsing JSON response:", e);
      responseData = { 
        message: "I'm having trouble processing your request. Could you try asking in a different way?" 
      };
    }
    
    return new Response(
      JSON.stringify({ 
        insights: responseData.message,
        suggestions: responseData.suggestions || [],  // Include follow-up suggestions
        debug: {
          classification,
          transactionsCount: transactions.length
        }
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: err instanceof Error ? err.message : String(err) }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
})

// New function to handle embedding generation
async function handleEmbeddingGeneration(req: Request) {
  try {
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Missing transactionId in request' }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });
    
    // Fetch the transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('id, amount, currency, category, merchant, type, transaction_date')
      .eq('id', transactionId)
      .single();
    
    if (error || !transaction) {
      return new Response(
        JSON.stringify({ error: 'Error fetching transaction', details: error }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
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
      return new Response(
        JSON.stringify({ error: 'Error updating transaction with embedding', details: updateError }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error('Error generating embedding:', err);
    return new Response(
      JSON.stringify({ error: 'Error generating embedding', details: err instanceof Error ? err.message : String(err) }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}