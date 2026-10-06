import React from 'react';
import { Globe, User, BookOpen, Film, PlusCircle, Sparkles } from 'lucide-react';
import { ASSET_PATHS } from '../assets/assetPaths';

interface NavbarProps {
  currentTab: 'home' | 'create' | 'studio' | 'reels' | 'library' | 'about';
  setCurrentTab: (tab: 'home' | 'create' | 'studio' | 'reels' | 'library' | 'about') => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  vivekaStreak: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  vivekaStreak,
}) => {
  return (
    <header className="relative z-30 w-full border-b border-[#c8b598]/40 bg-[#eddcc4] px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="group flex cursor-pointer items-center space-x-3.5 select-none"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#8b5a2b] bg-[#dfccaF] shadow-inner">
            <img 
              src={ASSET_PATHS.vivekanandaPortrait} 
              alt="Vivekananda Emblem" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSET_PATHS.historicalArchivalPhoto;
              }}
              className="h-full w-full object-cover sepia-[0.25] contrast-125"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-vintage text-2xl font-bold tracking-tight text-[#2b1b11]">
                Vivekam
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-[#705038]">
              Timeless Teachings. Modern Reels.
            </p>
          </div>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-1.5 text-sm font-medium transition-all ${
              currentTab === 'home'
                ? 'border-b-2 border-[#2b1b11] font-semibold text-[#2b1b11]'
                : 'text-[#6e513a] hover:text-[#2b1b11]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('create')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium transition-all ${
              currentTab === 'create'
                ? 'border-b-2 border-[#2b1b11] font-semibold text-[#2b1b11]'
                : 'text-[#6e513a] hover:text-[#2b1b11]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#cf6b1c]" />
            Create Reel
          </button>
          <button
            onClick={() => setCurrentTab('reels')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium transition-all ${
              currentTab === 'reels'
                ? 'border-b-2 border-[#2b1b11] font-semibold text-[#2b1b11]'
                : 'text-[#6e513a] hover:text-[#2b1b11]'
            }`}
          >
            <Film className="h-3.5 w-3.5 text-[#8b5a2b]" />
            My Reels
          </button>
          <button
            onClick={() => setCurrentTab('library')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium transition-all ${
              currentTab === 'library'
                ? 'border-b-2 border-[#2b1b11] font-semibold text-[#2b1b11]'
                : 'text-[#6e513a] hover:text-[#2b1b11]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#8b5a2b]" />
            Teachings
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`px-3.5 py-1.5 text-sm font-medium transition-all ${
              currentTab === 'about'
                ? 'border-b-2 border-[#2b1b11] font-semibold text-[#2b1b11]'
                : 'text-[#6e513a] hover:text-[#2b1b11]'
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Section: Streak, Language & Profile */}
        <div className="flex items-center space-x-3">
          {/* Viveka Streak Badge */}
          {vivekaStreak > 0 && (
            <div 
              title={`${vivekaStreak} Viveka challenges practiced`}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#cf6b1c]/40 bg-[#fceddf] px-3 py-1 text-xs font-semibold text-[#cf6b1c] shadow-xs"
            >
              <span>🔥</span>
              <span>{vivekaStreak} Practiced</span>
            </div>
          )}

          {/* Language selector matching screenshot */}
          <div className="relative inline-flex items-center rounded-full border border-[#b89f81] bg-[#f5ecdc]/80 px-3 py-1 text-xs font-medium text-[#2c1d11] shadow-xs">
            <Globe className="mr-1.5 h-3.5 w-3.5 text-[#8b5a2b]" />
            <select
              value={language}
              aria-label="Select Language"
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
              className="cursor-pointer appearance-none bg-transparent pr-4 font-medium outline-hidden focus:ring-0"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
            <span className="pointer-events-none absolute right-2 text-[10px] text-[#705038]">▼</span>
          </div>

          {/* User profile icon matching screenshot */}
          <button
            onClick={() => setCurrentTab('reels')}
            title="My Account & Challenges"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8b5a2b] bg-[#2c1d11] text-[#f7eedf] transition-transform hover:scale-105"
          >
            <User className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
