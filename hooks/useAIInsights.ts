import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Authentication required');
        return;
      }
      
      // Call the Edge function using supabase.functions.invoke
      const { data, error } = await supabase.functions.invoke('analyze-transactions', {
        body: { userId: session.user.id, query },
      });
      
      if (error) {
        setError(error.message || 'Failed to get insights');
        return;
      }
      
      setInsights(data.insights);
    } catch (err: any) {
      console.error('Error fetching AI insights:', err);
      setError(err.message || 'Failed to get insights');
    } finally {
      setLoading(false);
    }
  };

  return { insights, loading, error, fetchInsights };
};