import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);
  
  const fetchInsights = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuggestions([]);
      setDebug(null);
      
      // Quick check for likely transaction queries to set UI state
      const likelyNeedsTransactions = /spend|transaction|money|budget|cost|expense|income|payment|transfer|balance/i.test(query);
      setAnalyzing(likelyNeedsTransactions);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('Authentication required: No active session');
        setError('Authentication required');
        return;
      }
      
      console.log(`Calling analyze-transactions with user ID: ${session.user.id} and query: "${query}"`);
      
      // Call the Edge function using supabase.functions.invoke
      const { data, error } = await supabase.functions.invoke('analyze-transactions', {
        body: { userId: session.user.id, query },
      });
      
      if (error) {
        console.error("Edge function error:", error);
        setError(error.message || 'Failed to get insights');
        return;
      }
      
      console.log("Edge function response:", data);
      
      // Extract all possible data from response
      if (data.insights) {
        setInsights(data.insights);
      }
      
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
      }
      
      if (data.debug) {
        setDebug(data.debug);
        console.log(`Query type: ${data.debug.classification?.queryType}, Transactions fetched: ${data.debug.transactionsCount || 0}`);
        
        if (data.debug.transactionsCount === 0 && likelyNeedsTransactions) {
          console.warn('No transactions found for analysis');
        }
      }
      
    } catch (err: any) {
      console.error('Error fetching AI insights:', err);
      setError(err.message || 'Failed to get insights');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return { insights, suggestions, loading, analyzing, error, debug, fetchInsights };
};