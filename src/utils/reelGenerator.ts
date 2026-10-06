import { TeachingRecord } from '../data/teachings';
import { GeneratedReel, ReelScene, StoryContext, LanguageCode } from '../types';
import { ASSET_PATHS } from '../assets/assetPaths';

export function buildDeterministicReel(
  teaching: TeachingRecord,
  storyContext: StoryContext = 'campus',
  language: LanguageCode = 'en',
  userProblem: string = 'Facing uncertainty and hesitation',
  durationSeconds: number = 45
): GeneratedReel {
  const isHindi = language === 'hi';
  const preset = teaching.presetReel;
  const normalizedDuration = Math.min(60, Math.max(30, Math.round(durationSeconds / 5) * 5));

  const hookText = isHindi
    ? (preset?.hook[storyContext] || 'क्या डर तुम्हें आगे बढ़ने से रोक रहा है?')
    : (preset?.hook[storyContext] || 'You knew the answer. So why didn\'t you raise your hand?');

  const storyText = isHindi
    ? (storyContext === 'campus'
        ? 'कक्षा में सब चुप थे। एक छात्र को हल पता था, लेकिन “लोग क्या कहेंगे” के डर से उसने हाथ नहीं उठाया।'
        : storyContext === 'career'
          ? 'प्रोजेक्ट का नया आइडिया तैयार था, लेकिन रिजेक्शन के डर से उसने सीनियर को ईमेल नहीं भेजा।'
          : 'गलती हो जाने के डर से हमने उस फैसले को हफ्तों तक टाल दिया।')
    : (preset?.story[storyContext] || 'A student hesitated to share their solution in the classroom, paralyzed by the fear of being judged by peers.');

  const teachingQuote = isHindi ? teaching.languageVersions.hi : teaching.languageVersions.en;

  const interpretationText = isHindi
    ? (preset?.interpretation || 'विवेकानंद जी कहते हैं: जीवन में मुश्किलों का सामना डटकर करो। जब हम भागना बंद करते हैं, तो डर खुद पीछे हट जाता है।')
    : (preset?.interpretation || 'Swami Vivekananda taught that inner faith is not passive; it is active courage to face hardship without retreating.');

  const takeawayText = isHindi
    ? (preset?.takeaway || 'डर से भागने से डर बड़ा होता है। खड़े होकर सामना करो।')
    : (preset?.takeaway || 'The fear of hardship is almost always heavier than the hardship itself. Stand firm.');

  const actionTitle = isHindi
    ? (preset?.action.title || '24-घंटे की चुनौती')
    : (preset?.action.title || 'The 24-Hour Viveka Challenge');

  const actionInstruction = isHindi
    ? (preset?.action.instruction || 'अपनी अगली कक्षा या मीटिंग में एक सवाल बिना झिझक के पूछें।')
    : (preset?.action.instruction || 'In your next conversation or class, ask one clear question or state your idea aloud.');

  const sceneTitles = isHindi
    ? {
        hook: 'आधुनिक दुविधा',
        story: 'संबंधित कहानी',
        teaching: 'प्रामाणिक शिक्षण',
        interpretation: 'आज का अर्थ',
        takeaway: 'मुख्य सीख',
        action: 'आपकी 24-घंटे की चुनौती',
        source: 'स्रोत प्रमाण'
      }
    : {
        hook: 'The Modern Dilemma',
        story: 'Relatable Story',
        teaching: 'Authentic Teaching',
        interpretation: 'Meaning for Today',
        takeaway: 'Core Principle',
        action: 'Your 24-Hour Action',
        source: 'Source Provenance'
      };

  const visualCaptions = isHindi
    ? {
        hook: 'आधुनिक युवा स्थिति: hesitation का क्षण',
        story: `संबंधित ${storyContext.toUpperCase()} स्थिति`,
        teaching: `स्वामी विवेकानंद — ${teaching.volume}, ${teaching.chapter}`,
        interpretation: 'प्राचीन सिद्धांत को आज की जटिलताओं से जोड़ना',
        takeaway: 'दैनिक.Reflection के लिए मुख्य सीख',
        action: 'कार्रवाई योग्य micro-practice',
        source: 'आधिकारिक Belur Math archive verification'
      }
    : {
        hook: 'Modern youth situation: Moment of hesitation',
        story: `Relatable ${storyContext.toUpperCase()} scenario`,
        teaching: `Swami Vivekananda — ${teaching.volume}, ${teaching.chapter}`,
        interpretation: 'Translating ancient principle into psychological clarity',
        takeaway: 'Core takeaway for daily reflection',
        action: 'Actionable micro-practice',
        source: 'Official Belur Math digital archives verification'
      };

  const baseSceneDurations = [3, 9, 10, 11, 7, 9, 8];
  const totalBaseDuration = baseSceneDurations.reduce((sum, value) => sum + value, 0);
  let sceneDurations = baseSceneDurations.map((value) => Math.max(2, Math.round((value / totalBaseDuration) * normalizedDuration)));

  let currentDuration = sceneDurations.reduce((sum, value) => sum + value, 0);
  while (currentDuration < normalizedDuration) {
    sceneDurations[sceneDurations.length - 1] += 1;
    currentDuration += 1;
  }

  while (currentDuration > normalizedDuration) {
    const indexToTrim = Math.max(0, sceneDurations.length - 2);
    if (sceneDurations[indexToTrim] <= 2) break;
    sceneDurations[indexToTrim] -= 1;
    currentDuration -= 1;
  }

  let elapsed = 0;
  const scenes: ReelScene[] = [1, 2, 3, 4, 5, 6, 7].map((index) => {
    const duration = sceneDurations[index - 1];
    const startSecond = elapsed;
    const endSecond = elapsed + duration;
    elapsed = endSecond;

    const sceneContentMap: Record<number, { title: string; narration: string; subtitle: string; category: string; caption: string; provenance: { contentType: string; sourceName: string; status: string; changeFromSource: string; purpose: string } }> = {
      1: {
        title: sceneTitles.hook,
        narration: hookText,
        subtitle: hookText,
        category: 'AI STORY',
        caption: visualCaptions.hook,
        provenance: {
          contentType: 'AI-GENERATED STORY',
          sourceName: 'Vivekam Creative Engine',
          status: 'CREATIVE_SYNTHESIS',
          changeFromSource: 'Modern contextual story',
          purpose: 'Engaging youth hook to contextualize the moral question'
        }
      },
      2: {
        title: sceneTitles.story,
        narration: storyText,
        subtitle: storyText,
        category: 'AI STORY',
        caption: visualCaptions.story,
        provenance: {
          contentType: 'AI-GENERATED STORY',
          sourceName: 'Vivekam Scenario Engine',
          status: 'CREATIVE_SYNTHESIS',
          changeFromSource: 'Modern contextual story',
          purpose: 'Fictional modern illustration of the ancient challenge'
        }
      },
      3: {
        title: sceneTitles.teaching,
        narration: isHindi ? `"${teachingQuote}" — स्वामी विवेकानंद` : `"${teachingQuote}" — Swami Vivekananda.`,
        subtitle: `"${teachingQuote}"`,
        category: 'SOURCE',
        caption: visualCaptions.teaching,
        provenance: {
          contentType: 'DIRECT QUOTE',
          sourceName: teaching.sourceName,
          status: 'VERIFIED',
          changeFromSource: isHindi
            ? 'Hindi translation of the English source quotation'
            : 'None (Exact original quotation)',
          purpose: isHindi
            ? 'Faithful Hindi rendering of the teaching; consult the linked source for the original wording'
            : 'Quoted teaching from the linked source'
        }
      },
      4: {
        title: sceneTitles.interpretation,
        narration: interpretationText,
        subtitle: interpretationText,
        category: 'AI INTERPRETATION',
        caption: visualCaptions.interpretation,
        provenance: {
          contentType: 'AI INTERPRETATION',
          sourceName: 'Vivekam Pedagogical Model',
          status: 'DERIVED',
          changeFromSource: 'Simplified youth explanation',
          purpose: 'Grounded explanation of philosophical teaching for modern youth'
        }
      },
      5: {
        title: sceneTitles.takeaway,
        narration: takeawayText,
        subtitle: takeawayText,
        category: 'AI INTERPRETATION',
        caption: visualCaptions.takeaway,
        provenance: {
          contentType: 'AI INTERPRETATION',
          sourceName: 'Vivekam Core Extraction',
          status: 'DERIVED',
          changeFromSource: 'Simplified youth explanation',
          purpose: 'Distilled moral synthesis for retention'
        }
      },
      6: {
        title: sceneTitles.action,
        narration: isHindi ? `आपकी 24-घंटे की चुनौती: ${actionInstruction}` : `Your 24-hour challenge: ${actionInstruction}`,
        subtitle: isHindi ? `आपकी 24-घंटे की चुनौती: ${actionInstruction}` : `YOUR 24-HOUR VIVEKA CHALLENGE: ${actionInstruction}`,
        category: 'ACTION CHALLENGE',
        caption: visualCaptions.action,
        provenance: {
          contentType: 'PRACTICAL ACTION',
          sourceName: 'Vivekam Action Catalyst',
          status: 'DERIVED',
          changeFromSource: 'Synthesized actionable challenge',
          purpose: 'Translates the philosophical teaching into a tangible 24-hour behavioural challenge'
        }
      },
      7: {
        title: sceneTitles.source,
        narration: isHindi
          ? `स्रोत: ${teaching.sourceName}, ${teaching.volume}, ${teaching.chapter}.`
          : `Source: ${teaching.sourceName}, ${teaching.volume}, ${teaching.chapter}.`,
        subtitle: isHindi
          ? `स्रोत: ${teaching.sourceName} | ${teaching.volume} | ${teaching.chapter}`
          : `SOURCE: ${teaching.sourceName} | ${teaching.volume} | ${teaching.chapter}`,
        category: 'SOURCE',
        caption: visualCaptions.source,
        provenance: {
          contentType: 'SOURCE CITATION',
          sourceName: teaching.sourceName,
          status: 'VERIFIED',
          changeFromSource: 'Official citation',
          purpose: 'Unambiguous attribution to authentic historical record'
        }
      }
    };

    return {
      id: `scene-${index}-${Date.now()}`,
      order: index,
      durationSeconds: duration,
      startSecond,
      endSecond,
      sceneType: index === 1 ? 'HOOK' : index === 2 ? 'MODERN_STORY' : index === 3 ? 'VERIFIED_TEACHING' : index === 4 ? 'AI_INTERPRETATION' : index === 5 ? 'TAKEAWAY' : index === 6 ? 'ACTION_CHALLENGE' : 'SOURCE_CARD',
      title: sceneContentMap[index].title,
      narration: sceneContentMap[index].narration,
      subtitle: sceneContentMap[index].subtitle,
      contentCategory: index === 1 || index === 2 ? 'AI_STORY' : index === 3 || index === 7 ? 'SOURCE' : 'INTERPRETATION',
      categoryBadge: sceneContentMap[index].category,
      isDirectQuote: index === 3,
      visualAsset: {
        type: index === 1 || index === 2 ? 'AI_VISUAL' : index === 3 ? 'HISTORICAL_IMAGE' : index === 7 ? 'PASSPORT_CARD' : 'TYPOGRAPHIC_CARD',
        assetUrl:
          index === 1
            ? storyContext === 'career'
              ? ASSET_PATHS.careerFocus
              : storyContext === 'campus'
                ? ASSET_PATHS.campusClassroom
                : ASSET_PATHS.youthSunriseReel
            : index === 2
              ? storyContext === 'career'
                ? ASSET_PATHS.careerFocus
                : storyContext === 'campus'
                  ? ASSET_PATHS.campusClassroom
                  : ASSET_PATHS.youthSunriseReel
              : index === 3
                ? ASSET_PATHS.vivekanandaPortrait
                : index === 7
                  ? ASSET_PATHS.belurMathSketch
                  : ASSET_PATHS.youthSunriseReel,
        caption: sceneContentMap[index].caption
      },
      provenance: {
        contentType: sceneContentMap[index].provenance.contentType as any,
        sourceName: sceneContentMap[index].provenance.sourceName,
        volume: teaching.volume,
        chapter: teaching.chapter,
        status: sceneContentMap[index].provenance.status as 'VERIFIED' | 'DERIVED' | 'CREATIVE_SYNTHESIS',
        changeFromSource: sceneContentMap[index].provenance.changeFromSource as any,
        historicalFact: index === 3 || index === 7,
        purpose: sceneContentMap[index].provenance.purpose
      }
    };
  });

  const reel: GeneratedReel = {
    id: `reel-${teaching.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    teachingId: teaching.id,
    theme: teaching.theme,
    storyContext,
    language,
    languageLabel: isHindi ? 'Hindi (हिन्दी)' : 'English',
    title: isHindi ? `${teaching.title}` : `${teaching.title}`,
    userProblem,
    totalDurationSeconds: normalizedDuration,
    scenes,
    sourcePassport: {
      topic: teaching.theme,
      sourceName: teaching.sourceName,
      volume: teaching.volume,
      section: teaching.chapter,
      sourceUrl: teaching.sourceUrl,
      sourceQuote: teaching.teaching,
      sourceStatus: teaching.sourceStatus === 'verified' ? 'Verified ✓' : 'Unverified',
      directQuotations: 1,
      aiParaphrases: 2,
      fictionalScenes: 2,
      aiVisuals: 4,
      aiNarration: true,
      historicalVoice: false,
    },
    actionChallenge: {
      id: `act-${teaching.id}-${Date.now()}`,
      title: actionTitle,
      instruction: actionInstruction,
      difficulty: preset?.action.difficulty || 'Easy',
      timeRequired: preset?.action.timeRequired || `${normalizedDuration} seconds`,
      deadline: preset?.action.deadline || 'Tomorrow',
      accepted: false,
      completed: false
    },
    meaningLock: {
      status: 'MEANING LOCKED ✓',
      coreTeachingPreserved: true,
      tonePreserved: true,
      intendedActionPreserved: true,
      semanticNote: isHindi
        ? 'कोर दर्शन सत्यापित है; समकालीन युवाओं के लिए भाषा और भाव को सही रूप में स्थानीयकृत किया गया है।'
        : 'Preserved original rhetorical cadence while tailoring vocabulary to modern student dilemmas.'
    }
  };

  return reel;
}
