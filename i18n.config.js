import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import cnTranslation from './src/assets/locales/cn.json';
import enTranslation from './src/assets/locales/en.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  cn: {
    translation: cnTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
