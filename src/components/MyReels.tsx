import React from 'react';
import { GeneratedReel } from '../types';
import { Film, Play, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface MyReelsProps {
  reels: GeneratedReel[];
  onOpenReel: (reel: GeneratedReel) => void;
  onCreateNew: () => void;
}

export const MyReels: React.FC<MyReelsProps> = ({
  reels,
  onOpenReel,
  onCreateNew
}) => {
  return (
    <div className="min-h-screen bg-[#eddcc4] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#c8b598]/60 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-[#8b5a2b]" />
              <h1 className="font-serif-vintage text-3xl font-bold text-[#2b1b11]">
                My Reels
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#684c36]">
              Your library of source-grounded reels and active 24-hour Viveka challenges.
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 rounded-full bg-[#27190f] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#f7eedf] shadow-md hover:bg-[#3d2718] self-start sm:self-auto"
          >
            <span>+ Create New Reel</span>
          </button>
        </div>

        {/* Empty State */}
        {reels.length === 0 ? (
          <div className="my-16 mx-auto max-w-md rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-8 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eddcc4] text-[#8b5a2b]">
              <Film className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-serif-vintage text-xl font-bold text-[#2b1b11]">
              Your first teaching is waiting.
            </h3>
            <p className="mt-2 text-xs text-[#6e513a]">
              Start by choosing a problem you're facing today and turn timeless wisdom into a modern story with a 24-hour action.
            </p>
            <button
              onClick={onCreateNew}
              className="mt-6 rounded-full bg-[#27190f] px-6 py-3 text-xs font-bold text-[#f7eedf] hover:bg-[#3d2718]"
            >
              CREATE YOUR FIRST REEL →
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reels.map((reel) => {
              const coverScene = reel.scenes[1] || reel.scenes[0];
              const isCompleted = reel.actionChallenge.completed;
              const isAccepted = reel.actionChallenge.accepted;

              return (
                <div
                  key={reel.id}
                  onClick={() => onOpenReel(reel)}
                  className="group cursor-pointer rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-4 shadow-sm transition-all duration-300 hover:border-[#8b5a2b] hover:shadow-lg hover:translate-y-[-2px]"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[9/12] w-full overflow-hidden rounded-xl bg-[#1c140d]">
                    <img
                      src={coverScene.visualAsset.assetUrl}
                      alt={reel.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient & Meta */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-200 backdrop-blur-xs">
                        {reel.theme}
                      </span>
                      <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold text-white ${reel.sourcePassport.sourceStatus === 'Verified ✓' ? 'bg-[#27190f]' : 'bg-amber-800'}`}>
                        {reel.sourcePassport.sourceStatus === 'Verified ✓' && <ShieldCheck className="h-3 w-3 text-[#c38c3e]" />}
                        {reel.sourcePassport.sourceStatus}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-serif-vintage text-sm font-bold text-white line-clamp-2">
                        {reel.title}
                      </p>
                      <p className="text-[10px] text-amber-200 mt-0.5">
                        {reel.languageLabel} • {reel.scenes.length} Scenes • {reel.totalDurationSeconds}s
                      </p>
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 bg-black/25">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7eedf] text-[#27190f] shadow-lg">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer / Challenge Status */}
                  <div className="mt-4 space-y-2 border-t border-[#dfccaF]/70 pt-3 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#785942]">Source:</span>
                      <span className="font-semibold text-[#2b1b11] truncate max-w-[180px]">
                        {reel.sourcePassport.volume} • {reel.sourcePassport.section}
                      </span>
                    </div>

                    {/* Action Challenge Status Pill */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Challenge completed ✓</span>
                          </span>
                        ) : isAccepted ? (
                          <span className="flex items-center gap-1 font-bold text-amber-800">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Challenge in progress</span>
                          </span>
                        ) : (
                          <span className="text-[#8c6a4e]">
                            ○ Challenge pending
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-[#8b5a2b] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Open Studio <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
