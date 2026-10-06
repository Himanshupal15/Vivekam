import React from 'react';
import { ASSET_PATHS } from '../assets/assetPaths';
import { ShieldCheck, Flame, BookOpen, Layers } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#eddcc4] px-4 py-8 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5a2b]/40 bg-[#f7eedf] px-3.5 py-1 text-xs font-semibold text-[#8b5a2b]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Philosophy & Architecture</span>
          </div>

          <h1 className="mt-4 font-serif-vintage text-4xl sm:text-5xl font-bold tracking-tight text-[#2b1b11] leading-tight">
            Ancient Wisdom.<br />
            Modern Format.<br />
            Real Action.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base text-[#684c36] leading-relaxed">
            Vivekam does not replace the original teachings of Swami Vivekananda.
            It acts as a source-grounded bridge helping today's youth discover, understand, and actually live them in daily practice.
          </p>
        </div>

        {/* ROOT → REEL → ACT Triad */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          
          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ebdcc6] text-[#8b5a2b]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif-vintage text-xl font-bold text-[#2b1b11]">
              ROOT
            </h3>
            <p className="mt-2 text-xs text-[#6e513a] leading-relaxed">
              Where did this teaching come from? Anchored strictly in the Complete Works and verified Belur Math digital records. No hallucinated quotes.
            </p>
          </div>

          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#27190f] text-[#c38c3e]">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif-vintage text-xl font-bold text-[#2b1b11]">
              REEL
            </h3>
            <p className="mt-2 text-xs text-[#6e513a] leading-relaxed">
              How can today's youth understand it? Modern relatable dilemma, engaging visual storytelling, and clear ethical distillation without historical distortion.
            </p>
          </div>

          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ebdcc6] text-[#cf6b1c]">
              <Flame className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif-vintage text-xl font-bold text-[#2b1b11]">
              ACT
            </h3>
            <p className="mt-2 text-xs text-[#6e513a] leading-relaxed">
              How does the viewer practice it in real life? Every reel culminates in a personalized 24-hour Viveka Challenge to turn inspiration into character.
            </p>
          </div>

        </div>

        {/* Truth Ledger Core Commitment */}
        <div className="mt-12 rounded-2xl border-2 border-[#8b5a2b] bg-[#fbf6ed] p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#8b5a2b]" />
            <h2 className="font-serif-vintage text-xl font-bold text-[#2b1b11]">
              Our Truth Ledger Commitment
            </h2>
          </div>

          <p className="mt-3 text-sm text-[#5e4331] leading-relaxed">
            Because this is sacred cultural and historical heritage, authenticity is our non-negotiable benchmark:
          </p>

          <ul className="mt-4 space-y-2 text-xs text-[#4a3221]">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓</span>
              <span>We strictly distinguish historical source material from AI-generated interpretation, fictional modern scenarios, and creative visuals.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓</span>
              <span>We never allow AI-generated text to be attributed to Swami Vivekananda, and never clone or mimic his historical voice.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-800">✓</span>
              <span>When an unverified quote is requested, our engine refuses to hallucinate: it proudly states <strong>"SOURCE NOT FOUND"</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer section */}
        <div className="mt-8 rounded-xl border border-[#c8b598]/60 bg-[#eddcc4] p-5 text-center text-xs text-[#785942]">
          <p>
            <strong>Independence Disclaimer:</strong> Vivekam is an independent educational platform created for source-grounded learning and does not imply institutional endorsement by Ramakrishna Math, Belur Math, or Advaita Ashrama.
          </p>
        </div>

      </div>
    </div>
  );
};
