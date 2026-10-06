import React from 'react';
import { ShieldCheck, BrainCircuit, Languages, Share2 } from 'lucide-react';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Teachings",
      description: "Sources from Belur Math and official records."
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered",
      description: "Get story ideas, visuals, narration, subtitles and more in seconds."
    },
    {
      icon: Languages,
      title: "Multiple Languages",
      description: "Create reels in your preferred Indian language."
    },
    {
      icon: Share2,
      title: "Share & Inspire",
      description: "Spread the message in the format today's youth love."
    }
  ];

  return (
    <section className="relative z-10 border-y border-[#c8b598]/50 bg-[#e6d3ba] py-8 sm:py-10 px-6 sm:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="group flex items-start space-x-4 rounded-xl border border-[#bfa588]/40 bg-[#f4ebd9]/80 p-5 shadow-xs transition-all duration-300 hover:border-[#8b5a2b] hover:bg-[#faf4e8] hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#8b5a2b]/30 bg-[#ebdcc6] text-[#6b421d] transition-colors group-hover:bg-[#27190f] group-hover:text-[#f7eedf]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-serif-vintage text-base font-bold text-[#2b1b11] group-hover:text-[#8b5a2b] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#684c36]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
