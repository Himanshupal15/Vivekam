import React, { useState } from 'react';
import { FEELING_TILES } from '../data/teachings';
import { ArrowRight, Compass, Sparkles, Search } from 'lucide-react';

interface EmotionalEntryPointProps {
  onSelectFeeling: (feeling: string) => void;
}

export const EmotionalEntryPoint: React.FC<EmotionalEntryPointProps> = ({ onSelectFeeling }) => {
  const [customInput, setCustomInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectFeeling(customInput.trim());
    }
  };

  const samplePrompts = [
    "I failed my exam and now I feel like I'm not good enough",
    "I know the answer in class but I'm afraid to raise my hand",
    "I have 14 tabs open and can't focus on studying",
    "My job interview got rejected and I want to give up",
  ];

  return (
    <section className="relative z-10 border-b border-[#c8b598]/50 bg-[#f4ebd9] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-4xl text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5a2b]/30 bg-[#ebdcc6]/60 px-3.5 py-1 text-xs font-semibold text-[#8b5a2b]">
          <Compass className="h-3.5 w-3.5" />
          <span>Personal Entry Point • AI Intent Grounding</span>
        </div>

        {/* Heading */}
        <h2 className="mt-3 font-serif-vintage text-3xl font-bold tracking-tight text-[#2b1b11] sm:text-4xl">
          What are you facing today?
        </h2>
        <p className="mt-2 text-sm text-[#684c36] sm:text-base max-w-xl mx-auto">
          Type your real situation in plain words or choose a dilemma below. Our AI understands your intent and retrieves verified teachings with ranked matches.
        </p>

        {/* Natural Language Dilemma Input */}
        <form onSubmit={handleSubmit} className="mt-6 mx-auto max-w-2xl">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 rounded-2xl border-2 border-[#8b5a2b]/60 bg-[#fbf6ed] p-2 shadow-md focus-within:border-[#8b5a2b] focus-within:ring-2 focus-within:ring-[#8b5a2b]/20">
            <div className="flex items-center gap-2.5 w-full pl-3">
              <Sparkles className="h-5 w-5 text-[#cf6b1c] shrink-0" />
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. I failed my exam and now I feel like I'm not good enough"
                className="w-full bg-transparent py-1.5 text-xs sm:text-sm font-medium text-[#2b1b11] placeholder-[#a4866c] outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#27190f] px-5 py-2.5 text-xs font-bold text-[#f7eedf] transition-all hover:bg-[#3d2718] disabled:opacity-40"
            >
              <span>Analyze Intent →</span>
            </button>
          </div>
        </form>

        {/* Sample Prompt Chips */}
        <div className="mt-3.5 flex flex-wrap justify-center items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-[#8b5a2b]">Try this dilemma:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectFeeling(prompt)}
              className="rounded-full border border-[#bfa588]/60 bg-[#eddcc4]/70 px-3 py-1 text-[11px] font-medium text-[#4a3221] transition-colors hover:border-[#8b5a2b] hover:bg-[#faf3e6]"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Quick Pill Categories */}
        <div className="mt-8 pt-6 border-t border-[#dfccaF]/80">
          <p className="text-[11px] font-bold text-[#8b5a2b] uppercase tracking-wider mb-3">
            Or select by core state:
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {FEELING_TILES.map((tile) => (
              <button
                key={tile.id}
                onClick={() => onSelectFeeling(tile.query)}
                className="group relative flex items-center gap-1.5 rounded-full border border-[#8b5a2b]/35 bg-[#fbf6ed] px-4 py-2 text-xs font-semibold text-[#3b2718] shadow-2xs transition-all duration-200 hover:scale-105 hover:border-[#8b5a2b] hover:bg-[#27190f] hover:text-[#f7eedf] active:scale-95"
              >
                <span>{tile.label}</span>
                <ArrowRight className="h-3 w-3 text-[#8b5a2b] transition-transform group-hover:translate-x-0.5 group-hover:text-[#c38c3e]" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8c6a4e]">
          Every query triggers: <strong className="text-[#2b1b11]">USER INPUT → AI UNDERSTANDS → SEARCH TRUSTED LIBRARY → TOP VERIFIED MATCHES</strong>
        </p>
      </div>
    </section>
  );
};
