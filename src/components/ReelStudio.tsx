import React, { useState, useEffect, useRef } from 'react';
import { GeneratedReel, ReelScene } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Info,
  Clock,
  Layers,
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';
import { TeachingRecord, VERIFIED_TEACHINGS } from '../data/teachings';

interface ReelStudioProps {
  reel: GeneratedReel;
  teachings: TeachingRecord[];
  onUpdateReel: (updated: GeneratedReel) => void;
  onChallengeCompleted: () => void;
  onSwitchLanguage: (lang: 'en' | 'hi') => void;
}

export const ReelStudio: React.FC<ReelStudioProps> = ({
  reel,
  teachings,
  onUpdateReel,
  onChallengeCompleted,
  onSwitchLanguage
}) => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [selectedSceneForInspection, setSelectedSceneForInspection] = useState<ReelScene>(reel.scenes[0]);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [voicePitch, setVoicePitch] = useState<number>(1.0); // Exact normal pitch
  const [voiceRate, setVoiceRate] = useState<number>(1.02); // Natural cadence
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(false);
  const [detectedVoiceName, setDetectedVoiceName] = useState<string>('Natural Voice');
  const [narrationDisclaimerDismissed, setNarrationDisclaimerDismissed] = useState<boolean>(false);

  // Reflection feedback state
  const [showReflectionModal, setShowReflectionModal] = useState<boolean>(false);
  const [selectedFeelingMood, setSelectedFeelingMood] = useState<'Empowered' | 'Good' | 'Neutral' | 'Difficult'>('Empowered');
  const [reflectionText, setReflectionText] = useState<string>('');

  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop all active timers and speech
  const stopPlayback = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Play a scene completely, guaranteeing narration completes before moving to next slide
  const playSceneCompletely = (sceneIdx: number) => {
    if (sceneIdx < 0 || sceneIdx >= reel.scenes.length) {
      setIsPlaying(false);
      return;
    }

    const scene = reel.scenes[sceneIdx];
    setActiveSceneIndex(sceneIdx);
    setSelectedSceneForInspection(scene);
    setSceneProgress(0);

    stopPlayback();

    // Estimate scene reading duration for progress bar
    const wordCount = scene.narration.split(/\s+/).filter(Boolean).length;
    const estDurationMs = Math.max(5000, Math.round((wordCount / 2.3) * 1000));
    const startTime = Date.now();

    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(96, Math.round((elapsed / estDurationMs) * 100));
      setSceneProgress(pct);
    }, 100);

    // Callback when slide narration is 100% finished
    const onSceneFinished = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSceneProgress(100);

      // Brief comfortable pause (450ms) so viewer can take in the slide before moving to next
      advanceTimeoutRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;
        if (sceneIdx < reel.scenes.length - 1) {
          playSceneCompletely(sceneIdx + 1);
        } else {
          // Completed all 7 slides!
          setIsPlaying(false);
        }
      }, 450);
    };

    if (isAudioMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      advanceTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          onSceneFinished();
        }
      }, estDurationMs);
      return;
    }

    try {
      const cleanNarration = scene.narration
        .replace(/["“”«»]/g, '')
        .replace(/—/g, ' ')
        .replace(/;/g, ' ')
        .replace(/:/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanNarration);
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const targetLang = reel.language === 'hi' ? 'hi' : 'en';
        const naturalVoice = voices.find(v => 
          v.lang.toLowerCase().startsWith(targetLang) && 
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('Ava'))
        ) || voices.find(v => v.lang.toLowerCase().startsWith(targetLang));
        if (naturalVoice) {
          utterance.voice = naturalVoice;
          setDetectedVoiceName(naturalVoice.name);
        }
      }

      utterance.lang = reel.language === 'hi' ? 'hi-IN' : 'en-US';

      // CRITICAL: onend fires only when the voice has completely finished reading every single word of this slide!
      utterance.onend = () => {
        if (isPlayingRef.current) {
          onSceneFinished();
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled' && isPlayingRef.current) {
          onSceneFinished();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable, falling back to timer:", e);
      advanceTimeoutRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          onSceneFinished();
        }
      }, estDurationMs);
    }
  };

  // Find teaching record for direct external links
  const teachingRecord = teachings.find(t => t.id === reel.teachingId) || VERIFIED_TEACHINGS[0];
  const sourceQuote = reel.sourcePassport.sourceQuote || teachingRecord.teaching;
  const sourceUrl = reel.sourcePassport.sourceUrl || teachingRecord.sourceUrl;
  const sourceStatus = reel.sourcePassport.sourceStatus || (teachingRecord.sourceStatus === 'verified' ? 'Verified ✓' : 'Unverified');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const activeScene = reel.scenes[activeSceneIndex] || reel.scenes[0];

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopPlayback();
    } else {
      setIsPlaying(true);
      // If currently on last scene and done, restart from scene 0
      const startIdx = activeSceneIndex >= reel.scenes.length - 1 && sceneProgress >= 100 ? 0 : activeSceneIndex;
      playSceneCompletely(startIdx);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    stopPlayback();
    setActiveSceneIndex(0);
    setSelectedSceneForInspection(reel.scenes[0]);
    setSceneProgress(0);
  };

  const handleSelectSceneManual = (scene: ReelScene, index: number) => {
    setActiveSceneIndex(index);
    setSelectedSceneForInspection(scene);
    setSceneProgress(0);
    if (isPlaying) {
      playSceneCompletely(index);
    } else {
      stopPlayback();
      // Speak preview if unmuted
      if (!isAudioMuted && typeof window !== 'undefined' && window.speechSynthesis) {
        const cleanNarration = scene.narration.replace(/["“”«»]/g, '').replace(/—/g, ' ').replace(/\s+/g, ' ').trim();
        const utterance = new SpeechSynthesisUtterance(cleanNarration);
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.lang = reel.language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleAcceptChallenge = () => {
    const updated = {
      ...reel,
      actionChallenge: {
        ...reel.actionChallenge,
        accepted: true
      }
    };
    onUpdateReel(updated);
  };

  const handleCompleteChallengeSubmit = () => {
    const updated = {
      ...reel,
      actionChallenge: {
        ...reel.actionChallenge,
        completed: true,
        reflection: {
          feeling: selectedFeelingMood,
          notes: reflectionText || "Practiced with conscious awareness.",
          completedAt: new Date().toISOString()
        }
      }
    };
    onUpdateReel(updated);
    setShowReflectionModal(false);
    onChallengeCompleted();
  };

  // Export functions (fully working downloads)
  const handleExportScript = () => {
    const translationNote = reel.language === 'hi'
      ? 'Narrated quotation is a Hindi translation; the linked page contains the original source wording.'
      : 'Narrated quotation uses the English source wording.';
    const scriptText = `VIVEKAM SCRIPT EXPORT\nTopic: ${reel.theme} — ${reel.title}\nSource: Swami Vivekananda, "${sourceQuote}" ${reel.sourcePassport.sourceName}, ${reel.sourcePassport.volume}, ${reel.sourcePassport.section}.\nOriginal source: ${sourceUrl}\n${translationNote}\n\n` +
      reel.scenes.map(s => `[${s.startSecond}s - ${s.endSecond}s] ${s.sceneType} (${s.contentCategory})\nVisual: ${s.visualAsset.caption}\nNarration: "${s.narration}"\nSubtitle: "${s.subtitle}"\n`).join('\n') +
      `\n24-HOUR ACTION CHALLENGE:\n${reel.actionChallenge.title}\n${reel.actionChallenge.instruction}\n`;
    
    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vivekam-${reel.theme}-Script.txt`;
    a.click();
  };

  const handleExportCaptions = () => {
    const srtContent = reel.scenes.map((s, idx) => {
      const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const sRem = (sec % 60).toString().padStart(2, '0');
        return `00:${m}:${sRem},000`;
      };
      return `${idx + 1}\n${formatTime(s.startSecond)} --> ${formatTime(s.endSecond)}\n${s.subtitle}\n`;
    }).join('\n');

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vivekam-${reel.theme}-Captions.srt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#eddcc4] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Studio Header Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#c8b598]/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#8b5a2b]/20 px-2.5 py-0.5 text-xs font-bold text-[#8b5a2b]">
                {reel.theme}
              </span>
              <h1 className="font-serif-vintage text-2xl font-bold text-[#2b1b11]">
                {reel.title}
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-[#6e513a]">
              45–60s Reel Studio • Deterministic 7-Scene Narrative Architecture
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Voice Pitch & Speed Adjuster Toggle */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="flex items-center gap-1.5 rounded-full border border-[#8b5a2b]/40 bg-[#f7eedf] px-3 py-1 text-xs font-semibold text-[#2b1b11] hover:bg-[#fff9f0]"
              title="Reel Voice Narration Pitch & Cadence Settings"
            >
              <span>🎙 Normal Pitch ({voicePitch.toFixed(1)}x)</span>
            </button>

            {/* Language Quick Switch with Meaning Lock */}
            <div className="flex items-center rounded-full border border-[#8b5a2b]/30 bg-[#f7eedf] p-0.5 text-xs font-semibold">
              <button
                onClick={() => onSwitchLanguage('en')}
                className={`rounded-full px-2.5 py-0.5 transition-colors ${
                  reel.language === 'en' ? 'bg-[#27190f] text-[#f7eedf]' : 'text-[#6e513a] hover:text-[#2b1b11]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onSwitchLanguage('hi')}
                className={`rounded-full px-2.5 py-0.5 transition-colors ${
                  reel.language === 'hi' ? 'bg-[#27190f] text-[#f7eedf]' : 'text-[#6e513a] hover:text-[#2b1b11]'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Meaning Lock Badge */}
            <div className="flex items-center gap-1 rounded-full border border-[#c38c3e]/50 bg-[#fceddf] px-2.5 py-1 text-[11px] font-bold text-[#cf6b1c]">
              <Lock className="h-3 w-3" />
              <span>MEANING LOCKED ✓</span>
            </div>

            {/* Export Dropdown / Buttons */}
            <button
              onClick={handleExportScript}
              className="flex items-center gap-1 rounded-full border border-[#8b5a2b]/40 bg-[#f7eedf] px-3 py-1 text-xs font-semibold text-[#2b1b11] hover:bg-[#fff9f0]"
            >
              <Download className="h-3 w-3 text-[#8b5a2b]" />
              <span>Script</span>
            </button>
            <button
              onClick={handleExportCaptions}
              className="flex items-center gap-1 rounded-full bg-[#27190f] px-3 py-1 text-xs font-semibold text-[#f7eedf] hover:bg-[#3d2718]"
            >
              <Download className="h-3 w-3 text-[#c38c3e]" />
              <span>.SRT</span>
            </button>
          </div>
        </div>

        {/* Voice Settings Flyout if opened */}
        {showVoiceSettings && (
          <div className="mb-4 rounded-xl border border-[#8b5a2b]/40 bg-[#fbf6ed] p-3.5 text-xs shadow-sm flex flex-wrap items-center gap-4">
            <span className="font-bold text-[#8b5a2b]">Voice Settings (Normal Pitch & Minimal Gap):</span>
            <div className="flex items-center gap-2">
              <span className="text-[#684c36]">Pitch:</span>
              <input 
                type="range" 
                min="0.9" 
                max="1.15" 
                step="0.05" 
                value={voicePitch} 
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-20 accent-[#8b5a2b] cursor-pointer"
              />
              <span className="font-semibold text-[#2b1b11] w-14">{voicePitch === 1.0 ? "1.0 (Normal)" : `${voicePitch.toFixed(2)}x`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#684c36]">Cadence:</span>
              <input 
                type="range" 
                min="0.95" 
                max="1.15" 
                step="0.02" 
                value={voiceRate} 
                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                className="w-20 accent-[#8b5a2b] cursor-pointer"
              />
              <span className="font-semibold text-[#2b1b11] w-10">{voiceRate.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-[#eddcc4] px-2.5 py-1 text-[11px] text-[#2b1b11]">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Minimal Speech Gap Active ✓</span>
            </div>
            <button
              onClick={() => {
                setVoicePitch(1.0);
                setVoiceRate(1.02);
              }}
              className="rounded bg-[#eddcc4] px-2.5 py-1 text-[11px] font-medium text-[#2b1b11] hover:bg-[#dfccaF]"
            >
              Reset to Normal Pitch
            </button>
          </div>
        )}

        {/* 3-Column Studio Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: ROOT / SOURCE (Col 1-3)                       */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-3">
            
            {/* Root Source Card */}
            <div className="rounded-xl border border-[#bfa588]/40 bg-[#f7eedf] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#dfccaF]/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                  ROOT / SOURCE
                </span>
                <span className="flex items-center gap-1 rounded bg-[#27190f] px-2 py-0.5 text-[10px] font-bold text-[#f7eedf]">
                  <ShieldCheck className="h-3 w-3 text-[#c38c3e]" />
                  VERIFIED
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-[#785942]">Topic</span>
                  <p className="font-serif-vintage text-sm font-bold text-[#2b1b11]">
                    {reel.sourcePassport.topic}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-[#785942]">Source Canon</span>
                  <p className="font-semibold text-[#2b1b11]">
                    {reel.sourcePassport.sourceName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-[#785942]">Volume</span>
                    <p className="font-semibold text-[#2b1b11]">{reel.sourcePassport.volume}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#785942]">Source status</span>
                    <p className={`font-semibold ${sourceStatus === 'Verified ✓' ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {sourceStatus}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#785942]">Section / Chapter</span>
                  <p className="font-medium text-[#4a3322] leading-snug">
                    {reel.sourcePassport.section}
                  </p>
                </div>

                <div className="rounded-lg border border-[#c8b598]/60 bg-[#eddcc4]/60 p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5a2b]">
                    {reel.language === 'hi' ? 'Hindi Translation:' : 'Source Wording:'}
                  </span>
                  <p className="mt-1 font-serif-vintage text-xs italic text-[#2b1b11] leading-relaxed">
                    "{reel.language === 'hi' ? teachingRecord.languageVersions.hi : sourceQuote}"
                  </p>
                </div>

                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#8b5a2b] bg-[#eddcc4] py-2 text-center text-xs font-bold text-[#2b1b11] transition-colors hover:bg-[#27190f] hover:text-[#f7eedf]"
                >
                  <span>OPEN ORIGINAL SOURCE</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Reality Boundary Visual Map */}
            <div className="rounded-xl border border-[#bfa588]/40 bg-[#f7eedf] p-5 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#2b1b11]">
                <Layers className="h-3.5 w-3.5 text-[#8b5a2b]" />
                <span>WHAT IS REAL?</span>
              </div>
              <p className="mt-1 text-[11px] text-[#684c36]">
                Strict architectural boundary between historical truth and AI generation:
              </p>

              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 rounded bg-[#e8dbcc] px-2.5 py-1.5 font-bold text-[#27190f]">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>HISTORICAL SOURCE</span>
                </div>
                <div className="text-center text-[10px] text-[#8b5a2b]">↓</div>
                <div className="flex items-center gap-2 rounded bg-[#f0e3d4] px-2.5 py-1.5 font-semibold text-[#3b2515]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>VERIFIED TEACHING</span>
                </div>
                <div className="text-center text-[10px] text-[#8b5a2b]">↓</div>
                <div className="flex items-center gap-2 rounded bg-[#f4ebd9] px-2.5 py-1.5 font-medium text-[#5e4331]">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>AI INTERPRETATION</span>
                </div>
                <div className="text-center text-[10px] text-[#8b5a2b]">↓</div>
                <div className="flex items-center gap-2 rounded bg-[#faf2e6] px-2.5 py-1.5 font-medium text-[#6e513a]">
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  <span>MODERN FICTIONAL STORY</span>
                </div>
                <div className="text-center text-[10px] text-[#8b5a2b]">↓</div>
                <div className="flex items-center gap-2 rounded bg-[#fbf6ed] px-2.5 py-1.5 font-medium text-[#785942]">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  <span>AI VISUALIZATION</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* CENTER COLUMN: 9:16 INTERACTIVE REEL PREVIEW (Col 4-8)      */}
          {/* ========================================================= */}
          <div className="flex flex-col items-center lg:col-span-5">
            
            {/* Phone Bezel Container */}
            <div className="relative w-full max-w-[340px] rounded-[36px] border-[10px] border-[#22160d] bg-[#1a120c] p-2 shadow-2xl ring-1 ring-[#c38c3e]/30">
              
              {/* Speaker notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-[#110904] z-30" />

              {/* 9:16 Reel Viewport */}
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[26px] bg-[#120a05]">
                
                {/* Visual Scene Asset with subtle Ken Burns Motion */}
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={activeScene.visualAsset.assetUrl}
                    alt={activeScene.title}
                    className={`h-full w-full object-cover transition-transform duration-1000 ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  
                  {/* Atmospheric dark gradient for complete readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
                </div>

                {/* Top Overlay: Scene Badge & Audio Indicator */}
                <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded-md px-2.5 py-1 text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-xs ${
                      activeScene.contentCategory === 'SOURCE'
                        ? 'bg-emerald-600 text-white'
                        : activeScene.contentCategory === 'AI_STORY'
                        ? 'bg-orange-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {activeScene.categoryBadge}
                    </span>
                    <span className="text-[10px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-md">
                      Scene {activeSceneIndex + 1}/7
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setIsAudioMuted(!isAudioMuted);
                        if (!isAudioMuted && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                      title={isAudioMuted ? "Unmute narration (Normal pitch 1.0x)" : "Mute narration"}
                    >
                      {isAudioMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-amber-300" />}
                    </button>
                  </div>
                </div>

                {/* COMPLETE SCENE-SPECIFIC OVERLAYS */}
                <div className="absolute inset-x-2.5 sm:inset-x-3 top-12 bottom-12 z-20 flex flex-col justify-end pointer-events-none pb-1">
                  
                  {/* SCENE 1: HOOK */}
                  {activeScene.sceneType === 'HOOK' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-[#cf6b1c] px-2.5 py-0.5 text-[9px] font-extrabold text-white tracking-widest uppercase">
                        THE MODERN DILEMMA
                      </div>
                      <div className="rounded-xl bg-black/85 p-3.5 backdrop-blur-md border border-white/15 shadow-xl">
                        <p className="font-serif-vintage text-base sm:text-lg font-bold text-amber-100 leading-snug">
                          "{activeScene.subtitle}"
                        </p>
                        <p className="mt-1.5 text-[10px] text-amber-200/80">
                          Why do we freeze when our conviction is tested?
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCENE 2: MODERN STORY */}
                  {activeScene.sceneType === 'MODERN_STORY' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-orange-700 px-2.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                        {reel.storyContext.toUpperCase()} SITUATION
                      </div>
                      <div className="rounded-xl bg-black/85 p-3.5 backdrop-blur-md border border-white/15 shadow-xl">
                        <p className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                          "{activeScene.subtitle}"
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[9px] text-[#c38c3e]">
                          <span>Relatable Fictional Scenario</span>
                          <span>Source Grounded ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENE 3: VERIFIED TEACHING (Complete Portion Displayed with Source Inspection) */}
                  {activeScene.sceneType === 'VERIFIED_TEACHING' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-emerald-700 px-2.5 py-0.5 text-[9px] font-extrabold text-white tracking-widest uppercase shadow-xs">
                          VERIFIED ORIGINAL TEACHING
                        </span>
                      </div>
                      <div className="rounded-xl bg-gradient-to-b from-[#22160d]/95 to-[#120a05]/95 p-3.5 sm:p-4 backdrop-blur-md border-2 border-[#c38c3e]/80 shadow-2xl">
                        <span className="font-serif-vintage text-2xl text-[#c38c3e] leading-none block -mb-2">“</span>
                        <p className="font-serif-vintage text-xs sm:text-sm font-bold text-amber-100 italic leading-relaxed">
                          {teachingRecord.teaching}
                        </p>
                        <div className="mt-2.5 pt-2 border-t border-[#c38c3e]/30 flex flex-col gap-0.5">
                          <span className="font-serif-vintage text-xs font-bold text-[#c38c3e]">
                            — Swami Vivekananda
                          </span>
                          <span className="text-[9px] text-amber-200/70">
                            {teachingRecord.volume} • {teachingRecord.chapter}
                          </span>
                        </div>
                        
                        {/* Direct Tap to View Archival Record */}
                        <button
                          onClick={() => setShowSourceModal(true)}
                          className="mt-2.5 flex items-center justify-between w-full rounded-lg bg-[#c38c3e]/20 hover:bg-[#c38c3e]/30 border border-[#c38c3e]/40 px-2.5 py-1 text-[10px] font-semibold text-amber-200 transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                            <span>Complete Works Archival Record</span>
                          </span>
                          <span className="flex items-center gap-0.5 text-[#f7eedf]">
                            <span>View Source</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCENE 4: AI INTERPRETATION */}
                  {activeScene.sceneType === 'AI_INTERPRETATION' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-amber-600 px-2.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                        MEANING FOR TODAY
                      </div>
                      <div className="rounded-xl bg-black/85 p-3.5 backdrop-blur-md border border-white/15 shadow-xl">
                        <p className="text-xs sm:text-sm font-medium text-amber-50 leading-relaxed">
                          "{activeScene.subtitle}"
                        </p>
                        <p className="mt-1.5 text-[9px] text-[#c38c3e]">
                          Translating ancient principle into psychological clarity
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCENE 5: TAKEAWAY */}
                  {activeScene.sceneType === 'TAKEAWAY' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-[#8b5a2b] px-2.5 py-0.5 text-[9px] font-bold text-white tracking-widest uppercase">
                        CORE PRINCIPLE
                      </div>
                      <div className="rounded-xl bg-black/85 p-3.5 sm:p-4 backdrop-blur-md border border-[#c38c3e]/50 shadow-xl text-center">
                        <p className="font-serif-vintage text-sm sm:text-base font-bold text-amber-200 leading-snug">
                          "{activeScene.subtitle}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SCENE 6: ACTION CHALLENGE (Complete Portion Displayed) */}
                  {activeScene.sceneType === 'ACTION_CHALLENGE' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-[#cf6b1c] px-2.5 py-0.5 text-[9px] font-extrabold text-white tracking-widest uppercase">
                        YOUR 24-HOUR ACTION
                      </div>
                      <div className="rounded-xl bg-gradient-to-b from-[#2a170a]/95 to-[#160a03]/95 p-3.5 backdrop-blur-md border border-[#cf6b1c]/80 shadow-2xl">
                        <p className="text-xs font-bold text-amber-200">
                          {reel.actionChallenge.title}
                        </p>
                        <p className="mt-1 text-xs text-white leading-relaxed font-medium">
                          "{reel.actionChallenge.instruction}"
                        </p>
                        <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-amber-200/90 font-semibold">
                          <span>⏱ {reel.actionChallenge.timeRequired}</span>
                          <span>⏳ {reel.actionChallenge.deadline}</span>
                          <span className="rounded bg-[#cf6b1c] px-1.5 py-0.5 text-white">
                            {reel.actionChallenge.difficulty}
                          </span>
                        </div>
                        
                        {!reel.actionChallenge.accepted ? (
                          <button
                            onClick={handleAcceptChallenge}
                            className="mt-2.5 w-full rounded-lg bg-[#cf6b1c] hover:bg-[#b85b14] py-1.5 text-center text-[10px] font-bold text-white transition-colors"
                          >
                            [ ACCEPT 24-HR CHALLENGE ]
                          </button>
                        ) : (
                          <div className="mt-2 rounded bg-emerald-950/80 border border-emerald-500/40 py-1 text-center text-[10px] font-bold text-emerald-300">
                            Challenge Accepted ✓
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SCENE 7: SOURCE CARD (Complete Portion Displayed with Direct Modal Link) */}
                  {activeScene.sceneType === 'SOURCE_CARD' && (
                    <div className="space-y-1.5 pointer-events-auto max-h-[85%] overflow-y-auto scrollbar-thin">
                      <div className="inline-block rounded-md bg-emerald-800 px-2.5 py-0.5 text-[9px] font-extrabold text-white tracking-widest uppercase">
                        TRUTH LEDGER PASSPORT
                      </div>
                      <div className="rounded-xl bg-black/90 p-3.5 backdrop-blur-md border border-emerald-500/60 shadow-2xl text-left">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="font-serif-vintage font-bold text-xs text-amber-100">
                            {reel.sourcePassport.sourceName}
                          </span>
                          <span className={`text-[9px] font-bold ${sourceStatus === 'Verified ✓' ? 'text-emerald-400' : 'text-amber-300'}`}>{sourceStatus}</span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-white">
                          {reel.sourcePassport.volume} • {reel.sourcePassport.section}
                        </p>
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 flex w-full items-center justify-center gap-1 rounded bg-emerald-800 hover:bg-emerald-700 py-1.5 text-[10px] font-bold text-white transition-colors"
                        >
                          <span>Open original source</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                </div>

                {/* Progress bar inside phone */}
                <div className="absolute bottom-2 left-3 right-3 z-30">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div 
                      className="h-full bg-[#c38c3e] transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, Math.round(((activeSceneIndex + (sceneProgress / 100)) / reel.scenes.length) * 100))}%` 
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-white/80 font-medium">
                    <span>Scene {activeSceneIndex + 1} of {reel.scenes.length}</span>
                    <span>{isPlaying ? "▶ Reading Full Slide..." : "❚❚ Paused"}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Playback Controls Below Phone */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8b5a2b]/40 bg-[#f7eedf] text-[#2b1b11] hover:bg-[#fff9f0]"
                title="Restart Reel"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="flex h-12 w-32 items-center justify-center gap-2 rounded-full bg-[#27190f] font-bold text-sm text-[#f7eedf] shadow-md transition-all hover:bg-[#3d2718] active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                    <span>Play Reel</span>
                  </>
                )}
              </button>
            </div>

            {/* Scrubbable 7-Scene Timeline Bar */}
            <div className="mt-4 w-full max-w-[360px]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#684c36] mb-1.5">
                <span>Deterministic Scenes</span>
                <span>Click to Inspect Provenance</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {reel.scenes.map((scene, idx) => (
                  <button
                    key={scene.id}
                    onClick={() => handleSelectSceneManual(scene, idx)}
                    className={`group relative rounded py-1.5 text-center text-[10px] font-bold transition-all ${
                      activeSceneIndex === idx
                        ? 'bg-[#27190f] text-[#f7eedf] ring-2 ring-[#c38c3e]'
                        : scene.contentCategory === 'SOURCE'
                        ? 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
                        : 'bg-[#dfccaF] text-[#3b2718] hover:bg-[#cfba9c]'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="block text-[8px] opacity-80 truncate">
                      {scene.sceneType.split('_')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Complete Reel Transcript Toggle */}
            <div className="mt-3 w-full max-w-[360px]">
              <button
                onClick={() => setShowFullTranscript(!showFullTranscript)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#8b5a2b]/30 bg-[#f7eedf] py-1.5 text-center text-xs font-semibold text-[#2b1b11] hover:bg-[#fff9f0] transition-colors"
              >
                <span>{showFullTranscript ? "▲ Hide Complete Reel Transcript" : "▼ Inspect Complete 7-Scene Transcript"}</span>
              </button>
              
              {showFullTranscript && (
                <div className="mt-2 space-y-2 rounded-xl border border-[#8b5a2b]/40 bg-[#fbf6ed] p-3 text-xs max-h-72 overflow-y-auto shadow-inner">
                  {reel.scenes.map((s, i) => (
                    <div key={s.id} className="rounded-lg border border-[#dfccaF] bg-[#eddcc4]/40 p-2 text-left">
                      <div className="flex items-center justify-between pb-1 border-b border-[#dfccaF]/60 text-[10px]">
                        <span className="font-bold text-[#8b5a2b]">Scene 0{i + 1}: {s.title}</span>
                        <span className="font-semibold text-[#6e513a]">{s.startSecond}s - {s.endSecond}s ({s.durationSeconds}s)</span>
                      </div>
                      <p className="mt-1 font-medium text-[#2b1b11]">{s.narration}</p>
                      <div className="mt-1 text-[10px] text-[#785942] flex justify-between">
                        <span>Category: {s.categoryBadge}</span>
                        <span>{s.provenance.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: TRUTH LEDGER & SOURCE PASSPORT (Col 9-12)    */}
          {/* ========================================================= */}
          <div className="space-y-5 lg:col-span-4">
            
            {/* TRUTH LEDGER PANEL */}
            <div className="rounded-xl border border-[#bfa588]/40 bg-[#f7eedf] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#dfccaF]/80 pb-3">
                <div>
                  <h3 className="font-serif-vintage text-base font-bold text-[#2b1b11]">
                    TRUTH LEDGER
                  </h3>
                  <p className="text-[11px] text-[#785942]">
                    Know exactly what is real.
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#8b5a2b]" />
              </div>

              {/* Content Breakdown Summary */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-emerald-800/20 bg-emerald-50/60 p-2 text-emerald-900">
                  <span className="font-bold">✓ SOURCE</span>
                  <p className="text-[11px]">1 verified quotation</p>
                </div>
                <div className="rounded-lg border border-amber-800/20 bg-amber-50/60 p-2 text-amber-900">
                  <span className="font-bold">● INTERPRETATION</span>
                  <p className="text-[11px]">2 AI explanations</p>
                </div>
                <div className="rounded-lg border border-orange-800/20 bg-orange-50/60 p-2 text-orange-900">
                  <span className="font-bold">● AI STORY</span>
                  <p className="text-[11px]">2 fictional scenes</p>
                </div>
                <div className="rounded-lg border border-blue-800/20 bg-blue-50/60 p-2 text-blue-900">
                  <span className="font-bold">● AI VISUAL</span>
                  <p className="text-[11px]">4 creative visuals</p>
                </div>
              </div>

              {/* Provenance Inspector for Current Selected Scene */}
              <div className="mt-5 rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-3.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#dfccaF] pb-2">
                  <span className="text-[10px] font-bold text-[#8b5a2b] uppercase tracking-wider">
                    INSPECTING SCENE 0{selectedSceneForInspection.order}
                  </span>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    selectedSceneForInspection.provenance.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedSceneForInspection.provenance.status}
                  </span>
                </div>

                <div className="mt-2.5 space-y-2 text-[11px]">
                  <div>
                    <span className="text-[#785942]">Content Type:</span>
                    <p className="font-bold text-[#2b1b11]">
                      {selectedSceneForInspection.provenance.contentType}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#785942]">Source Canon:</span>
                    <p className="font-semibold text-[#2b1b11]">
                      {selectedSceneForInspection.provenance.sourceName}
                    </p>
                  </div>

                  {selectedSceneForInspection.provenance.volume && (
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-[#785942]">Volume:</span>
                        <p className="font-semibold">{selectedSceneForInspection.provenance.volume}</p>
                      </div>
                      <div>
                        <span className="text-[#785942]">Historical Fact:</span>
                        <p className="font-semibold">
                          {selectedSceneForInspection.provenance.historicalFact ? 'YES' : 'NO (Fictional)'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[#785942]">Change From Source:</span>
                    <p className="font-medium text-[#4a3221]">
                      {selectedSceneForInspection.provenance.changeFromSource}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#785942]">Pedagogical Purpose:</span>
                    <p className="text-[#5e4331] leading-snug">
                      {selectedSceneForInspection.provenance.purpose}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOURCE PASSPORT & INTEGRITY SCORE */}
            <div className="rounded-xl border border-[#bfa588]/40 bg-[#f7eedf] p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#dfccaF]/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b5a2b]">
                  REEL PASSPORT
                </span>
                <div className={`flex items-center gap-1 text-xs font-bold ${sourceStatus === 'Verified ✓' ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {sourceStatus === 'Verified ✓' ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  <span>{reel.sourcePassport.sourceStatus}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[#c8b598] bg-[#ebdcc6]/70 p-3 text-xs text-[#3b2718]">
                <p>
                  The original source page is linked below. Stories and practical interpretations in this reel are generated separately from the quotation.
                </p>
                <a className="mt-2 inline-flex items-center gap-1 font-semibold text-[#8b5a2b] underline underline-offset-2" href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  Open original source <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Passport specs table */}
              <div className="mt-3 divide-y divide-[#dfccaF]/60 text-[11px]">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#785942]">Direct Quotations</span>
                  <span className="font-semibold text-[#2b1b11]">{reel.sourcePassport.directQuotations}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#785942]">AI Paraphrases</span>
                  <span className="font-semibold text-[#2b1b11]">{reel.sourcePassport.aiParaphrases}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#785942]">Fictional Scenes</span>
                  <span className="font-semibold text-[#2b1b11]">{reel.sourcePassport.fictionalScenes}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#785942]">AI Narration</span>
                  <span className="font-semibold text-emerald-700">Yes (Synthetic)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#785942]">Historical Voice Cloning</span>
                  <span className="font-bold text-rose-800">✕ Not used (Strictly barred)</span>
                </div>
              </div>

              <button
                onClick={() => setShowSourceModal(true)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#8b5a2b] bg-[#eddcc4] py-2 text-center text-xs font-bold text-[#2b1b11] transition-colors hover:bg-[#27190f] hover:text-[#f7eedf]"
              >
                <span>OPEN ARCHIVAL SOURCE RECORD</span>
                <ShieldCheck className="h-3.5 w-3.5 text-[#8b5a2b]" />
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: YOUR 24-HOUR ACTION (THE CORE USP!)         */}
        {/* ========================================================= */}
        <div className="mt-5 rounded-2xl border-2 border-[#8b5a2b] bg-gradient-to-r from-[#fbf6ed] via-[#f7eedf] to-[#f4ebd9] p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            
            {/* Left Challenge Details */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cf6b1c] text-[#f7eedf]">
                  <Flame className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#cf6b1c]">
                  YOUR TEACHING IS NOT FINISHED
                </span>
              </div>

              <h2 className="mt-2 font-serif-vintage text-2xl sm:text-3xl font-bold text-[#2b1b11]">
                YOUR 24-HOUR VIVEKA CHALLENGE
              </h2>

              <p className="mt-2 text-base font-semibold text-[#8b5a2b]">
                "{reel.actionChallenge.instruction}"
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#684c36]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8b5a2b]">Difficulty:</span>
                  <span className="rounded bg-[#ebdcc6] px-2 py-0.5 text-[#2b1b11]">
                    {reel.actionChallenge.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#8b5a2b]" />
                  <span>Time: {reel.actionChallenge.timeRequired}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Deadline: {reel.actionChallenge.deadline}</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {!reel.actionChallenge.accepted && (
                <button
                  onClick={handleAcceptChallenge}
                  className="w-full sm:w-auto rounded-full bg-[#27190f] px-8 py-3.5 text-sm font-bold text-[#f7eedf] shadow-lg transition-all hover:bg-[#3d2718] hover:scale-105 active:scale-95"
                >
                  [ ACCEPT CHALLENGE ]
                </button>
              )}

              {reel.actionChallenge.accepted && !reel.actionChallenge.completed && (
                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <div className="flex items-center justify-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Challenge Accepted ✓</span>
                  </div>
                  <button
                    onClick={() => setShowReflectionModal(true)}
                    className="rounded-full bg-[#cf6b1c] px-6 py-2.5 text-xs font-bold text-[#f7eedf] shadow-md transition-all hover:bg-[#b85b14]"
                  >
                    ✓ I TRIED IT (COMPLETE)
                  </button>
                </div>
              )}

              {reel.actionChallenge.completed && (
                <div className="rounded-xl border border-emerald-600/40 bg-emerald-50 p-3 text-center sm:text-right">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Award className="h-4 w-4 text-emerald-700" />
                    <span>You practiced the teaching!</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-emerald-900">
                    Feeling: {reel.actionChallenge.reflection?.feeling} • Streak extended 🔥
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Reflection Modal */}
        {showReflectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-[#8b5a2b] bg-[#f7eedf] p-6 shadow-2xl">
              <h3 className="font-serif-vintage text-xl font-bold text-[#2b1b11]">
                How did it feel?
              </h3>
              <p className="mt-1 text-xs text-[#684c36]">
                Reflect on your 24-hour Viveka challenge to solidify the habit.
              </p>

              {/* Mood options */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { label: 'Empowered', emoji: '😊' },
                  { label: 'Good', emoji: '🙂' },
                  { label: 'Neutral', emoji: '😐' },
                  { label: 'Difficult', emoji: '😟' },
                ].map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedFeelingMood(mood.label as any)}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      selectedFeelingMood === mood.label
                        ? 'border-2 border-[#8b5a2b] bg-[#ebdcc6] font-bold text-[#2b1b11]'
                        : 'border-[#dfccaF] bg-[#fbf6ed] text-[#5e4331] hover:bg-[#f4ebd9]'
                    }`}
                  >
                    <span className="text-xl block">{mood.emoji}</span>
                    <span className="text-[10px] mt-1 block">{mood.label}</span>
                  </button>
                ))}
              </div>

              {/* Optional reflection text */}
              <div className="mt-4">
                <label className="text-[11px] font-semibold text-[#5e4331] block mb-1">
                  What did you learn? (Optional)
                </label>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="e.g. Taking the first step was scarier than the actual conversation..."
                  className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] p-2.5 text-xs text-[#2b1b11] focus:border-[#8b5a2b] focus:outline-hidden"
                  rows={3}
                />
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setShowReflectionModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#6e513a] hover:bg-[#ebdcc6]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteChallengeSubmit}
                  className="rounded-full bg-[#27190f] px-5 py-2 text-xs font-bold text-[#f7eedf] hover:bg-[#3d2718]"
                >
                  Save Reflection ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Source Inspector Archival Modal */}
        {showSourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl rounded-2xl border-2 border-[#8b5a2b] bg-[#fbf6ed] p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
              
              {/* Close button */}
              <button
                onClick={() => setShowSourceModal(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#ebdcc6] text-[#2b1b11] hover:bg-[#dfccaF] transition-colors"
                title="Close"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-[#dfccaF] pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#27190f] text-[#c38c3e]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-vintage text-xl font-bold text-[#2b1b11]">
                      Quotation & Source Details
                    </span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${sourceStatus === 'Verified ✓' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {sourceStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#785942]">
                    Source publication, location, and direct link
                  </p>
                </div>
              </div>

              {/* Verbatim Quotation in Calligraphic Style */}
              <div className="mt-5 rounded-xl border border-[#c8b598] bg-[#f5ebd9] p-5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5a2b]">
                  {reel.language === 'hi' ? 'Original Source Wording (English):' : 'Quotation as Recorded in the Source:'}
                </span>
                <p className="mt-2 font-serif-vintage text-base sm:text-lg font-bold text-[#2b1b11] italic leading-relaxed">
                  "{sourceQuote}"
                </p>
                <p className="mt-2 font-serif-vintage text-xs text-[#8b5a2b] text-right font-semibold">
                  — Swami Vivekananda
                </p>
              </div>

              {/* Canonical Citation Specs */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-[#dfccaF] bg-[#eddcc4]/50 p-3">
                  <span className="text-[10px] font-bold text-[#785942] uppercase tracking-wider">Source Publication</span>
                  <p className="mt-0.5 font-bold text-[#2b1b11]">{teachingRecord.sourceName}</p>
                  <p className="text-[11px] text-[#6e513a]">Use the linked source page to confirm its publisher and wording.</p>
                </div>
                <div className="rounded-lg border border-[#dfccaF] bg-[#eddcc4]/50 p-3">
                  <span className="text-[10px] font-bold text-[#785942] uppercase tracking-wider">Volume & Chapter</span>
                  <p className="mt-0.5 font-bold text-[#2b1b11]">{teachingRecord.volume}</p>
                  <p className="text-[11px] text-[#6e513a]">{teachingRecord.chapter}</p>
                </div>
              </div>

              {/* Historical Context / Delivery */}
              <div className="mt-4 rounded-lg border border-[#dfccaF] bg-[#eddcc4]/40 p-3.5 text-xs">
                <span className="text-[10px] font-bold text-[#785942] uppercase tracking-wider">Historical Setting & Discourse Context</span>
                <p className="mt-1 text-xs text-[#3b2718] leading-relaxed">
                  {teachingRecord.context}
                </p>
                {reel.language === 'hi' && (
                  <p className="mt-2 text-[11px] text-[#6e513a] italic leading-normal">
                    The Hindi narration is a translation of the English quotation shown above; the linked page remains the reference for the original wording.
                  </p>
                )}
              </div>

              {/* Trust & Integrity Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Source reference attached</span>
                </span>
                <span className="flex items-center gap-1 rounded-full border border-[#8b5a2b]/30 bg-[#ebdcc6] px-3 py-1 font-semibold text-[#2b1b11]">
                  <Lock className="h-3.5 w-3.5 text-[#8b5a2b]" />
                  <span>Meaning Locked ✓</span>
                </span>
                <span className="flex items-center gap-1 rounded-full border border-rose-600/30 bg-rose-50 px-3 py-1 font-semibold text-rose-800">
                  <span>✕ Zero Voice Cloning</span>
                </span>
              </div>

              {/* The sourceUrl on the teaching record is the citation target. */}
              <div className="mt-5 border-t border-[#dfccaF] pt-4">
                <span className="text-xs font-bold text-[#2b1b11] block mb-2">
                  Original source page:
                </span>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#8b5a2b]/50 bg-[#eddcc4] px-3 py-2 text-xs text-[#2b1b11] font-semibold hover:bg-[#27190f] hover:text-[#f7eedf] transition-colors break-all"
                >
                  <span>{sourceUrl}</span>
                  <ExternalLink className="ml-2 h-3.5 w-3.5 shrink-0" />
                </a>
              </div>

              {/* Modal Footer / Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#dfccaF] pt-4">
                <button
                  onClick={() => {
                    const cite = `Vivekananda, Swami. "${sourceQuote}" ${teachingRecord.sourceName}, ${teachingRecord.volume}, ${teachingRecord.chapter}. ${sourceUrl}`;
                    navigator.clipboard?.writeText(cite);
                    setCopiedCitation(true);
                    setTimeout(() => setCopiedCitation(false), 2500);
                  }}
                  className="rounded-full border border-[#8b5a2b] bg-[#ebdcc6] px-4 py-2 text-xs font-semibold text-[#2b1b11] hover:bg-[#dfccaF] transition-colors"
                >
                  {copiedCitation ? "✓ Citation Copied to Clipboard" : "📋 Copy Formal Citation"}
                </button>
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="rounded-full bg-[#27190f] px-6 py-2 text-xs font-bold text-[#f7eedf] hover:bg-[#3d2718] transition-colors"
                >
                  Close Source Record
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
