import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureStrip } from './components/FeatureStrip';
import { EmotionalEntryPoint } from './components/EmotionalEntryPoint';
import { HowItWorks } from './components/HowItWorks';
import { CreateReelFlow } from './components/CreateReelFlow';
import { ReelStudio } from './components/ReelStudio';
import { MyReels } from './components/MyReels';
import { TeachingLibrary } from './components/TeachingLibrary';
import { AboutView } from './components/AboutView';
import { TEACHING_ID_ALIASES, VERIFIED_TEACHINGS, TeachingRecord } from './data/teachings';
import { GeneratedReel } from './types';
import { buildDeterministicReel } from './utils/reelGenerator';

function refreshSavedReel(reel: GeneratedReel, records: TeachingRecord[]): GeneratedReel {
  const teachingId = TEACHING_ID_ALIASES[reel.teachingId] || reel.teachingId;
  const teaching = records.find((record) => record.id === teachingId);
  if (!teaching) return reel;
  if (
    reel.teachingId === teaching.id &&
    reel.sourcePassport?.sourceQuote === teaching.teaching &&
    reel.sourcePassport?.sourceUrl === teaching.sourceUrl
  ) {
    return reel;
  }

  const refreshed = buildDeterministicReel(
    teaching,
    reel.storyContext,
    reel.language,
    reel.userProblem,
    reel.totalDurationSeconds
  );

  return {
    ...refreshed,
    id: reel.id,
    createdAt: reel.createdAt,
    actionChallenge: {
      ...refreshed.actionChallenge,
      id: reel.actionChallenge?.id || refreshed.actionChallenge.id,
      accepted: reel.actionChallenge?.accepted ?? false,
      completed: reel.actionChallenge?.completed ?? false,
      reflection: reel.actionChallenge?.reflection,
    },
  };
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'create' | 'studio' | 'reels' | 'library' | 'about'>('home');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [initialFeeling, setInitialFeeling] = useState<string>('I NEED COURAGE');

  // Teachings state (seeded with verified source-linked records, extensible by admin)
  const [teachings, setTeachings] = useState<TeachingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vivekreel_custom_teachings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...VERIFIED_TEACHINGS, ...parsed];
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return VERIFIED_TEACHINGS;
  });

  // User's reels state
  const [reels, setReels] = useState<GeneratedReel[]>(() => {
    try {
      const saved = localStorage.getItem('vivekreel_saved_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        const custom = JSON.parse(localStorage.getItem('vivekreel_custom_teachings') || '[]');
        const records = [...VERIFIED_TEACHINGS, ...(Array.isArray(custom) ? custom : [])];
        return Array.isArray(parsed) ? parsed.map((reel) => refreshSavedReel(reel, records)) : [];
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    // Seed with one initial demo reel so My Reels is never an empty desert on first launch!
    const initialDemoReel = buildDeterministicReel(
      VERIFIED_TEACHINGS.find((teaching) => teaching.id === 'q04') || VERIFIED_TEACHINGS[0],
      'campus',
      'en',
      'I NEED COURAGE'
    );
    return [initialDemoReel];
  });

  // Current active reel in studio
  const [currentReel, setCurrentReel] = useState<GeneratedReel>(() => {
    return reels[0] || buildDeterministicReel(VERIFIED_TEACHINGS[0], 'campus', 'en', 'I NEED COURAGE');
  });

  // Viveka challenge streak
  const [vivekaStreak, setVivekaStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vivekreel_streak');
      if (saved) return parseInt(saved, 10);
    } catch (e) {
      console.warn("Storage read error:", e);
    }
    return 1;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vivekreel_saved_reels', JSON.stringify(reels));
    } catch (e) {}
  }, [reels]);

  useEffect(() => {
    try {
      localStorage.setItem('vivekreel_streak', vivekaStreak.toString());
    } catch (e) {}
  }, [vivekaStreak]);

  // Handle adding new custom teaching
  const handleAddTeaching = (newTeaching: TeachingRecord) => {
    setTeachings(prev => [newTeaching, ...prev]);
    try {
      const customSaved = localStorage.getItem('vivekreel_custom_teachings');
      const list = customSaved ? JSON.parse(customSaved) : [];
      list.unshift(newTeaching);
      localStorage.setItem('vivekreel_custom_teachings', JSON.stringify(list));
    } catch (e) {}
  };

  // Handle completed reel creation
  const handleReelGenerated = (newReel: GeneratedReel) => {
    setReels(prev => [newReel, ...prev]);
    setCurrentReel(newReel);
    setCurrentTab('studio');
  };

  // Handle updating reel (e.g. accepting challenge or marking complete)
  const handleUpdateReel = (updated: GeneratedReel) => {
    setCurrentReel(updated);
    setReels(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleChallengeCompleted = () => {
    setVivekaStreak(prev => prev + 1);
  };

  // Switch language inside studio
  const handleSwitchLanguageInStudio = (newLang: 'en' | 'hi') => {
    const teachingId = TEACHING_ID_ALIASES[currentReel.teachingId] || currentReel.teachingId;
    const teaching = teachings.find(t => t.id === teachingId) || VERIFIED_TEACHINGS[0];
    const adapted = buildDeterministicReel(
      teaching,
      currentReel.storyContext,
      newLang,
      currentReel.userProblem
    );
    // keep challenge status
    adapted.actionChallenge.accepted = currentReel.actionChallenge.accepted;
    adapted.actionChallenge.completed = currentReel.actionChallenge.completed;
    adapted.actionChallenge.reflection = currentReel.actionChallenge.reflection;
    
    handleUpdateReel(adapted);
    setLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-[#1c140d] text-[#2c1d11] font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={(l) => {
          setLanguage(l);
          if (currentTab === 'studio') {
            handleSwitchLanguageInStudio(l);
          }
        }}
        vivekaStreak={vivekaStreak}
      />

      {/* Main Content Areas */}
      <main className="relative">
        {currentTab === 'home' && (
          <div className="parchment-banner">
            {/* Hero Section matching screenshot */}
            <Hero
              onCreateClick={() => {
                setInitialFeeling("I NEED COURAGE");
                setCurrentTab('create');
              }}
              onExploreClick={() => setCurrentTab('library')}
            />

            {/* Feature Strip matching screenshot */}
            <FeatureStrip />

            {/* Personal Entry Point: "What are you facing today?" */}
            <EmotionalEntryPoint
              onSelectFeeling={(feeling) => {
                setInitialFeeling(feeling);
                setCurrentTab('create');
              }}
            />

            {/* How It Works Section with Polaroid Player matching screenshot */}
            <HowItWorks
              onStartReel={() => {
                setInitialFeeling("I NEED COURAGE");
                setCurrentTab('create');
              }}
            />
          </div>
        )}

        {currentTab === 'create' && (
          <CreateReelFlow
            initialFeeling={initialFeeling}
            onReelGenerated={handleReelGenerated}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'studio' && (
          <ReelStudio
            reel={currentReel}
            teachings={teachings}
            onUpdateReel={handleUpdateReel}
            onChallengeCompleted={handleChallengeCompleted}
            onSwitchLanguage={handleSwitchLanguageInStudio}
          />
        )}

        {currentTab === 'reels' && (
          <MyReels
            reels={reels}
            onOpenReel={(reel) => {
              setCurrentReel(reel);
              setCurrentTab('studio');
            }}
            onCreateNew={() => setCurrentTab('create')}
          />
        )}

        {currentTab === 'library' && (
          <TeachingLibrary
            teachings={teachings}
            onAddTeaching={handleAddTeaching}
            onSelectTeachingForReel={(t) => {
              setInitialFeeling(t.matchedFeelings[0] || "I NEED COURAGE");
              const reel = buildDeterministicReel(t, 'campus', language, t.matchedFeelings[0]);
              handleReelGenerated(reel);
            }}
          />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Vintage Footer */}
      <footer className="border-t border-[#8b5a2b]/30 bg-[#170e08] px-6 py-8 text-center text-xs text-[#a88c70]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-vintage text-base font-bold text-[#f7eedf]">Vivekam</span>
            <span>—</span>
            <span className="text-[11px] text-[#c38c3e]">ROOT → REEL → ACT</span>
          </div>

          <p className="text-[11px]">
            Strict Source Provenance • Complete Works of Swami Vivekananda • Truth Ledger Verified
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setCurrentTab('library')} className="hover:text-white transition-colors">
              Canon
            </button>
            <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors">
              Philosophy
            </button>
            <button onClick={() => setCurrentTab('create')} className="hover:text-white transition-colors">
              Studio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
