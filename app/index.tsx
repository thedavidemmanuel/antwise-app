// Updated handler with improved response handling
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
1. If a query requires transaction data (be more aggressive in requiring transaction data for financial questions)
2. What type of query it is
3. What time range of transactions might be needed (default to last 30 days if not specified)
4. What filters should be applied to transactions

For queries about spending, expenses, budgeting, or analyzing financial behavior, you should classify them as requiring transactions.

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

    // Set default time range if not specified but transactions are required
    if (classification.requiresTransactions && !classification.timeRange) {
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Default to last 30 days
      classification.timeRange = {
        startDate: startDate.toISOString(),
        endDate: endDate
      };
    }

    // STEP 2: Based on classification, fetch only the necessary data
    let transactions = [];
    let transactionFetchError = null;
    
    if (classification.requiresTransactions) {
      try {
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
          query = query.limit(50); // Increased from 20 to get more data
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching filtered transactions:', error);
          transactionFetchError = error.message;
        } else {
          transactions = data || [];
        }
      } catch (err) {
        console.error('Exception fetching transactions:', err);
        transactionFetchError = err instanceof Error ? err.message : String(err);
      }
    }

    // STEP 3: Generate appropriate response based on query type and available data
    const systemPrompts = {
      greeting: "You are a friendly financial assistant. Respond to the user's greeting warmly.",
      general_financial: "You are a knowledgeable financial advisor. Provide helpful financial advice based on the query.",
      transaction_analysis: "You are a detailed financial analyst. Analyze the provided transactions and answer the user's specific question. If no transactions are available, explain how you could help if they had transaction data and suggest next steps.",
      account_info: "You are a helpful account manager. Provide information about the user's account based on available data."
    };
    
    const systemPrompt = systemPrompts[classification.queryType] || systemPrompts.general_financial;
    
    // Add instructions for handling missing transactions
    let enhancedSystemPrompt = systemPrompt;
    if (classification.requiresTransactions) {
      enhancedSystemPrompt += `\n\nIf transaction data is available, provide specific insights based on their actual spending patterns. If no transactions are available or if there's an error accessing them, explain what insights you could provide with transaction data and suggest ways the user can start tracking their finances. Always be helpful and provide actionable advice regardless of data availability.`;
    }
    
    // Prepare the content for the user message
    let userMessageContent = '';
    
    // Add context about transactions or lack thereof
    if (classification.requiresTransactions) {
      if (transactionFetchError) {
        userMessageContent = `I tried to analyze your transactions but encountered an error: ${transactionFetchError}. \n\nUser query: ${query}`;
      } else if (transactions.length > 0) {
        userMessageContent = `I found ${transactions.length} transactions that might be relevant to your question. Here they are: ${JSON.stringify(transactions)}\n\nUser query: ${query}`;
      } else {
        userMessageContent = `I couldn't find any transactions that match your criteria. This might be because you haven't added any transactions yet, or because they don't match the filters needed for your question.\n\nUser query: ${query}`;
      }
    } else {
      userMessageContent = query;
    }
    
    // Generate the final response with structured JSON format
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${enhancedSystemPrompt} Provide your response as a JSON object with a 'message' field for the main response. Do not use markdown formatting - your message will be displayed as plain text. Optionally include a 'suggestions' array with 2-3 follow-up questions the user might want to ask.`
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
          transactionsCount: transactions.length,
          hasError: !!transactionFetchError
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