import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frCommon from './locales/fr/common.json';

// Configuration i18n - FRANÇAIS UNIQUEMENT - ZERO MULTILINGUE
i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: frCommon },
  },
  lng: 'fr', // Langue EXCLUSIVE: Français
  fallbackLng: 'fr', // Langue de secours: Français
  supportedLngs: ['fr'], // FRANÇAIS SEULEMENT
  ns: 'translation',
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  detection: {
    order: [],
    caches: [],
  },
});

// Forcer la langue française
localStorage.setItem('i18nextLng', 'fr');
document.documentElement.lang = 'fr';
document.documentElement.dir = 'ltr';

export default i18n;
