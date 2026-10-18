import { enTranslations, TranslationDictionary } from './translations/en';
import { teTranslations } from './translations/te';

export type Language = 'en' | 'te';
export type TranslationKey = keyof TranslationDictionary;

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: enTranslations,
  te: teTranslations,
};

export const DEFAULT_LANGUAGE: Language = 'en';

export function getTranslation(lang: Language): TranslationDictionary;
export function getTranslation(lang: Language, key: TranslationKey): string;
export function getTranslation(lang: Language, key?: TranslationKey): string | TranslationDictionary {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (!key) {
    return dict;
  }
  return dict[key] || enTranslations[key] || String(key);
}

export { enTranslations, teTranslations };
export type { TranslationDictionary };
