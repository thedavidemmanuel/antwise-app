import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EmbeddingService } from '@/services/EmbeddingService';

export const useAIInsights = (query?: string) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (customQuery?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required');
        return;
      }
      
      // Make sure embeddings are generated for transactions
      await EmbeddingService.generateEmbeddingsForUser(session.user.id);
      
      // Call the Edge function
      const response = await fetch(
        `${supabase.functionsUrl}/analyze-transactions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: session.user.id,
            query: customQuery || query || 'spending analysis' 
          }),
        }
      );
      
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setInsights(result.insights);
      }
    } catch (err: any) {
      console.error('Error fetching AI insights:', err);
      setError(err.message || 'Failed to get insights');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (query) {
      fetchInsights();
    }
  }, [query]);

  return { insights, loading, error, fetchInsights };
};