import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frCommon from './locales/fr/common.json';
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

// Configuration i18n - Langue officielle: FRANÇAIS
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frCommon },
      ar: { translation: arCommon },
      en: { translation: enCommon }
    },
    lng: 'fr', // Langue par défaut: Français
    fallbackLng: 'fr', // Langue de secours: Français
    supportedLngs: ['fr', 'ar', 'en'],
    ns: 'translation',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Initialiser la langue stockée en français si pas de préférence
if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'fr');
}

export default i18n;
