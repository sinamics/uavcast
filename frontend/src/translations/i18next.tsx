import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_translation from './locales/en.json';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: en_translation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
