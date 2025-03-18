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

    // Generate embedding for the query
    const embeddingResp = await openai.embeddings.create({
      input: query || "financial analysis",
      model: 'text-embedding-3-small',
    });

    // Match transactions based on the query embedding
    const { data: transactions, error } = await supabase.rpc('match_transactions', {
      query_embedding: embeddingResp.data[0].embedding,
      match_threshold: 0.78,
      match_count: 10,
      user_id: userId,
    });

    if (error) {
      console.error('Error matching transactions:', error);
      return new Response(
        JSON.stringify({ error: 'Could not fetch relevant transactions' }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!transactions || transactions.length === 0) {
      return new Response(
        JSON.stringify({ insights: "I don't see any relevant transactions that match your query. Try adding more transactions or asking about a different topic." }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Format transactions for GPT prompt
    const transactionsFormatted = transactions.map(t => 
      `${new Date(t.transaction_date).toISOString().split('T')[0]}: ${t.category}, ${t.merchant || 'Unknown'}, ${t.amount}`
    ).join('\n');

    const prompt = `
    Based on the user's recent financial transactions regarding "${query || 'their spending'}":

    ${transactionsFormatted}

    Provide insights into their spending patterns, highlight key trends, and suggest improvements for better financial management. Be concise but informative.
    `;

    // Call GPT API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
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