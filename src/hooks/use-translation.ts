import { useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { StorageKey } from '@src/libs/constants/storage';
import { getStorageData, setStorageData } from '@src/libs/helpers/storage';
import { useLanguageStore } from '@src/stores/languague';
// Supported languages
export type SupportedLanguages = 'en' | 'cn';

export const useTranslation = () => {
  const { t, i18n } = useI18nextTranslation(); // Use react-i18next's hook
  const { language, setLanguage: setLanguageState } = useLanguageStore();

  useEffect(() => {
    // Load the stored language on initialization
    const storedLanguage = getStorageData<string>(StorageKey.LANGUAGE) as SupportedLanguages;
    const initialLanguage = storedLanguage && i18n.options.resources?.[storedLanguage] ? storedLanguage : 'en';
    setLanguageState(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const setLanguage = (newLanguage: SupportedLanguages): void => {
    if (i18n.options.resources && newLanguage in i18n.options.resources) {
      setLanguageState(newLanguage);
      setStorageData(StorageKey.LANGUAGE, newLanguage);
      i18n.changeLanguage(newLanguage);
    } else {
      console.warn(`Language "${newLanguage}" is not supported.`);
    }
  };

  return {
    translate: t, // Use i18next's `t` function directly
    language,
    setLanguage,
  };
};
