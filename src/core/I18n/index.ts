import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationFR from '../../../assets/locales/fr.json';

const resources = {
  fr: {
    translation: translationFR
  },
};

i18n
  .use(initReactI18next) 
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: "fr", 

    interpolation: {
      escapeValue: false 
    }
  });

  export default i18n;