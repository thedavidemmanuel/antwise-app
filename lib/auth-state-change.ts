import { supabase } from '@/lib/supabase';
import { DummyDataService } from '@/services/DummyDataService';

export function setupAuthStateChangeListener() {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // Check if user already has wallet data
      const { count, error: countError } = await supabase
        .from('wallets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      
      // If no wallet exists, generate dummy data
      if (!countError && count === 0) {
        await DummyDataService.generateDummyDataForUser(session.user.id);
      }
    }
  });
}