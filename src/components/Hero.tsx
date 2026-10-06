import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { ASSET_PATHS } from '../assets/assetPaths';

interface HeroProps {
  onCreateClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCreateClick, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#eddcc4] px-6 py-9 sm:px-12 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-12">
          
          {/* Left Column: Headings & CTA */}
          <div className="z-10 lg:col-span-7">
            {/* Eyebrow */}
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-[#8b5a2b] uppercase sm:text-sm">
              — Inspiring. Authentic. Relevant. —
            </p>

            {/* Main Heading */}
            <h1 className="font-serif-vintage text-4xl font-bold leading-[1.15] tracking-tight text-[#2b1b11] sm:text-5xl lg:text-[3.4rem]">
              Turn Timeless Teachings<br />
              Into Engaging Reels
            </h1>

            {/* Supporting Copy */}
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5e4331] sm:text-lg">
              Bring the wisdom of Swami Vivekananda to today's generation.
              Create 30–60 second reels from his teachings, life incidents and
              verified quotes — with AI assistance.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onCreateClick}
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-[#27190f] px-7 py-3 text-sm font-semibold text-[#f7eedf] shadow-lg transition-all duration-300 hover:bg-[#3d2718] hover:shadow-xl hover:translate-y-[-1px] active:translate-y-0"
              >
                <Sparkles className="h-4 w-4 text-[#c38c3e] transition-transform group-hover:rotate-12" />
                <span>Create Your Reel</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 rounded-full border border-[#8b5a2b]/35 bg-[#eddcc4]/60 px-5 py-2.5 text-sm font-medium text-[#4a3221] transition-colors hover:border-[#8b5a2b] hover:bg-[#f7eedf]/80"
              >
                <BookOpen className="h-4 w-4 text-[#8b5a2b]" />
                Explore Teachings
              </button>
            </div>

            {/* ROOT → REEL → ACT Micro-Pill */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#bfa588]/50 bg-[#f7eedf]/60 px-3.5 py-1 text-xs text-[#5e4331]">
              <span className="font-bold text-[#8b5a2b]">ROOT</span>
              <span className="text-[#a88c70]">→</span>
              <span className="font-bold text-[#2b1b11]">REEL</span>
              <span className="text-[#a88c70]">→</span>
              <span className="font-bold text-[#cf6b1c]">ACT</span>
              <span className="ml-1 text-[11px] text-[#785942]">• Verified teaching to 24-hr action</span>
            </div>
          </div>

          {/* Right Column: Historical Vivekananda Imagery & Handwritten Quote */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {/* Background Archival Temple Sketch */}
            <div className="pointer-events-none absolute -right-8 -bottom-10 h-64 w-64 opacity-25 mix-blend-multiply sm:h-80 sm:w-80">
              <img
                src={ASSET_PATHS.belurMathSketch}
                alt="Belur Math Monument Engraving"
                className="h-full w-full object-contain filter sepia"
              />
            </div>

            {/* Swami Vivekananda Cutout / Portrait */}
            <div className="relative z-10 mx-auto max-w-[340px] sm:max-w-[400px]">
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#8b5a2b]/60 bg-gradient-to-t from-[#dbc7ab] via-[#eddcc4] to-transparent p-2.5 shadow-2xl">
                <img
                  src={ASSET_PATHS.swamijiRealPhoto}
                  alt="Swami Vivekananda 1893 Archival Photograph"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ASSET_PATHS.historicalArchivalPhoto;
                  }}
                  className="h-auto w-full rounded-xl object-cover contrast-[1.05] sepia-[0.15] brightness-[0.98] filter drop-shadow-lg transition-transform duration-700 hover:scale-[1.02]"
                />
                
                {/* Subtle historical metadata tag */}
                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-[#27190f]/85 p-2 text-center backdrop-blur-xs text-[11px] text-[#f7eedf] border border-[#c38c3e]/30">
                  <span className="font-serif-vintage tracking-wide font-bold">Swami Vivekananda (Chicago, 1893)</span>
                  <div className="text-[10px] text-[#c38c3e]">Belur Math Archival Photographic Record #CW-1893</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
