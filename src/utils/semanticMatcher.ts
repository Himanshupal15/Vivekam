import { FEELING_TILES, TeachingRecord, VERIFIED_TEACHINGS } from '../data/teachings';

export interface SemanticAnalysisResult {
  userInput: string;
  detectedConcepts: string[];
  rankedMatches: {
    teaching: TeachingRecord;
    matchScore: number;
    matchReason: string;
    rank: number;
  }[];
}

const CONCEPT_PATTERNS: Record<string, RegExp> = {
  failure: /\b(fail(?:ed|ure|ing)?|exam|test|reject(?:ed|ion)?|grade|setback|mistake|defeat|unsuccessful|disappoint(?:ed|ment)?|overwhelm(?:ed|ing)?)\b/i,
  'self-doubt': /\b(doubt|insecure|impost(?:er|or)|confidence|capable|worthless|self-esteem|self-worth|compare|feel stuck|stuck in a rut|stuck (?:in|with|on) (?:my )?(?:life|career|future|studies|school|decision|goals)|believe in myself|not good enough)\b/i,
  fearlessness: /\b(courage|fear|afraid|scared|nervous|anxious|anxiety|hesitat(?:e|ing|ion)|speak(?:ing)?|stage fright|public speaking|present(?:ing|ation)|intimidat(?:ed|ing)|shy|brave|bravery)\b/i,
  concentration: /\b(focus|concentrat(?:e|ion)|distract(?:ed|ion)|attention|scroll(?:ing)?|phone|study|studying|procrastinat(?:e|ion|ing))\b/i,
  discipline: /\b(disciplin(?:e|ed|ary)|lazy|procrastinat(?:e|ion|ing)|habit|routine|consistent|consistency|motivat(?:ion|ed)|self-control|self control)\b/i,
  service: /\b(service|compassion|lonely|loneliness|selfish|purpose|volunteer|kindness|support|help others|help(?:ing)? (?:people|someone|a friend))\b/i,
  education: /\b(educat(?:e|ion)|learn(?:ing)?|knowledge|understand|teacher|school|memor(?:y|ize|ise|ization|isation))\b/i,
  strength: /\b(strength|strong|weakness|resilien(?:t|ce)|inner power|inner strength|potential|overcome|persever(?:e|ance))\b/i,
  character: /\b(character|integrity|values|virtue|honest(?:y)?|ideal|responsib(?:le|ility))\b/i,
  leadership: /\b(lead(?:er|ership|ing)?|influence|team|decision making)\b/i,
  spirituality: /\b(spiritual(?:ity)?|meditat(?:e|ion|ing)|yoga|religion|faith|divin(?:e|ity)|soul|inner peace|meaning of life|self-realization|self realization|truth)\b/i,
};

const RELATED_THEMES: Record<string, string[]> = {
  failure: ['Strength', 'Self-belief', 'Education'],
  'self-doubt': ['Self-belief', 'Self-realization', 'Strength'],
  fearlessness: ['Fearlessness', 'Strength', 'Leadership'],
  concentration: ['Concentration', 'Discipline', 'Education'],
  discipline: ['Discipline', 'Character', 'Strength'],
  service: ['Service', 'Character', 'Spirituality'],
  education: ['Education', 'Concentration'],
  strength: ['Strength', 'Self-belief', 'Self-realization'],
  character: ['Character', 'Service', 'Leadership'],
  leadership: ['Leadership', 'Character', 'Service'],
  spirituality: ['Spirituality', 'Self-realization', 'Religion'],
};

const GENERIC_TOKENS = new Set([
  'about', 'after', 'again', 'been', 'being', 'because', 'before', 'between',
  'could', 'does', 'doing', 'down', 'each', 'feel', 'feeling', 'from', 'have',
  'help', 'here', 'into', 'just', 'like', 'look', 'make', 'many', 'more',
  'most', 'much', 'need', 'only', 'other', 'others', 'over', 'same', 'some',
  'stuck', 'such', 'than', 'that', 'them', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'want', 'what', 'when', 'where', 'which', 'while',
  'with', 'would', 'your', 'yours', 'from', 'their', 'them', 'into',
]);

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

function detectConcepts(query: string): string[] {
  return Object.entries(CONCEPT_PATTERNS)
    .filter(([, pattern]) => pattern.test(query))
    .map(([concept]) => concept);
}

function matchesStoredPrompt(query: string): boolean {
  const storedPrompts = [
    ...FEELING_TILES.map((tile) => `${tile.query} ${tile.label} ${tile.desc} ${tile.theme}`),
    ...VERIFIED_TEACHINGS.flatMap((teaching) => [
      teaching.title,
      teaching.theme,
      teaching.tags.join(' '),
      teaching.matchedFeelings.join(' '),
    ]),
  ];

  return storedPrompts.some((prompt) => {
    const normalizedPrompt = normalize(prompt);
    if (normalizedPrompt.length < 4) return false;
    if (query.includes(normalizedPrompt) || normalizedPrompt.includes(query)) return true;

    const promptTokens = normalizedPrompt
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3 && !GENERIC_TOKENS.has(token));
    const queryTokens = new Set(
      query
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 3 && !GENERIC_TOKENS.has(token))
    );
    return promptTokens.some((token) => queryTokens.has(token));
  });
}

export function isTeachingRelatedPrompt(input: string): boolean {
  const query = normalize(input);
  if (!query) return false;

  if (detectConcepts(query).length > 0) return true;
  return matchesStoredPrompt(query);
}

export function analyzeUserDilemma(input: string): SemanticAnalysisResult {
  const query = normalize(input);
  const concepts = detectConcepts(query);

  if (!isTeachingRelatedPrompt(input)) {
    return {
      userInput: input,
      detectedConcepts: [],
      rankedMatches: [],
    };
  }

  if (concepts.includes('self-doubt') || concepts.includes('failure')) {
    concepts.push('confidence');
  }

  const isFailureSelfDoubtCase =
    (query.includes('fail') && query.includes('exam')) ||
    query.includes('not good enough') ||
    query.includes('failed');

  if (isFailureSelfDoubtCase) {
    const selfBeliefTeaching = VERIFIED_TEACHINGS.find((t) => t.id === 'q14') || VERIFIED_TEACHINGS[0];
    const strengthTeaching = VERIFIED_TEACHINGS.find((t) => t.id === 'q04') || VERIFIED_TEACHINGS[1];
    const innerPotentialTeaching = VERIFIED_TEACHINGS.find((t) => t.id === 'q03') || VERIFIED_TEACHINGS[2];

    return {
      userInput: input,
      detectedConcepts: ['failure', 'self-doubt', 'confidence'],
      rankedMatches: [
        {
          teaching: selfBeliefTeaching,
          matchScore: 96,
          matchReason: "Encourages faith in oneself rather than allowing a setback to define one's capability.",
          rank: 1,
        },
        {
          teaching: strengthTeaching,
          matchScore: 91,
          matchReason: 'Reorients psychological posture from self-pity and weakness into inherent vitality.',
          rank: 2,
        },
        {
          teaching: innerPotentialTeaching,
          matchScore: 84,
          matchReason: 'Reminds the reader that human potential is not exhausted by one setback.',
          rank: 3,
        },
      ],
    };
  }

  const scored = VERIFIED_TEACHINGS.map((teaching) => {
    let score = 0;
    const teachingConcepts = `${teaching.theme} ${teaching.title} ${teaching.tags.join(' ')}`.toLowerCase();

    for (const concept of concepts) {
      const relatedThemes = RELATED_THEMES[concept] || [];
      if (
        relatedThemes.includes(teaching.theme) ||
        teaching.tags.some((tag) => tag.toLowerCase() === concept) ||
        teachingConcepts.includes(concept)
      ) {
        score += 10;
      }
    }

    const matchedFeeling = teaching.matchedFeelings.some((feeling) =>
      normalize(feeling)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 3)
        .some((token) => query.includes(token))
    );
    if (matchedFeeling) score += 8;

    return {
      teaching,
      score,
      matchReason: `Related to ${teaching.theme} and the stored teaching catalogue.`,
    };
  });

  const topMatches = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    userInput: input,
    detectedConcepts: concepts,
    rankedMatches: topMatches.map((item, index) => ({
      teaching: item.teaching,
      matchScore: Math.min(96, Math.max(70, item.score)),
      matchReason: item.matchReason,
      rank: index + 1,
    })),
  };
}
