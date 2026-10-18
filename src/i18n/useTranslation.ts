import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from './index';

export const useTranslation = () => {
  const { language, setLanguage, t } = useLanguage();
  return {
    language,
    setLanguage,
    t,
    isTe: language === 'te',
    translate: (key: TranslationKey) => t[key] || String(key),
  };
};

export default useTranslation;
