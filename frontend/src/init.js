import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';

export default async () => {
  const defaultLang = 'ru';
  const instance = i18next.createInstance();
  await instance
    .use(initReactI18next)
    .init({
      lng: defaultLang,
      debug: false,
      resources,
    });
};
