import React from 'react';
import { Play, FileText, Sparkles, SlidersHorizontal, Share2 } from 'lucide-react';
import { ASSET_PATHS } from '../assets/assetPaths';

interface HowItWorksProps {
  onStartReel: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartReel }) => {
  const steps = [
    {
      num: "1",
      icon: FileText,
      title: "Choose a Teaching",
      desc: "Pick a quote, theme or incident from Swami Vivekananda's life and works."
    },
    {
      num: "2",
      icon: Sparkles,
      title: "Let AI Create",
      desc: "Get a complete reel plan — story, visuals, narration, subtitles and a takeaway."
    },
    {
      num: "3",
      icon: SlidersHorizontal,
      title: "Preview & Edit",
      desc: "Make it your own with simple customization options."
    },
    {
      num: "4",
      icon: Share2,
      title: "Download & Share",
      desc: "Save your reel and share it on your favorite platforms or use it in your projects."
    }
  ];

  return (
    <section className="relative overflow-hidden bg-[#eddcc4] px-6 pt-12 pb-6 sm:px-12 md:pt-16">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-vintage text-3xl font-bold tracking-tight text-[#2b1b11] sm:text-4xl">
              How It Works
            </h2>
            <span className="text-2xl text-[#8b5a2b] font-serif-vintage">—</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-sm font-medium text-[#684c36] sm:text-base">
              From a single teaching to a powerful 30–60 second reel — in just a few steps.
            </p>
            {/* Hand-drawn arrow indication */}
            <span className="hidden sm:inline-block font-quote text-2xl text-[#8b5a2b]">⤹</span>
          </div>
        </div>

        {/* Grid: 4 Steps + Polaroid Player */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          
          {/* Steps List */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={idx}
                    className="relative rounded-xl border border-[#bfa588]/40 bg-[#f7eedf]/80 p-5 shadow-xs transition-all hover:bg-[#fff9f0] hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#27190f] text-xs font-bold text-[#f7eedf]">
                        {step.num}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eddcc4] text-[#8b5a2b]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-serif-vintage text-base font-bold text-[#2b1b11]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#684c36]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Polaroid Video Preview Frame (matching screenshot) */}
          <div className="relative flex justify-center lg:col-span-4">
            <div 
              onClick={onStartReel}
              className="polaroid-frame group cursor-pointer max-w-[260px] rounded-lg p-3 sm:max-w-[280px]"
            >
              {/* Vertical 9:16 Video Mockup */}
              <div className="relative aspect-[9/14] w-full overflow-hidden rounded-sm bg-[#1c140d]">
                <img 
                  src={ASSET_PATHS.youthSunriseReel} 
                  alt="Student facing sunrise" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtitle preview bar */}
                <div className="absolute top-4 left-3 right-3 rounded bg-black/60 px-2 py-1 backdrop-blur-xs">
                  <p className="text-[10px] font-medium text-amber-200">
                    “Face the hardships boldly...”
                  </p>
                </div>

                {/* Video controls strip matching screenshot */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded bg-black/75 px-2.5 py-1.5 text-[10px] text-white">
                  <div className="flex items-center gap-1.5">
                    <Play className="h-3 w-3 fill-white" />
                    <span>0:00 / 0:48</span>
                  </div>
                  <div className="text-[9px] text-[#c38c3e] font-semibold">
                    9:16 HD
                  </div>
                </div>

                {/* Centered play hover effect */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eedf]/90 text-[#27190f] shadow-lg">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Handwritten note on polaroid */}
              <div className="mt-3 text-center">
                <span className="font-quote text-lg text-[#3a2517]">
                  Small reels. Big ideas.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Dark Strip matching screenshot */}
        <div className="mt-14 -mx-6 sm:-mx-12 border-t border-[#8b5a2b]/40 bg-[#1f140c] px-6 py-4 sm:px-12 text-[#f7eedf]">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-3 text-[#d6bda2]">
              <span className="text-base text-[#cf6b1c]">🌱</span>
              <span className="font-serif-vintage tracking-wider">
                Real Teachings <span className="text-[#8b5a2b] mx-2">/</span> Modern Format <span className="text-[#8b5a2b] mx-2">/</span> Greater Impact
              </span>
            </div>

            <button
              onClick={onStartReel}
              className="text-xs font-semibold text-[#c38c3e] hover:text-[#f7eedf] transition-colors underline underline-offset-4"
            >
              Create Your First Reel →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
