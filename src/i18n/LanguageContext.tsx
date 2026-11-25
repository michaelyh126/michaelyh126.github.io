import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'zh';

export const LANG_STORAGE_KEY = 'portfolio_lang';

const DOC_TITLES: Record<Lang, string> = {
  en: 'Hao Yang — Geospatial, WebGIS & Full-Stack Systems Engineer',
  zh: '杨昊 — WebGIS、空间数据与全栈系统工程师',
};

interface LanguageContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  toggleLang: () => void;
  bi: (en: string, zh: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Strictly resolves initial language as:
 * 1) Explicit URL query ?lang=en|zh (including hash query like #/demos/devtools?lang=zh)
 * 2) Persisted localStorage.getItem('portfolio_lang')
 * 3) Strict 'en' default (NEVER reads navigator.language / Accept-Language)
 */
function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';

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

  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'zh') return 'zh';
    if (stored === 'en') return 'en';
  } catch {
    // Ignore storage errors
  }

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

  // Sync <html lang>, <title>, and ensure default 'en' is persisted on first visit
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = DOC_TITLES[lang];
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
