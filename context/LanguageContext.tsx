'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '@/lib/translations';

const STORAGE_KEY = 'sk_limo_lang';
const VALID_LANGUAGES: Language[] = ['en', 'ja', 'zh', 'fr', 'es'];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
});

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (let i = 0; i < cookies.length; i++) {
    const c = cookies[i].trim();
    if (c.startsWith(name + '=')) {
      return decodeURIComponent(c.substring(name.length + 1));
    }
  }
  return null;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  
  // 1. Set standard root cookie
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
  
  // 2. Set apex domain cookie for cross-subdomain sharing if on sklimo domains
  try {
    const hostname = window.location.hostname;
    if (hostname.includes('sklimo.jp')) {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax; domain=.sklimo.jp`;
    } else if (hostname.includes('sk.limo')) {
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax; domain=.sk.limo`;
    }
  } catch (e) {
    // Ignore domain errors on localhost or sandbox
  }
}

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  try {
    // 1. Check Cookie (highest priority for cross-subdomain consistency)
    const cookieVal = getCookie(STORAGE_KEY);
    if (cookieVal && VALID_LANGUAGES.includes(cookieVal as Language)) {
      // Sync localStorage if missing
      try { localStorage.setItem(STORAGE_KEY, cookieVal); } catch (e) {}
      return cookieVal as Language;
    }

    // 2. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGUAGES.includes(stored as Language)) {
      // Sync cookie if missing
      setCookie(STORAGE_KEY, stored);
      return stored as Language;
    }
    
    // 3. Fallback to browser language
    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('zh')) return 'zh';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('es')) return 'es';
  } catch (e) {
    console.error('Error reading language persistence:', e);
  }
  
  return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Synchronize on client mount
  useEffect(() => {
    const saved = getInitialLanguage();
    if (saved !== 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    setLangState(newLang);
    
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      setCookie(STORAGE_KEY, newLang);
      window.dispatchEvent(new CustomEvent('sk_limo_lang_change', { detail: newLang }));
    } catch (e) {
      console.error('Error persisting language:', e);
    }
  }, []);

  // Listen to changes across tabs or window custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && VALID_LANGUAGES.includes(e.newValue as Language)) {
        setLangState(e.newValue as Language);
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail && VALID_LANGUAGES.includes(customEvent.detail)) {
        setLangState((prev) => (prev === customEvent.detail ? prev : customEvent.detail));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sk_limo_lang_change', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sk_limo_lang_change', handleCustomChange);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return [context.lang, context.setLang] as const;
}

