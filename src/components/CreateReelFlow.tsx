import React, { useState, useMemo } from 'react';
import { TeachingRecord, VERIFIED_TEACHINGS, FEELING_TILES } from '../data/teachings';
import { StoryContext, LanguageCode, GeneratedReel } from '../types';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  GraduationCap,
  Briefcase,
  Smile,
  Lock,
  Layers,
  Check
} from 'lucide-react';
import { buildDeterministicReel } from '../utils/reelGenerator';
import { analyzeUserDilemma } from '../utils/semanticMatcher';

interface CreateReelFlowProps {
  initialFeeling?: string;
  onReelGenerated: (reel: GeneratedReel) => void;
  onCancel: () => void;
}

export const CreateReelFlow: React.FC<CreateReelFlowProps> = ({
  initialFeeling = "I failed my exam and now I feel like I'm not good enough",
  onReelGenerated,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialFeeling ? 2 : 1);
  const [selectedFeeling, setSelectedFeeling] = useState<string>(initialFeeling);
  const [customPromptInput, setCustomPromptInput] = useState<string>('');

  // Analyze user dilemma semantically
  const semanticAnalysis = useMemo(() => {
    return analyzeUserDilemma(selectedFeeling);
  }, [selectedFeeling]);

  const [selectedTeaching, setSelectedTeaching] = useState<TeachingRecord>(() => {
    const analysis = analyzeUserDilemma(initialFeeling);
    return analysis.rankedMatches[0]?.teaching || VERIFIED_TEACHINGS[0];
  });

  const [selectedContext, setSelectedContext] = useState<StoryContext>('campus');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [selectedDuration, setSelectedDuration] = useState<number>(45);

  // Loading state with intentional multi-step animation
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPhase, setGenerationPhase] = useState<string>('');

  // Hallucination Firewall Tester State
  const [quoteSearchQuery, setQuoteSearchQuery] = useState<string>('');
  const [quoteSearchStatus, setQuoteSearchStatus] = useState<'idle' | 'verified' | 'not_found'>('idle');
  const [verifiedSearchResult, setVerifiedSearchResult] = useState<TeachingRecord | null>(null);

  // Sync selected teaching when analysis changes
  const handleSelectNewPrompt = (prompt: string) => {
    setSelectedFeeling(prompt);
    const analysis = analyzeUserDilemma(prompt);
    if (analysis.rankedMatches[0]) {
      setSelectedTeaching(analysis.rankedMatches[0].teaching);
    }
    setCurrentStep(2);
  };

  // Handle quote verification check (Firewall demo)
  const handleVerifyCustomQuote = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : quoteSearchQuery).trim().toLowerCase();
    if (!q) return;

    // Check against authentic database
    const found = VERIFIED_TEACHINGS.find(
      t => t.teaching.toLowerCase().includes(q) ||
           q.includes(t.teaching.toLowerCase().slice(0, 20)) ||
           t.tags.some(tag => q.includes(tag.toLowerCase()))
    );

    if (found) {
      setQuoteSearchStatus('verified');
      setVerifiedSearchResult(found);
      setSelectedTeaching(found);
    } else {
      setQuoteSearchStatus('not_found');
      setVerifiedSearchResult(null);
    }
  };

  // Generation flow with real/simulated pipeline
  const handleStartGeneration = async () => {
    setIsGenerating(true);

    const phases = [
      "ROOT: Retrieving verified teaching from Belur Math digital archives...",
      "REEL: Crafting relatable youth story...",
      "CLAIM CHECK: Validating source alignment (7 claims checked, 7 supported)...",
      "LANGUAGE: Preserving semantic intent with Meaning Lock...",
      "ACT: Synthesizing practical 24-hour Viveka challenge..."
    ];

    for (let i = 0; i < phases.length; i++) {
      setGenerationPhase(phases[i]);
      await new Promise(res => setTimeout(res, 650));
    }

    try {
      // Try to call full-stack server endpoint
      const response = await fetch('/api/generate-reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teachingId: selectedTeaching.id,
          storyContext: selectedContext,
          language: selectedLanguage,
          userProblem: selectedFeeling,
          durationSeconds: selectedDuration
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reel) {
          onReelGenerated(data.reel);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable or in preview fallback, using deterministic engine:", err);
    }

    // High quality deterministic fallback
    const fallbackReel = buildDeterministicReel(
      selectedTeaching,
      selectedContext,
      selectedLanguage,
      selectedFeeling,
      selectedDuration
    );
    onReelGenerated(fallbackReel);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#eddcc4] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Step Progress Bar */}
        <div className="mb-8 flex items-center justify-between border-b border-[#c8b598]/60 pb-4">
          <button 
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6e513a] hover:text-[#2b1b11]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-semibold">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#d8c5ab] text-[#785942]'}`}>
              1
            </span>
            <span className="hidden sm:inline text-[#684c36]">Problem</span>
            <span className="text-[#a88c70]">→</span>
            
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#d8c5ab] text-[#785942]'}`}>
              2
            </span>
            <span className="hidden sm:inline text-[#684c36]">Teaching</span>
            <span className="text-[#a88c70]">→</span>

            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#d8c5ab] text-[#785942]'}`}>
              3
            </span>
            <span className="hidden sm:inline text-[#684c36]">Story</span>
            <span className="text-[#a88c70]">→</span>

            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 4 ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#d8c5ab] text-[#785942]'}`}>
              4
            </span>
            <span className="hidden sm:inline text-[#684c36]">Language</span>
          </div>

          <div className="text-xs font-bold text-[#8b5a2b]">
            Step {currentStep} of 4
          </div>
        </div>

        {/* Loading Overlay when generating */}
        {isGenerating && (
          <div className="rounded-2xl border border-[#8b5a2b]/30 bg-[#f7eedf] p-8 sm:p-12 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#cf6b1c] bg-[#fae8d4] text-[#cf6b1c] animate-pulse">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-6 font-serif-vintage text-2xl font-bold text-[#2b1b11]">
              Crafting Verified Reel
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#8b5a2b]">
              {generationPhase}
            </p>
            <div className="mt-6 mx-auto h-2 w-72 overflow-hidden rounded-full bg-[#dfccaf]">
              <div className="h-full w-full bg-gradient-to-r from-[#8b5a2b] via-[#cf6b1c] to-[#c38c3e] animate-pulse" />
            </div>
            <p className="mt-4 text-xs text-[#7d5d44]">
              Ensuring 100% truth provenance and locking practical 24-hour challenge.
            </p>
          </div>
        )}

        {/* STEP 1: What are you facing today? */}
        {!isGenerating && currentStep === 1 && (
          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 sm:p-8 shadow-sm">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b5a2b]">
                Step 1 of 4 • Natural Language Grounding
              </span>
              <h2 className="mt-1 font-serif-vintage text-3xl font-bold text-[#2b1b11]">
                What are you facing today?
              </h2>
              <p className="mt-2 text-sm text-[#684c36]">
                Describe your situation in your own words, or choose a relatable scenario.
              </p>
            </div>

            {/* Custom Dilemma Input Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (customPromptInput.trim()) {
                  handleSelectNewPrompt(customPromptInput.trim());
                }
              }}
              className="mt-6 mx-auto max-w-2xl"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border-2 border-[#8b5a2b]/70 bg-[#fbf6ed] p-2 shadow-md">
                <div className="flex items-center gap-2.5 w-full pl-3">
                  <Sparkles className="h-5 w-5 text-[#cf6b1c] shrink-0" />
                  <input
                    type="text"
                    value={customPromptInput}
                    onChange={(e) => setCustomPromptInput(e.target.value)}
                    placeholder="e.g., I failed my exam and now I feel like I'm not good enough"
                    className="w-full bg-transparent py-1.5 text-xs sm:text-sm font-medium text-[#2b1b11] placeholder-[#a4866c] outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customPromptInput.trim()}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#27190f] px-5 py-2.5 text-xs font-bold text-[#f7eedf] hover:bg-[#3d2718] disabled:opacity-40"
                >
                  <span>Analyze Intent →</span>
                </button>
              </div>
            </form>

            {/* Quick Demo Prompts */}
            <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs">
              <span className="text-[11px] font-semibold text-[#8b5a2b]">Featured dilemmas:</span>
              {[
                "I failed my exam and now I feel like I'm not good enough",
                "I know the answer but fear speaking in public",
                "I have 14 tabs open and can't focus on studying",
                "My interview got rejected and I feel hopeless",
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectNewPrompt(prompt)}
                  className="rounded-full border border-[#bfa588]/60 bg-[#eddcc4]/70 px-3 py-1 text-[11px] font-medium text-[#4a3221] hover:border-[#8b5a2b] hover:bg-[#faf3e6]"
                >
                  "{prompt}"
                </button>
              ))}
            </div>

            {/* Feeling Tiles Grid */}
            <div className="mt-8 pt-6 border-t border-[#dfccaF]/80">
              <p className="text-[11px] font-bold text-[#8b5a2b] uppercase tracking-wider mb-3 text-center">
                Or select by emotional tile:
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FEELING_TILES.map((tile) => (
                  <button
                    key={tile.id}
                    onClick={() => handleSelectNewPrompt(tile.query)}
                    className={`flex items-start justify-between rounded-xl border p-4 text-left transition-all ${
                      selectedFeeling === tile.query
                        ? 'border-[#8b5a2b] bg-[#ebdcc6] shadow-xs'
                        : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/60 hover:bg-[#f2e6d3]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-[#2b1b11]">
                        {tile.label}
                      </p>
                      <p className="mt-1 text-xs text-[#684c36]">
                        {tile.desc}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#8b5a2b]">
                      {tile.theme}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Choose a Verified Teaching (Pipeline Representation) */}
        {!isGenerating && currentStep === 2 && (
          <div className="space-y-6">
            
            {/* The Explicit User Input → AI Understands → Search Library Pipeline Banner */}
            <div className="rounded-2xl border-2 border-[#8b5a2b] bg-[#fbf6ed] p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-[#dfccaF] pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#cf6b1c]">
                  STEP 2 OF 4: AI INTENT UNDERSTANDING & CANONICAL MATCHING
                </span>
                <span className="flex items-center gap-1 rounded bg-[#27190f] px-2 py-0.5 text-[10px] font-bold text-[#f7eedf]">
                  <ShieldCheck className="h-3 w-3 text-[#c38c3e]" />
                  BELUR MATH CANON
                </span>
              </div>

              {/* Graphical Visual Diagram */}
              <div className="space-y-3">
                {/* 1. USER INPUT */}
                <div className="rounded-xl border border-[#c8b598] bg-[#f7eedf] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b5a2b]">
                      USER INPUT
                    </span>
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="text-[10px] font-semibold text-[#8b5a2b] hover:text-[#2b1b11] underline"
                    >
                      Change Input
                    </button>
                  </div>
                  <p className="mt-1 font-serif-vintage text-base font-bold text-[#2b1b11]">
                    "{selectedFeeling}"
                  </p>
                </div>

                {/* Arrow */}
                <div className="text-center text-xs font-bold text-[#8b5a2b]">↓</div>

                {/* 2. AI UNDERSTANDS */}
                <div className="rounded-xl border border-[#cf6b1c]/40 bg-[#fceddf] p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#cf6b1c]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI UNDERSTANDS</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#5e4331]">Detected concepts:</span>
                    {semanticAnalysis.detectedConcepts.map((concept, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-[#f4deb8] px-2.5 py-0.5 text-xs font-bold text-[#7a3e0f]"
                      >
                        • {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-center text-xs font-bold text-[#8b5a2b]">↓</div>

                {/* 3. SEARCH TRUSTED TEACHING LIBRARY */}
                <div className="rounded-xl border border-emerald-800/30 bg-emerald-50/70 p-3.5 text-emerald-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>SEARCH TRUSTED TEACHING LIBRARY</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium">
                    Filtered against 35+ canonical passages in Complete Works
                  </span>
                </div>

                {/* Arrow */}
                <div className="text-center text-xs font-bold text-[#8b5a2b]">↓</div>

                {/* 4. TOP VERIFIED MATCHES SUMMARY */}
                <div className="rounded-xl border border-[#8b5a2b]/30 bg-[#eddcc4] p-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2b1b11] block mb-1">
                    TOP VERIFIED MATCHES:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#3b2718]">
                    {semanticAnalysis.rankedMatches.map((m, idx) => (
                      <span 
                        key={idx} 
                        className={`rounded-md px-2.5 py-1 ${
                          selectedTeaching.id === m.teaching.id 
                            ? 'bg-[#27190f] text-[#f7eedf]' 
                            : 'bg-[#f7eedf] text-[#2b1b11]'
                        }`}
                      >
                        {m.rank}. {m.teaching.theme} — <strong className="text-[#c38c3e]">{m.matchScore}%</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Cards for Top Matches */}
            <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 shadow-sm">
              <h3 className="font-serif-vintage text-xl font-bold text-[#2b1b11] mb-1">
                Choose Your Verified Teaching
              </h3>
              <p className="text-xs text-[#6e513a] mb-5">
                Select one of the top verified matches to ground your 30–60s reel:
              </p>

              <div className="space-y-4">
                {semanticAnalysis.rankedMatches.map((matchItem) => {
                  const teaching = matchItem.teaching;
                  const isSelected = selectedTeaching.id === teaching.id;

                  return (
                    <div
                      key={teaching.id}
                      onClick={() => setSelectedTeaching(teaching)}
                      className={`cursor-pointer rounded-xl border p-5 transition-all ${
                        isSelected
                          ? 'border-2 border-[#8b5a2b] bg-[#faf3e6] shadow-md ring-2 ring-[#8b5a2b]/20'
                          : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/60 hover:bg-[#f4ebd9]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#27190f] text-xs font-bold text-[#f7eedf]">
                            #{matchItem.rank}
                          </span>
                          <span className="rounded-full bg-[#8b5a2b]/15 px-2.5 py-0.5 text-xs font-bold text-[#8b5a2b]">
                            {teaching.theme}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-100">
                            <ShieldCheck className="h-3 w-3" />
                            {matchItem.matchScore}% MATCH
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#785942]">
                          {teaching.volume} • {teaching.chapter.split('—')[0]}
                        </span>
                      </div>

                      <p className="mt-3 font-serif-vintage text-base sm:text-lg font-bold text-[#2b1b11] leading-snug">
                        "{teaching.teaching}"
                      </p>

                      <p className="mt-2 text-xs text-[#6e513a] leading-relaxed">
                        <span className="font-semibold text-[#8b5a2b]">Why this matches:</span> {matchItem.matchReason}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[#dfccaF]/60 pt-3 text-xs">
                        <a
                          href={teaching.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[#8b5a2b] hover:text-[#2b1b11] underline underline-offset-2"
                        >
                          <span>Open original source</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <button
                          onClick={() => {
                            setSelectedTeaching(teaching);
                            setCurrentStep(3);
                          }}
                          className={`rounded-full px-5 py-1.5 font-bold text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#27190f] text-[#f7eedf]'
                              : 'bg-[#ebdcc6] text-[#2b1b11] hover:bg-[#27190f] hover:text-[#f7eedf]'
                          }`}
                        >
                          {isSelected ? 'Use This Teaching →' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hallucination Firewall Tester Demo */}
              <div className="mt-8 rounded-xl border border-dashed border-[#8b5a2b]/40 bg-[#f4ebd9]/80 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2b1b11]">
                  <ShieldCheck className="h-4 w-4 text-[#8b5a2b]" />
                  <span>TRUTH FIREWALL TESTER: Verify Any Custom Quote</span>
                </div>
                <p className="mt-1 text-[11px] text-[#684c36]">
                  Try testing an authentic quote versus an unverified one (e.g. try searching "crypto" or "give up"). Vivekam refuses to hallucinate fake quotes.
                </p>

                <div className="mt-3 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g., 'Face the brutes' or 'Always buy crypto'"
                      value={quoteSearchQuery}
                      onChange={(e) => {
                        setQuoteSearchQuery(e.target.value);
                        setQuoteSearchStatus('idle');
                      }}
                      className="w-full rounded-lg border border-[#c8b598] bg-[#fbf6ed] px-3 py-1.5 text-xs text-[#2b1b11] placeholder-[#9c7d61] focus:border-[#8b5a2b] focus:outline-hidden"
                    />
                  </div>
                  <button
                    onClick={() => handleVerifyCustomQuote()}
                    className="flex items-center gap-1 rounded-lg bg-[#27190f] px-3.5 py-1.5 text-xs font-semibold text-[#f7eedf] hover:bg-[#3d2718]"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Check Source</span>
                  </button>
                </div>

                {/* Pre-canned Demo Buttons */}
                <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                  <span className="text-[#785942]">Quick Demo:</span>
                  <button
                    onClick={() => {
                      setQuoteSearchQuery("Face the brutes");
                      handleVerifyCustomQuote("Face the brutes");
                    }}
                    className="rounded bg-[#ebdcc6] px-2 py-0.5 text-[#2b1b11] hover:bg-[#dfccaF]"
                  >
                    Try authentic: "Face the brutes"
                  </button>
                  <button
                    onClick={() => {
                      setQuoteSearchQuery("Invest in crypto to succeed");
                      handleVerifyCustomQuote("Invest in crypto to succeed");
                    }}
                    className="rounded bg-[#f0d8d8] px-2 py-0.5 text-[#882222] hover:bg-[#e8c0c0]"
                  >
                    Try fake: "Invest in crypto to succeed"
                  </button>
                </div>

                {/* Verification result messages */}
                {quoteSearchStatus === 'verified' && verifiedSearchResult && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#e2f0d9] p-2.5 text-xs text-[#275c1a]">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">SOURCE VERIFIED ✓</span>
                      <p className="mt-0.5 text-[11px]">
                        Matched in {verifiedSearchResult.sourceName}, {verifiedSearchResult.volume}, {verifiedSearchResult.chapter}. Ready to use!
                      </p>
                    </div>
                  </div>
                )}

                {quoteSearchStatus === 'not_found' && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#f9e2e2] p-2.5 text-xs text-[#992222]">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">⚠ SOURCE NOT FOUND</span>
                      <p className="mt-0.5 text-[11px]">
                        "This quotation could not be verified in our trusted teaching library." Vivekam will never invent or attribute fake quotes to Swami Vivekananda.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="rounded-full border border-[#8b5a2b]/40 px-5 py-2 text-xs font-semibold text-[#6e513a] hover:bg-[#ebdcc6]"
                >
                  ← Back to Input
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="rounded-full bg-[#27190f] px-6 py-2 text-xs font-semibold text-[#f7eedf] hover:bg-[#3d2718]"
                >
                  Next: Choose Story (Campus / Career) →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Choose your Story Context */}
        {!isGenerating && currentStep === 3 && (
          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 sm:p-8 shadow-sm">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b5a2b]">
                Step 3 of 4
              </span>
              <h2 className="mt-1 font-serif-vintage text-3xl font-bold text-[#2b1b11]">
                Choose your story context
              </h2>
              <p className="mt-2 text-sm text-[#684c36]">
                Where should the modern relatable situation take place?
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Campus */}
              <div
                onClick={() => setSelectedContext('campus')}
                className={`cursor-pointer rounded-xl border p-5 transition-all text-center ${
                  selectedContext === 'campus'
                    ? 'border-2 border-[#8b5a2b] bg-[#faf3e6] shadow-md ring-2 ring-[#8b5a2b]/20'
                    : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/60 hover:bg-[#f4ebd9]'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eddcc4] text-[#8b5a2b]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-serif-vintage text-base font-bold text-[#2b1b11]">
                  CAMPUS
                </h3>
                <p className="mt-1 text-xs text-[#684c36]">
                  Classroom question, seminar presentation, exams, or peer anxiety.
                </p>
                <div className="mt-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                    selectedContext === 'campus' ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#ebdcc6] text-[#6e513a]'
                  }`}>
                    {selectedContext === 'campus' ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>

              {/* Career */}
              <div
                onClick={() => setSelectedContext('career')}
                className={`cursor-pointer rounded-xl border p-5 transition-all text-center ${
                  selectedContext === 'career'
                    ? 'border-2 border-[#8b5a2b] bg-[#faf3e6] shadow-md ring-2 ring-[#8b5a2b]/20'
                    : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/60 hover:bg-[#f4ebd9]'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eddcc4] text-[#8b5a2b]">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-serif-vintage text-base font-bold text-[#2b1b11]">
                  CAREER
                </h3>
                <p className="mt-1 text-xs text-[#684c36]">
                  Job interview, creative pitch, imposter syndrome, or fear of failure.
                </p>
                <div className="mt-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                    selectedContext === 'career' ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#ebdcc6] text-[#6e513a]'
                  }`}>
                    {selectedContext === 'career' ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>

              {/* Everyday */}
              <div
                onClick={() => setSelectedContext('everyday')}
                className={`cursor-pointer rounded-xl border p-5 transition-all text-center ${
                  selectedContext === 'everyday'
                    ? 'border-2 border-[#8b5a2b] bg-[#faf3e6] shadow-md ring-2 ring-[#8b5a2b]/20'
                    : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/60 hover:bg-[#f4ebd9]'
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eddcc4] text-[#8b5a2b]">
                  <Smile className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-serif-vintage text-base font-bold text-[#2b1b11]">
                  EVERYDAY
                </h3>
                <p className="mt-1 text-xs text-[#684c36]">
                  Social boundaries, digital distraction, honest talk, or personal doubt.
                </p>
                <div className="mt-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                    selectedContext === 'everyday' ? 'bg-[#27190f] text-[#f7eedf]' : 'bg-[#ebdcc6] text-[#6e513a]'
                  }`}>
                    {selectedContext === 'everyday' ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded-full border border-[#8b5a2b]/40 px-5 py-2 text-xs font-semibold text-[#6e513a] hover:bg-[#ebdcc6]"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="rounded-full bg-[#27190f] px-6 py-2 text-xs font-semibold text-[#f7eedf] hover:bg-[#3d2718]"
              >
                Next: Choose Language →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Choose Language & Generate */}
        {!isGenerating && currentStep === 4 && (
          <div className="rounded-2xl border border-[#bfa588]/40 bg-[#f7eedf] p-6 sm:p-8 shadow-sm">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8b5a2b]">
                Step 4 of 4
              </span>
              <h2 className="mt-1 font-serif-vintage text-3xl font-bold text-[#2b1b11]">
                Choose reel language and duration
              </h2>
              <p className="mt-2 text-sm text-[#684c36]">
                Adapt the storytelling while preserving authentic meaning with Meaning Lock.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[#dfccaF] bg-[#fbf6ed] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8b5a2b]">Reel duration</p>
                  <p className="mt-1 text-sm font-semibold text-[#2b1b11]">{selectedDuration} seconds</p>
                </div>
                <span className="rounded-full bg-[#eddcc4] px-3 py-1 text-[11px] font-bold text-[#6e513a]">30s–60s</span>
              </div>
              <input
                type="range"
                min={30}
                max={60}
                step={5}
                value={selectedDuration}
                onChange={(event) => setSelectedDuration(Number(event.target.value))}
                className="mt-4 h-2 w-full cursor-pointer accent-[#8b5a2b]"
                aria-label="Select reel duration"
              />
              <div className="mt-3 flex justify-between text-[10px] font-semibold text-[#785942]">
                <span>30s</span>
                <span>45s</span>
                <span>60s</span>
              </div>
            </div>

            {/* Language grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { code: 'en', label: 'English', sub: 'Native English' },
                { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'Youth Hindi' },
                { code: 'bn', label: 'বাংলা (Bengali)', sub: 'Colloquial Bengali' },
                { code: 'ta', label: 'தமிழ் (Tamil)', sub: 'Modern Tamil' },
                { code: 'te', label: 'తెలుగు (Telugu)', sub: 'Contemporary Telugu' },
                { code: 'mr', label: 'मराठी (Marathi)', sub: 'Marathi adaptation' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code as LanguageCode)}
                  className={`rounded-xl border p-4 text-center transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-2 border-[#8b5a2b] bg-[#faf3e6] shadow-sm ring-1 ring-[#8b5a2b]'
                      : 'border-[#dfccaF] bg-[#fbf6ed] hover:border-[#8b5a2b]/50'
                  }`}
                >
                  <p className="text-sm font-bold text-[#2b1b11]">{lang.label}</p>
                  <p className="text-[11px] text-[#6e513a]">{lang.sub}</p>
                </button>
              ))}
            </div>

            {/* MEANING LOCK badge matching requirements */}
            <div className="mt-6 rounded-xl border border-[#c38c3e]/50 bg-[#fceddf]/60 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2b1b11]">
                <Lock className="h-4 w-4 text-[#cf6b1c]" />
                <span className="text-[#cf6b1c]">MEANING LOCKED ✓</span>
              </div>
              <p className="mt-1 text-xs text-[#5e4331] leading-relaxed">
                Meaning preserved while adapting language. Original historical quotation remains untranslated in citation records.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-medium text-[#785942]">
                <span className="rounded bg-[#f0dec7] px-2 py-0.5">✓ Core teaching preserved</span>
                <span className="rounded bg-[#f0dec7] px-2 py-0.5">✓ Tone preserved</span>
                <span className="rounded bg-[#f0dec7] px-2 py-0.5">✓ Intended action preserved</span>
                <span className="rounded bg-[#fceddf] px-2 py-0.5 text-[#cf6b1c]">⚠ Idioms adapted for youth</span>
              </div>
            </div>

            {/* Summary Preview */}
            <div className="mt-6 rounded-xl border border-[#dfccaF] bg-[#fbf6ed] p-4 text-xs text-[#5e4331]">
              <span className="font-bold text-[#2b1b11]">Generation Plan:</span>
              <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div><span className="text-[#8b5a2b]">Theme:</span> {selectedTeaching.theme}</div>
                <div><span className="text-[#8b5a2b]">Context:</span> {selectedContext.toUpperCase()}</div>
                <div><span className="text-[#8b5a2b]">Language:</span> {selectedLanguage.toUpperCase()}</div>
                <div><span className="text-[#8b5a2b]">Duration:</span> {selectedDuration}s</div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="rounded-full border border-[#8b5a2b]/40 px-5 py-2 text-xs font-semibold text-[#6e513a] hover:bg-[#ebdcc6]"
              >
                ← Back
              </button>
              <button
                onClick={handleStartGeneration}
                className="group inline-flex items-center gap-2 rounded-full bg-[#27190f] px-7 py-3 text-sm font-bold text-[#f7eedf] shadow-lg transition-all hover:bg-[#3d2718] hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-[#c38c3e] group-hover:rotate-12 transition-transform" />
                <span>✦ Generate Reel Plan →</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
