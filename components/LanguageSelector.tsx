'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '@/lib/translations';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  badge: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', badge: 'EN' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', badge: 'JA' },
  { code: 'zh', label: 'Chinese', nativeLabel: '简体中文', badge: 'ZH' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', badge: 'FR' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', badge: 'ES' },
];

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export default function LanguageSelector({
  currentLang,
  onLanguageChange,
  className = '',
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === currentLang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 flex items-center gap-1.5 bg-white dark:bg-[#0E131F] hover:bg-[#F5F7FA] dark:hover:bg-slate-800 border border-[#E5E8ED] dark:border-slate-700 px-3 rounded-xl text-xs text-[#4B5563] dark:text-slate-200 transition-colors cursor-pointer"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-slate-400" />
        <span className="font-bold text-[11px] text-[#1A1A1A] dark:text-white uppercase tracking-wider">{selectedOption.badge}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#0E131F] border border-[#E5E8ED] dark:border-slate-700 rounded-xl shadow-xl z-50 py-1">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-slate-400 font-semibold border-b border-[#F0F2F5] dark:border-slate-800 mb-0.5">
            Language / 言語
          </div>
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                onLanguageChange(opt.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                currentLang === opt.code
                  ? 'bg-[#E8F1FF] text-[#0068FF] dark:bg-[#0068FF]/15 dark:text-[#3B82F6] font-semibold'
                  : 'text-[#4B5563] dark:text-slate-200 hover:bg-[#F5F7FA] dark:hover:bg-slate-800 hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F5F7FA] dark:bg-slate-800 text-[#6B7280] dark:text-slate-300 font-semibold">{opt.badge}</span>
                <span>{opt.nativeLabel}</span>
              </div>
              {currentLang === opt.code && <Check className="w-3.5 h-3.5 text-[#0068FF] dark:text-[#3B82F6]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
