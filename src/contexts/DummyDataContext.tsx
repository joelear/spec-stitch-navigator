import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface DummyDataContextType {
  isDummyDataEnabled: boolean;
  toggleDummyData: () => Promise<void>;
  loading: boolean;
}

const DummyDataContext = createContext<DummyDataContextType>({} as DummyDataContextType);

export const useDummyData = () => {
  const context = useContext(DummyDataContext);
  if (!context) {
    throw new Error('useDummyData must be used within a DummyDataProvider');
  }
  return context;
};

export function DummyDataProvider({ children }: { children: React.ReactNode }) {
  const [isDummyDataEnabled, setIsDummyDataEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('dummy_data_enabled')
        .single();
      
      if (data) {
        setIsDummyDataEnabled(data.dummy_data_enabled || false);
      }
    } catch (error) {
      // If no settings exist, create default ones
      if (user) {
        await supabase
          .from('app_settings')
          .insert({ 
            user_id: user.id,
            dummy_data_enabled: false 
          });
      }
    }
    setLoading(false);
  };

  const toggleDummyData = async () => {
    if (!user) return;
    
    const newValue = !isDummyDataEnabled;
    setIsDummyDataEnabled(newValue);

    await supabase
      .from('app_settings')
      .upsert({ 
        user_id: user.id,
        dummy_data_enabled: newValue 
      });
  };

  return (
    <DummyDataContext.Provider value={{
      isDummyDataEnabled,
      toggleDummyData,
      loading
    }}>
      {children}
    </DummyDataContext.Provider>
  );
}