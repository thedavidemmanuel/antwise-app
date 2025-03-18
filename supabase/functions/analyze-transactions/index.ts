// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { OpenAI } from "https://esm.sh/openai@4.20.1"

console.log("Financial Analysis Function Initialized")

// Interface for transactions
interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  transaction_date: string;
  similarity?: number;
}

// Edge function handler
Deno.serve(async (req) => {
  try {
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

    // Get all transactions for the user instead of matching via embedding
    const { data: transactions, error } = await supabase.rpc(
      'get_all_user_transactions',
      { user_id: userId }
    );

    if (error) {
      console.error('Error getting user transactions:', error);
      return new Response(
        JSON.stringify({ error: 'Could not fetch user transactions' }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!transactions || transactions.length === 0) {
      return new Response(
        JSON.stringify({ insights: "I don't see any transactions in your account yet. Try adding some transactions first." }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Call GPT API with a system message and user message containing transactions and the query
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial assistant. Analyze the user's transactions and provide insights."
        },
        {
          role: "user",
          content: `My transactions: ${JSON.stringify(transactions)}\n\nUser query: ${query || "Analyze my spending"}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const insights = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ insights }),
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