// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'es', 'hi', 'pt', 'ta', 'bn', 'fr'],
    fallbackLng: 'en',
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'localStorage', 'sessionStorage', 'navigator', 'querystring', 'subdomain'],
      caches: ['cookie']
    },
    backend: {
      loadPath: `/locales/{{lng}}/translation.json`,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
