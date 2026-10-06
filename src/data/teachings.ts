export interface TeachingRecord {
  id: string;

  theme:
    | "Self-belief"
    | "Fearlessness"
    | "Concentration"
    | "Education"
    | "Service"
    | "Discipline"
    | "Character"
    | "Leadership"
    | "Youth"
    | "Strength"
    | "Self-realization"
    | "Religion"
    | "Spirituality";

  title: string;
  teaching: string;
  context: string;

  sourceName: string;
  volume: string;
  chapter: string;
  sourceUrl: string;
  sourceStatus: "verified" | "unverified";

  tags: string[];
  matchedFeelings: string[];

  languageVersions: {
    en: string;
    hi: string;
    bn?: string;
  };

  presetReel?: {
    hook: {
      campus: string;
      career: string;
      everyday: string;
    };

    story: {
      campus: string;
      career: string;
      everyday: string;
    };

    interpretation: string;
    takeaway: string;

    action: {
      title: string;
      instruction: string;
      difficulty: "Easy" | "Moderate" | "Challenging";
      timeRequired: string;
      deadline: string;
      reflectionPrompt: string;
    };
  };
}


// ========================================================
// REEL METADATA
// ========================================================

const REEL_META: Record<
  string,
  {
    interpretation: string;
    takeaway: string;
    actionTitle: string;
    actionInstruction: string;
    difficulty: "Easy" | "Moderate" | "Challenging";
    timeRequired: string;
    deadline: string;
    reflectionPrompt: string;
  }
> = {
  SELF_REALIZATION: {
    interpretation:
      "Vivekananda repeatedly pointed toward the divinity and power already present within every human being. The task is to awaken it rather than search for it outside.",
    takeaway:
      "You are not empty or powerless. The journey is about discovering and expressing what already exists within you.",
    actionTitle: "Look Within",
    actionInstruction:
      "Spend 10 quiet minutes writing down three strengths or abilities you already possess but often overlook.",
    difficulty: "Easy",
    timeRequired: "10 minutes",
    deadline: "Tonight",
    reflectionPrompt:
      "What did you discover about yourself that you usually underestimate?",
  },

  STRENGTH: {
    interpretation:
      "For Vivekananda, strength meant courage, self-confidence, resilience and the ability to stand firmly in life.",
    takeaway:
      "Do not begin by convincing yourself that you are weak. Start from the strength that already exists within you.",
    actionTitle: "Stand in Your Strength",
    actionInstruction:
      "Choose one difficult task you have been avoiding and take the first concrete step toward completing it today.",
    difficulty: "Moderate",
    timeRequired: "15 minutes",
    deadline: "Today",
    reflectionPrompt:
      "Did taking action change how you felt about your own capability?",
  },

  EDUCATION: {
    interpretation:
      "Vivekananda viewed education as the awakening and development of the potential already present within a person.",
    takeaway:
      "Learning is not merely collecting information. It is developing the power to understand, think and act.",
    actionTitle: "Learn Through Understanding",
    actionInstruction:
      "Take one topic you are studying and explain its core idea in simple language without looking at your notes.",
    difficulty: "Moderate",
    timeRequired: "15 minutes",
    deadline: "Tomorrow",
    reflectionPrompt:
      "Could you explain the idea clearly, or were you relying mainly on memorization?",
  },

  RELIGION: {
    interpretation:
      "Vivekananda approached religion as a lived experience of truth and inner realization rather than merely intellectual discussion.",
    takeaway:
      "True spirituality begins when ideas become personal experience and transformation.",
    actionTitle: "Practice Before Debate",
    actionInstruction:
      "Spend 10 minutes quietly practicing one value you believe in instead of merely thinking or talking about it.",
    difficulty: "Easy",
    timeRequired: "10 minutes",
    deadline: "Today",
    reflectionPrompt:
      "How did practicing the value feel different from simply thinking about it?",
  },

  SERVICE: {
    interpretation:
      "Vivekananda connected spiritual growth with selfless service, compassion and the willingness to help others.",
    takeaway:
      "Purpose expands when your attention moves beyond yourself.",
    actionTitle: "Serve Without Recognition",
    actionInstruction:
      "Help one person today without expecting praise, credit or anything in return.",
    difficulty: "Easy",
    timeRequired: "10 minutes",
    deadline: "Today",
    reflectionPrompt:
      "How did helping someone without seeking recognition affect your state of mind?",
  },

  SPIRITUALITY: {
    interpretation:
      "Vivekananda emphasized inner transformation through concentration, meditation, self-discipline and realization.",
    takeaway:
      "Spiritual growth is something to experience and practice, not merely something to read about.",
    actionTitle: "Create Inner Silence",
    actionInstruction:
      "Sit quietly for 10 minutes, observe your thoughts without reacting to them, and return your attention to your breath.",
    difficulty: "Easy",
    timeRequired: "10 minutes",
    deadline: "Tonight",
    reflectionPrompt:
      "What did you notice when you stopped reacting to every thought?",
  },
};


function createPresetReel(
  theme: string,
  quote: string
): TeachingRecord["presetReel"] {
  const meta = REEL_META[theme];

  return {
    hook: {
      campus:
        "You are capable of more than the version of yourself you currently believe in.",
      career:
        "What if the ability you are searching for is already within you?",
      everyday:
        "Sometimes the biggest limitation is the story you keep telling yourself.",
    },

    story: {
      campus:
        "A student begins doubting their abilities after comparing themselves with classmates, slowly forgetting how much potential they already possess.",
      career:
        "A young professional hesitates to take a bigger opportunity because they keep measuring themselves against people who seem more experienced.",
      everyday:
        "Someone spends years searching outside themselves for confidence, purpose and peace without realizing the inner work has to begin first.",
    },

    interpretation:
      `${meta.interpretation} The teaching reminds us: "${quote}"`,

    takeaway: meta.takeaway,

    action: {
      title: meta.actionTitle,
      instruction: meta.actionInstruction,
      difficulty: meta.difficulty,
      timeRequired: meta.timeRequired,
      deadline: meta.deadline,
      reflectionPrompt: meta.reflectionPrompt,
    },
  };
}


// ========================================================
// VERIFIED TEACHINGS
// ========================================================

export const VERIFIED_TEACHINGS: TeachingRecord[] = [

  // -------------------- q01 --------------------

  {
    id: "q01",
    theme: "Self-realization",
    title: "Each Soul Is Potentially Divine",
    teaching: "Each soul is potentially divine.",
    context:
      "Raja-Yoga Preface — the inherent divinity and potential within every human being.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Raja-Yoga — Preface",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/preface.htm",
    sourceStatus: "verified",
    tags: ["self-realization", "divinity", "inner-potential"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I FEEL STUCK",
      "I NEED COURAGE",
    ],
    languageVersions: {
      en: "Each soul is potentially divine.",
      hi: "प्रत्येक आत्मा संभावित रूप से दिव्य है।",
    },
    presetReel: createPresetReel(
      "SELF_REALIZATION",
      "Each soul is potentially divine."
    ),
  },


  // -------------------- q02 --------------------

  {
    id: "q02",
    theme: "Self-realization",
    title: "Manifest the Divinity Within",
    teaching:
      "The goal is to manifest this Divinity within by controlling nature, external and internal.",
    context:
      "Raja-Yoga Preface — manifesting the divinity already present within.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Raja-Yoga — Preface",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/preface.htm",
    sourceStatus: "verified",
    tags: ["self-realization", "divinity", "self-control"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I WANT DISCIPLINE",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "The goal is to manifest this Divinity within by controlling nature, external and internal.",
      hi: "लक्ष्य है बाहरी और आंतरिक प्रकृति पर नियंत्रण करके अपने भीतर की दिव्यता को प्रकट करना।",
    },
    presetReel: createPresetReel(
      "SELF_REALIZATION",
      "The goal is to manifest this Divinity within by controlling nature, external and internal."
    ),
  },


  // -------------------- q03 --------------------

  {
    id: "q03",
    theme: "Strength",
    title: "All the Powers Are Already Ours",
    teaching: "All the powers in the universe are already ours.",
    context:
      "Practical Vedanta Part I — the immense power already present within human beings.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 2",
    chapter: "Practical Vedanta — Part I",
    sourceUrl:
      "https://mail.ramakrishnavivekananda.info/vivekananda/volume_2/practical_vedanta_and_other_lectures/practical_vedanta_part_i.htm",
    sourceStatus: "verified",
    tags: ["strength", "self-belief", "inner-power"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I NEED COURAGE",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "All the powers in the universe are already ours.",
      hi: "ब्रह्मांड की सभी शक्तियाँ पहले से ही हमारे भीतर हैं।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "All the powers in the universe are already ours."
    ),
  },


  // -------------------- q04 --------------------

  {
    id: "q04",
    theme: "Strength",
    title: "Strength Is Life",
    teaching: "Strength is life, weakness is death.",
    context:
      "Work and its Secret — strength as a foundation for life.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 2",
    chapter: "Work and its Secret",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_2/work_and_its_secret.htm",
    sourceStatus: "verified",
    tags: ["strength", "courage", "resilience"],
    matchedFeelings: [
      "I FAILED",
      "I NEED COURAGE",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "Strength is life, weakness is death.",
      hi: "शक्ति जीवन है, दुर्बलता मृत्यु है।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "Strength is life, weakness is death."
    ),
  },


  // -------------------- q05 --------------------

  {
    id: "q05",
    theme: "Education",
    title: "Education Is Manifestation",
    teaching:
      "Education is the manifestation of the perfection already in man.",
    context:
      "What We Believe In — education as the manifestation of existing potential.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "What We Believe In",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/what_we_believe_in.htm",
    sourceStatus: "verified",
    tags: ["education", "learning", "potential"],
    matchedFeelings: [
      "I CAN'T FOCUS",
      "I WANT DISCIPLINE",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "Education is the manifestation of the perfection already in man.",
      hi: "शिक्षा मनुष्य में पहले से विद्यमान पूर्णता की अभिव्यक्ति है।",
    },
    presetReel: createPresetReel(
      "EDUCATION",
      "Education is the manifestation of the perfection already in man."
    ),
  },


  // -------------------- q06 --------------------

  {
    id: "q06",
    theme: "Religion",
    title: "Religion Is Divine Manifestation",
    teaching:
      "Religion is the manifestation of the Divinity already in man.",
    context:
      "What We Believe In — religion as the manifestation of inner divinity.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "What We Believe In",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/what_we_believe_in.htm",
    sourceStatus: "verified",
    tags: ["religion", "divinity", "spirituality"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I DOUBT MYSELF",
      "I WANT TO HELP OTHERS",
    ],
    languageVersions: {
      en: "Religion is the manifestation of the Divinity already in man.",
      hi: "धर्म मनुष्य में पहले से विद्यमान दिव्यता की अभिव्यक्ति है।",
    },
    presetReel: createPresetReel(
      "RELIGION",
      "Religion is the manifestation of the Divinity already in man."
    ),
  },


  // -------------------- q07 --------------------

  {
    id: "q07",
    theme: "Service",
    title: "Live for Others",
    teaching:
      "They alone live who live for others, the rest are more dead than alive.",
    context:
      "Our Duty to the Masses — meaningful living through service to others.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "Our Duty to the Masses",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/our_duty_to_the_masses.htm",
    sourceStatus: "verified",
    tags: ["service", "selflessness", "compassion"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "They alone live who live for others, the rest are more dead than alive.",
      hi: "वही वास्तव में जीवित हैं जो दूसरों के लिए जीते हैं; बाकी जीवित होने से अधिक मृत हैं।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "They alone live who live for others, the rest are more dead than alive."
    ),
  },


  // -------------------- q08 --------------------

  {
    id: "q08",
    theme: "Self-realization",
    title: "Take Care of What You Think",
    teaching:
      "We are what our thoughts have made us; so take care of what you think.",
    context:
      "Inspired Talks — thoughts shaping character and identity.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 7",
    chapter: "Inspired Talks — Wednesday, June 26, 1895",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_7/inspired_talks/05_wednesday_june_26.htm",
    sourceStatus: "verified",
    tags: ["thoughts", "mind", "self-realization"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I FEEL STUCK",
      "I CAN'T FOCUS",
    ],
    languageVersions: {
      en: "We are what our thoughts have made us; so take care of what you think.",
      hi: "हमारे विचार ही हमें बनाते हैं; इसलिए अपने विचारों का ध्यान रखें।",
    },
    presetReel: createPresetReel(
      "SELF_REALIZATION",
      "We are what our thoughts have made us; so take care of what you think."
    ),
  },


  // -------------------- q09 --------------------

  {
    id: "q09",
    theme: "Religion",
    title: "Be True to Your Own Nature",
    teaching:
      "The greatest religion is to be true to your own nature.",
    context:
      "Mohammed — authenticity and remaining true to one's nature.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Lectures and Discourses — Mohammed",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_1/lectures_and_discourses/mohammed.htm",
    sourceStatus: "verified",
    tags: ["authenticity", "truth", "religion"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I FEEL STUCK",
      "I NEED COURAGE",
    ],
    languageVersions: {
      en: "The greatest religion is to be true to your own nature.",
      hi: "सबसे बड़ा धर्म अपने स्वभाव के प्रति सच्चा होना है।",
    },
    presetReel: createPresetReel(
      "RELIGION",
      "The greatest religion is to be true to your own nature."
    ),
  },


  // -------------------- q10 --------------------

  {
    id: "q10",
    theme: "Religion",
    title: "Truth Has Many Expressions",
    teaching:
      "Truth can be stated in a thousand different ways, yet each one can be true.",
    context:
      "Sayings and Utterances — different expressions and perspectives of truth.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 5",
    chapter: "Sayings and Utterances",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_5/sayings_and_utterances.htm",
    sourceStatus: "verified",
    tags: ["truth", "religion", "understanding"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "Truth can be stated in a thousand different ways, yet each one can be true.",
      hi: "सत्य को हजारों अलग-अलग तरीकों से कहा जा सकता है, फिर भी प्रत्येक सत्य हो सकता है।",
    },
    presetReel: createPresetReel(
      "RELIGION",
      "Truth can be stated in a thousand different ways, yet each one can be true."
    ),
  },


  // -------------------- q11 --------------------

  {
    id: "q11",
    theme: "Self-realization",
    title: "Grow From Inside Out",
    teaching:
      "You have to grow from inside out. None can teach you, none can make you spiritual. There is no other teacher but your own soul.",
    context:
      "Sayings and Utterances — inner growth and the role of one's own soul.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 5",
    chapter: "Sayings and Utterances",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_5/sayings_and_utterances.htm",
    sourceStatus: "verified",
    tags: ["inner-growth", "self-realization", "spirituality"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I DOUBT MYSELF",
      "I WANT DISCIPLINE",
    ],
    languageVersions: {
      en: "You have to grow from inside out. There is no other teacher but your own soul.",
      hi: "आपको भीतर से बाहर की ओर विकसित होना है। आपकी अपनी आत्मा के अतिरिक्त कोई दूसरा शिक्षक नहीं है।",
    },
    presetReel: createPresetReel(
      "SELF_REALIZATION",
      "You have to grow from inside out."
    ),
  },


  // -------------------- q12 --------------------

  {
    id: "q12",
    theme: "Education",
    title: "The World Will Reveal Its Secrets",
    teaching:
      "The world is ready to give up its secrets if we only know how to knock, how to give it the necessary blow.",
    context:
      "Raja-Yoga Introductory — persistent inquiry and effort in gaining knowledge.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Raja-Yoga — Introductory",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_1/raja-yoga/introductory.htm",
    sourceStatus: "verified",
    tags: ["education", "knowledge", "curiosity", "persistence"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I CAN'T FOCUS",
      "I WANT DISCIPLINE",
    ],
    languageVersions: {
      en: "The world is ready to give up its secrets if we know how to knock.",
      hi: "यदि हम सही ढंग से प्रयास करना जानें, तो संसार अपने रहस्य हमारे सामने खोलने के लिए तैयार है।",
    },
    presetReel: createPresetReel(
      "EDUCATION",
      "The world is ready to give up its secrets if we know how to knock."
    ),
  },


  // -------------------- q13 --------------------

  {
    id: "q13",
    theme: "Service",
    title: "Condemn None",
    teaching:
      "Condemn none; if you can stretch out a helping hand, do so. If you cannot, fold your hands, bless your brothers, and let them go their own way.",
    context:
      "Practical Vedanta Part I — compassion, helping others and avoiding unnecessary judgment.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 2",
    chapter: "Practical Vedanta — Part I",
    sourceUrl:
      "https://mail.ramakrishnavivekananda.info/vivekananda/volume_2/practical_vedanta_and_other_lectures/practical_vedanta_part_i.htm",
    sourceStatus: "verified",
    tags: ["service", "compassion", "non-judgment", "kindness"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "Condemn none; if you can stretch out a helping hand, do so.",
      hi: "किसी की निंदा मत करो; यदि मदद का हाथ बढ़ा सकते हो तो बढ़ाओ।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "Condemn none; if you can stretch out a helping hand, do so."
    ),
  },


  // -------------------- q14 --------------------

  {
    id: "q14",
    theme: "Strength",
    title: "Have Faith in Yourself",
    teaching:
      "Have faith in yourselves, and stand up on that faith and be strong; that is what we need.",
    context:
      "The Mission of the Vedanta — self-confidence, strength and faith in oneself.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 3",
    chapter: "Lectures from Colombo to Almora — The Mission of the Vedanta",
    sourceUrl:
      "https://ramakrishnavivekananda.info/vivekananda/volume_3/lectures_from_colombo_to_almora/the_mission_of_the_vedanta.htm",
    sourceStatus: "verified",
    tags: ["self-belief", "strength", "confidence", "courage"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I NEED COURAGE",
      "I FAILED",
    ],
    languageVersions: {
      en: "Have faith in yourselves, and stand up on that faith and be strong; that is what we need.",
      hi: "अपने ऊपर विश्वास रखो, उस विश्वास के आधार पर खड़े हो और मजबूत बनो; हमें यही चाहिए।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "Have faith in yourselves, and stand up on that faith and be strong."
    ),
  },


  // -------------------- q15 --------------------

  {
    id: "q15",
    theme: "Service",
    title: "Feel for the Downtrodden",
    teaching:
      "Feel, my children, feel; feel for the poor, the ignorant, the downtrodden; feel till the heart stops and the brain reels and you think you will go mad — then pour the soul out at the feet of the Lord, and then will come power, help, and indomitable energy.",
    context:
      "To My Brave Boys — deep empathy and compassionate action toward those who suffer.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "To My Brave Boys",
    sourceUrl:
      "https://www.ramakrishnavivekananda.info/vivekananda/volume_4/writings_prose/to_my_brave_boys.htm",
    sourceStatus: "verified",
    tags: ["service", "compassion", "empathy", "social-service"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I NEED COURAGE",
    ],
    languageVersions: {
      en: "Feel for the poor, the ignorant, the downtrodden; then will come power, help, and indomitable energy.",
      hi: "गरीबों, अज्ञानियों और पीड़ितों के लिए हृदय से महसूस करो; तब शक्ति, सहायता और अटूट ऊर्जा आएगी।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "Feel for the poor, the ignorant, the downtrodden."
    ),
  },


  // -------------------- q17 --------------------

  {
    id: "q17",
    theme: "Self-realization",
    title: "Realisation Is Real Religion",
    teaching:
      "Realisation is real religion, all the rest is only preparation—hearing lectures, or reading books, or reasoning is merely preparing the ground; it is not religion.",
    context:
      "Patanjali's Yoga Aphorisms — direct realization versus intellectual preparation.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter:
      "Raja Yoga, Patanjali's Yoga Aphorisms, Chapter 1, Concentration: Its Spiritual Uses",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-101-11957/",
    sourceStatus: "verified",
    tags: ["realization", "religion", "experience", "spirituality"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I WANT DISCIPLINE",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "Realisation is real religion; reading and reasoning are preparation.",
      hi: "साक्षात्कार ही वास्तविक धर्म है; पढ़ना और तर्क करना केवल तैयारी है।",
    },
    presetReel: createPresetReel(
      "SELF_REALIZATION",
      "Realisation is real religion."
    ),
  },


  // -------------------- q18 --------------------

  {
    id: "q18",
    theme: "Service",
    title: "Do Good for Its Own Sake",
    teaching:
      "Give up all fruits of work; do good for its own sake;",
    context:
      "Karma Yoga — Freedom — selfless action without attachment to its fruits.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Karma Yoga — Freedom",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-42-6682/",
    sourceStatus: "verified",
    tags: ["service", "selflessness", "karma-yoga", "detachment"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I FEEL STUCK",
      "I WANT DISCIPLINE",
    ],
    languageVersions: {
      en: "Give up all fruits of work; do good for its own sake.",
      hi: "कर्म के सभी फल का त्याग करो; केवल भलाई के लिए भलाई करो।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "Give up all fruits of work; do good for its own sake."
    ),
  },


  // -------------------- q19 --------------------

  {
    id: "q19",
    theme: "Service",
    title: "Love, Truth and Unselfishness",
    teaching:
      "Love, truth, and unselfishness are not merely moral figures of speech, but they form our highest ideal, because in them lies such a manifestation of power.",
    context:
      "Karma Yoga — Karma in its effect on Character — love, truth and selflessness as ideals.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter: "Karma Yoga — Karma in its effect on Character",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-53-7324/",
    sourceStatus: "verified",
    tags: ["love", "truth", "selflessness", "character"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I NEED COURAGE",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "Love, truth, and unselfishness form our highest ideal.",
      hi: "प्रेम, सत्य और निःस्वार्थता हमारे सर्वोच्च आदर्श हैं।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "Love, truth, and unselfishness form our highest ideal."
    ),
  },


  // -------------------- q20 --------------------

  {
    id: "q20",
    theme: "Spirituality",
    title: "Live for an Ideal",
    teaching:
      "Live for an ideal, and leave no place in the mind for anything else.",
    context:
      "Hints on Practical Spirituality — focused dedication toward an ideal.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 2",
    chapter: "Hints on Practical Spirituality",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-63-8379/",
    sourceStatus: "verified",
    tags: ["ideal", "discipline", "focus", "spirituality"],
    matchedFeelings: [
      "I WANT DISCIPLINE",
      "I CAN'T FOCUS",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "Live for an ideal, and leave no place in the mind for anything else.",
      hi: "एक आदर्श के लिए जियो और मन में किसी अन्य चीज़ के लिए स्थान मत छोड़ो।",
    },
    presetReel: createPresetReel(
      "SPIRITUALITY",
      "Live for an ideal, and leave no place in the mind for anything else."
    ),
  },


  // -------------------- q22 --------------------

  {
    id: "q22",
    theme: "Strength",
    title: "All Power Is Within You",
    teaching:
      "All power is within you; you can do anything and everything. Believe in that, do not believe that you are weak; … All power is there. Stand up and express the divinity within you.",
    context:
      "The Work Before Us — rejecting weakness and expressing one's inherent power.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 3",
    chapter: "Lectures from Colombo to Almora — The Work Before Us",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-52-7304/",
    sourceStatus: "verified",
    tags: ["strength", "self-belief", "divinity", "courage"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I NEED COURAGE",
      "I FAILED",
    ],
    languageVersions: {
      en: "All power is within you; you can do anything and everything.",
      hi: "सारी शक्ति आपके भीतर है; आप कुछ भी कर सकते हैं।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "All power is within you; you can do anything and everything."
    ),
  },


  // -------------------- q23 --------------------

  {
    id: "q23",
    theme: "Education",
    title: "Learn Without Becoming Others",
    teaching:
      "Learn everything that is good from others, but bring it in, and in your own way absorb it; do not become others.",
    context:
      "The Common Bases of Hinduism — learning from others while preserving individuality.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 3",
    chapter: "Lectures from Colombo to Almora — The Common Bases Of Hinduism",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-109-12528/",
    sourceStatus: "verified",
    tags: ["education", "individuality", "learning", "growth"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I FEEL STUCK",
      "I WANT DISCIPLINE",
    ],
    languageVersions: {
      en: "Learn everything that is good from others, but absorb it in your own way; do not become others.",
      hi: "दूसरों से जो अच्छा है उसे सीखो, लेकिन उसे अपने तरीके से आत्मसात करो; दूसरों जैसे मत बनो।",
    },
    presetReel: createPresetReel(
      "EDUCATION",
      "Learn everything that is good from others, but do not become others."
    ),
  },


  // -------------------- q24 --------------------

  {
    id: "q24",
    theme: "Education",
    title: "The True Teacher",
    teaching:
      "The only true teacher is he who can immediately come down to the level of the student, and transfer his soul to the student’s soul and see through the student’s eyes and hear through his ears and understand through his mind. Such a teacher can really teach and none else.",
    context:
      "My Master, Part 1 — teaching through empathy and understanding the learner.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "My Master, Part 1",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-113-12698/",
    sourceStatus: "verified",
    tags: ["education", "teacher", "empathy", "learning"],
    matchedFeelings: [
      "I FEEL STUCK",
      "I CAN'T FOCUS",
      "I WANT TO HELP OTHERS",
    ],
    languageVersions: {
      en: "The only true teacher is he who can understand the student through the student's own perspective.",
      hi: "सच्चा शिक्षक वही है जो विद्यार्थी के दृष्टिकोण से उसे समझ सके।",
    },
    presetReel: createPresetReel(
      "EDUCATION",
      "The only true teacher is he who can understand the student."
    ),
  },


  // -------------------- q25 --------------------

  {
    id: "q25",
    theme: "Service",
    title: "Lend a Hand to Every Worker of Good",
    teaching:
      "Be ready to lend a hand to every worker of good. Send a good thought for every being in the three worlds.",
    context:
      "Reply to Madras Address — supporting good work and cultivating goodwill.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 4",
    chapter: "Writing: Prose — Reply to Madras Address",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-96-10413/",
    sourceStatus: "verified",
    tags: ["service", "kindness", "support", "compassion"],
    matchedFeelings: [
      "I WANT TO HELP OTHERS",
      "I NEED COURAGE",
    ],
    languageVersions: {
      en: "Be ready to lend a hand to every worker of good.",
      hi: "हर अच्छे कार्यकर्ता की सहायता के लिए सदैव तैयार रहो।",
    },
    presetReel: createPresetReel(
      "SERVICE",
      "Be ready to lend a hand to every worker of good."
    ),
  },


  // -------------------- q26 --------------------

  {
    id: "q26",
    theme: "Strength",
    title: "Iron Nerves and an Intelligent Brain",
    teaching:
      "The brain and muscles must develop simultaneously. Iron nerves with an intelligent brain — and the whole world is at your feet.",
    context:
      "From the Diary of a Disciple — simultaneous development of physical and intellectual strength.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 6",
    chapter: "From the Diary of a Disciple, II",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-60-8156/",
    sourceStatus: "verified",
    tags: ["strength", "physical-development", "intelligence", "discipline"],
    matchedFeelings: [
      "I WANT DISCIPLINE",
      "I NEED COURAGE",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "The brain and muscles must develop simultaneously. Iron nerves with an intelligent brain.",
      hi: "मस्तिष्क और मांसपेशियों का विकास साथ-साथ होना चाहिए। बुद्धिमान मस्तिष्क के साथ फौलादी नसें।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "The brain and muscles must develop simultaneously."
    ),
  },


  // -------------------- q27 --------------------

  {
    id: "q27",
    theme: "Strength",
    title: "Never Lose Faith in Yourself",
    teaching:
      "You have in you all and a thousand times more than is in all the books. Never lose faith in yourself, you can do anything in this universe. Never weaken, all power is yours.",
    context:
      "Inspired Talks — confidence in one's immense inner potential.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 7",
    chapter: "Inspired Talks — 40. Thursday, August 1",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-110-12620/",
    sourceStatus: "verified",
    tags: ["strength", "self-belief", "potential", "confidence"],
    matchedFeelings: [
      "I DOUBT MYSELF",
      "I FAILED",
      "I NEED COURAGE",
    ],
    languageVersions: {
      en: "Never lose faith in yourself. You can do anything. Never weaken; all power is yours.",
      hi: "अपने ऊपर विश्वास कभी मत खोओ। तुम कुछ भी कर सकते हो। कभी कमजोर मत पड़ो; सारी शक्ति तुम्हारी है।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "Never lose faith in yourself; all power is yours."
    ),
  },


  // -------------------- q28 --------------------

  {
    id: "q28",
    theme: "Spirituality",
    title: "The Lion Within",
    teaching:
      "Within there is the lion—the eternally pure, illumined, and ever free Ātman; and directly one realises Him through meditation and concentration, this world of Māyā vanishes.",
    context:
      "Conversations and Dialogues — the pure and free Atman realized through meditation and concentration.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 7",
    chapter:
      "Conversations And Dialogues — XXVI, Shri Sharat Chandra Chakravarty",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-20-12424/",
    sourceStatus: "verified",
    tags: ["spirituality", "meditation", "concentration", "Atman"],
    matchedFeelings: [
      "I CAN'T FOCUS",
      "I FEEL STUCK",
      "I WANT DISCIPLINE",
    ],
    languageVersions: {
      en: "Within there is the lion—the eternally pure, illumined, and ever free Ātman.",
      hi: "हमारे भीतर वह सिंह है—शाश्वत रूप से शुद्ध, प्रकाशित और स्वतंत्र आत्मा।",
    },
    presetReel: createPresetReel(
      "SPIRITUALITY",
      "Within there is the lion—the eternally pure, illumined, and ever free Ātman."
    ),
  },


  // -------------------- q29 --------------------

  {
    id: "q29",
    theme: "Strength",
    title: "The Brave Alone Do Great Things",
    teaching:
      "The brave alone do great things, not the cowards. Be brave, be brave! Man dies but once. My disciples must not be cowards.",
    context:
      "Epistles XLIII — courage as necessary for meaningful and great action.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 5",
    chapter: "Epistles — XLIII",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-116-13973/",
    sourceStatus: "verified",
    tags: ["strength", "bravery", "courage", "fearlessness"],
    matchedFeelings: [
      "I NEED COURAGE",
      "I FAILED",
      "I DOUBT MYSELF",
    ],
    languageVersions: {
      en: "The brave alone do great things, not the cowards. Be brave.",
      hi: "महान कार्य केवल बहादुर ही करते हैं, कायर नहीं। बहादुर बनो।",
    },
    presetReel: createPresetReel(
      "STRENGTH",
      "The brave alone do great things, not the cowards."
    ),
  },


  // -------------------- q30 --------------------

  {
    id: "q30",
    theme: "Spirituality",
    title: "Yoga and Knowledge",
    teaching:
      "The fire of Yoga burns the cage of sin that is around a man. Mind becomes purified and Nirvâna is directly obtained. From Yoga comes knowledge; knowledge again helps the Yogi. He who combines in himself both Yoga and knowledge, with him the Lord is pleased.",
    context:
      "Raja Yoga in brief — Yoga and knowledge as complementary paths toward purification and realization.",
    sourceName: "The Complete Works of Swami Vivekananda",
    volume: "Vol. 1",
    chapter:
      "Raja Yoga in brief, freely translated from the Kurma-Purâna",
    sourceUrl:
      "https://media.belurmath.org/inspiration-swami-vivekananda-61-8331/",
    sourceStatus: "verified",
    tags: ["spirituality", "yoga", "knowledge", "meditation"],
    matchedFeelings: [
      "I WANT DISCIPLINE",
      "I CAN'T FOCUS",
      "I FEEL STUCK",
    ],
    languageVersions: {
      en: "From Yoga comes knowledge; knowledge again helps the Yogi.",
      hi: "योग से ज्ञान प्राप्त होता है और ज्ञान फिर योगी की सहायता करता है।",
    },
    presetReel: createPresetReel(
      "SPIRITUALITY",
      "From Yoga comes knowledge; knowledge again helps the Yogi."
    ),
  },
];

export const TEACHING_ID_ALIASES: Record<string, string> = {
  q16: "q01",
  q21: "q14",
};


// ========================================================
// FEELING TILES
// ========================================================

export const FEELING_TILES = [
  {
    id: "courage",
    label: "I NEED COURAGE",
    query: "I NEED COURAGE",
    icon: "ShieldAlert",
    theme: "Fearlessness",
    desc: "Confront intimidating situations boldly",
  },

  {
    id: "stuck",
    label: "I FEEL STUCK",
    query: "I FEEL STUCK",
    icon: "RefreshCw",
    theme: "Self-belief",
    desc: "Break out of paralysis and confusion",
  },

  {
    id: "focus",
    label: "I CAN'T FOCUS",
    query: "I CAN'T FOCUS",
    icon: "Target",
    theme: "Concentration",
    desc: "Cut through digital distraction",
  },

  {
    id: "doubt",
    label: "I DOUBT MYSELF",
    query: "I DOUBT MYSELF",
    icon: "HelpCircle",
    theme: "Self-belief",
    desc: "Restore deep self-trust and dignity",
  },

  {
    id: "failed",
    label: "I FAILED",
    query: "I FAILED",
    icon: "AlertTriangle",
    theme: "Strength",
    desc: "Transform defeat into stepping stones",
  },

  {
    id: "discipline",
    label: "I WANT DISCIPLINE",
    query: "I WANT DISCIPLINE",
    icon: "Compass",
    theme: "Discipline",
    desc: "Build habits that withstand resistance",
  },

  {
    id: "help",
    label: "I WANT TO HELP OTHERS",
    query: "I WANT TO HELP OTHERS",
    icon: "Heart",
    theme: "Service",
    desc: "Find purpose beyond self-absorption",
  },
];