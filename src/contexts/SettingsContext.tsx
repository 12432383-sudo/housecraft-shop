import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Settings {
  whatsappNumber: string;
  instagramAccount: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  whatsappNumber: '71101056',
  instagramAccount: 'thecrafthouse',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch settings from Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error fetching settings:', error);
          }
          // Fall back to defaults if table doesn't exist yet
          return;
        }

        if (data) {
          setSettings({
            whatsappNumber: data.whatsapp_number,
            instagramAccount: data.instagram_account,
          });
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error fetching settings:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          whatsapp_number: newSettings.whatsappNumber,
          instagram_account: newSettings.instagramAccount,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving settings to Supabase:', error);
      }
    } catch (err) {
      console.error('Unexpected error updating settings:', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
