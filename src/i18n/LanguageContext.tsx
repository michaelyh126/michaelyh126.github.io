import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'zh';

export const LANG_STORAGE_KEY = 'portfolio_lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  toggleLang: () => void;
  bi: (en: string, zh: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';

  // 1. Query string ?lang=en|zh (including query inside hash like #/demos/devtools?lang=zh)
  try {
    const searchParam = new URLSearchParams(window.location.search).get('lang');
    const hashQuery = window.location.hash.includes('?')
      ? new URLSearchParams(window.location.hash.split('?')[1]).get('lang')
      : null;
    const urlLang = searchParam ?? hashQuery;
    if (urlLang === 'zh' || urlLang === 'en') {
      localStorage.setItem(LANG_STORAGE_KEY, urlLang);
      return urlLang;
    }
  } catch {
    // Ignore URL/storage errors
  }

  // 2. Persisted origin-wide localStorage key
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'zh') return 'zh';
    if (stored === 'en') return 'en';
  } catch {
    // Ignore storage errors
  }

  // 3. Default English-first
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore private browsing storage errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'en' ? 'zh' : 'en';
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  // Sync <html lang="..."> and persist initial default if absent
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    try {
      if (!localStorage.getItem(LANG_STORAGE_KEY)) {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      }
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  // Cross-tab sync when language is toggled inside any /apps/* page
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'zh')) {
        setLangState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const bi = useCallback((en: string, zh: string) => (lang === 'zh' ? zh : en), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, bi }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
