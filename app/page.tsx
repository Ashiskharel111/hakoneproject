'use client';

import React, { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import YahooJapanHomeView from '@/components/YahooJapanHomeView';
import ExplorePage from '@/app/explore/page';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const [lang, setLang] = useLanguage();
  const [isModernView, setIsModernView] = useState(false);

  if (isModernView) {
    return <ExplorePage />;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <SiteHeader
        activePage="home"
        currentLang={lang}
        onLanguageChange={(newLang) => {
          setLang(newLang);
        }}
      />
      <div className="pt-16">
        <YahooJapanHomeView onSwitchToModernView={() => setIsModernView(true)} />
      </div>
    </div>
  );
}
