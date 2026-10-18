import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, Language, TranslationKey, TranslationDictionary } from '../i18n';
import { getDB } from '../core/storage/db';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  translate: (key: TranslationKey) => string;
  isTe: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sahaaya_lang');
      if (saved === 'te' || saved === 'en') {
        if (typeof document !== 'undefined') {
          document.documentElement.lang = saved;
        }
        return saved;
      }
    } catch (e) {
      // In case localStorage is restricted
    }
    return 'en';
  });

  // Restore language from IndexedDB if not found in localStorage (for offline PWA restarts)
  useEffect(() => {
    const restoreFromDB = async () => {
      try {
        const db = await getDB();
        const setting = await db.get('settings', 'language');
        if (setting && (setting.value === 'te' || setting.value === 'en')) {
          if (setting.value !== language) {
            setLanguageState(setting.value as Language);
            localStorage.setItem('sahaaya_lang', setting.value);
            document.documentElement.lang = setting.value;
          }
        }
      } catch (e) {
        // Fallback gracefully
      }
    };
    restoreFromDB();
  }, []);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'sahaaya_lang' && (event.newValue === 'te' || event.newValue === 'en')) {
        setLanguageState(event.newValue as Language);
        document.documentElement.lang = event.newValue;
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sahaaya_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }

    // Persist to IndexedDB
    getDB().then((db) => {
      db.put('settings', { key: 'language', value: lang }).catch(() => {});
    }).catch(() => {});
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const translate = (key: TranslationKey): string => {
    return t[key] || TRANSLATIONS.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translate, isTe: language === 'te' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
