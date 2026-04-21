import { createContext, useContext, useState, useCallback, createElement } from 'react';
import en from './en';
import vi from './vi';
import ja from './ja';

const translations = { en, vi, ja };

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

// Detect initial language from localStorage or browser
function getInitialLang() {
  try {
    const saved = localStorage.getItem('marketpulse-lang');
    if (saved && translations[saved]) return saved;
  } catch { /* ignore */ }

  const browserLang = navigator.language?.split('-')[0];
  if (translations[browserLang]) return browserLang;

  return 'en';
}

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((code) => {
    if (translations[code]) {
      setLangState(code);
      try {
        localStorage.setItem('marketpulse-lang', code);
      } catch { /* ignore */ }
      document.documentElement.lang = code;
    }
  }, []);

  const t = useCallback(
    (key) => {
      const val = translations[lang]?.[key];
      if (val !== undefined) return val;
      return translations.en?.[key] ?? key;
    },
    [lang]
  );

  return createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t, LANGUAGES } },
    children
  );
}

/**
 * Hook to use translations in any component.
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
