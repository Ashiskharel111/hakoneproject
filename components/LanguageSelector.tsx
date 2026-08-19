'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '@/lib/translations';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeLabel: '简体中文', flag: '🇨🇳' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
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
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-[#0E131F] hover:bg-[#151d2f] border border-slate-800 hover:border-[#C5A059]/60 px-2.5 py-1.5 rounded-lg text-xs text-slate-200 transition-all cursor-pointer shadow"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
        <span className="font-bold text-[11px] tracking-wider uppercase text-white">{selectedOption.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#0E131F] border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1.5 backdrop-blur-xl animate-fade-in">
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-800/80 mb-1">
            Select Language
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
                  ? 'bg-[#C5A059]/15 text-[#E5C378] font-bold'
                  : 'text-slate-300 hover:bg-[#161f33] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{opt.flag}</span>
                <span>{opt.nativeLabel}</span>
              </div>
              {currentLang === opt.code && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
