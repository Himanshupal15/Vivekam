export type StoryContext = 'campus' | 'career' | 'everyday';
export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

export type SceneType = 
  | 'HOOK' 
  | 'MODERN_STORY' 
  | 'VERIFIED_TEACHING' 
  | 'AI_INTERPRETATION' 
  | 'TAKEAWAY' 
  | 'ACTION_CHALLENGE' 
  | 'SOURCE_CARD';

export type ContentCategory = 
  | 'SOURCE' 
  | 'INTERPRETATION' 
  | 'AI_STORY' 
  | 'AI_VISUAL';

export interface ReelScene {
  id: string;
  order: number;
  durationSeconds: number;
  startSecond: number;
  endSecond: number;
  sceneType: SceneType;
  title: string;
  narration: string;
  subtitle: string;
  contentCategory: ContentCategory;
  categoryBadge: string;
  isDirectQuote: boolean;
  visualAsset: {
    type: 'HISTORICAL_IMAGE' | 'AI_VISUAL' | 'TYPOGRAPHIC_CARD' | 'PASSPORT_CARD';
    assetUrl: string;
    caption: string;
  };
  provenance: {
    contentType: 'DIRECT QUOTE' | 'AI-GENERATED STORY' | 'AI INTERPRETATION' | 'AI VISUAL REPRESENTATION' | 'PRACTICAL ACTION' | 'SOURCE CITATION';
    sourceName: string;
    volume?: string;
    chapter?: string;
    status: 'VERIFIED' | 'DERIVED' | 'CREATIVE_SYNTHESIS';
    changeFromSource: 'None (Exact original quotation)' | 'Hindi translation of the English source quotation' | 'Modern contextual story' | 'Simplified youth explanation' | 'Synthesized actionable challenge' | 'Official citation';
    historicalFact: boolean;
    purpose: string;
  };
}

export interface GeneratedReel {
  id: string;
  createdAt: string;
  teachingId: string;
  theme: string;
  storyContext: StoryContext;
  language: LanguageCode;
  languageLabel: string;
  title: string;
  userProblem: string;
  totalDurationSeconds: number;
  scenes: ReelScene[];
  sourcePassport: {
    topic: string;
    sourceName: string;
    volume: string;
    section: string;
    sourceUrl: string;
    sourceQuote: string;
    sourceStatus: 'Verified ✓' | 'Unverified';
    directQuotations: number;
    aiParaphrases: number;
    fictionalScenes: number;
    aiVisuals: number;
    aiNarration: boolean;
    historicalVoice: boolean;
  };
  actionChallenge: {
    id: string;
    title: string;
    instruction: string;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    timeRequired: string;
    deadline: string;
    accepted: boolean;
    completed: boolean;
    reflection?: {
      feeling: 'Empowered' | 'Good' | 'Neutral' | 'Difficult';
      notes: string;
      completedAt: string;
    };
  };
  meaningLock: {
    status: 'MEANING LOCKED ✓';
    coreTeachingPreserved: boolean;
    tonePreserved: boolean;
    intendedActionPreserved: boolean;
    semanticNote: string;
  };
}
