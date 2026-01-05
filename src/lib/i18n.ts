import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      hero: {
        title: "Master Your Flow State With Smart Scheduling",
        subtitle: "FlowSync bridges the gap between your calendar and deep concentration.",
        cta: "Launch Dashboard",
        demo: "View Demo"
      },
      features: {
        calendar: "Calendar Sync",
        ai: "AI Recommendations",
        rescheduling: "Smart Rescheduling"
      }
    }
  },
  tr: {
    translation: {
      hero: {
        title: "Akıllı Planlama ile Akış Halinde Kalın",
        subtitle: "FlowSync, takviminiz ile derin odaklanma arasındaki boşluğu doldurur.",
        cta: "Paneli Başlat",
        demo: "Demoyu İzle"
      },
      features: {
        calendar: "Takvim Senkronizasyonu",
        ai: "Yapay Zeka Önerileri",
        rescheduling: "Akıllı Yeniden Planlama"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
