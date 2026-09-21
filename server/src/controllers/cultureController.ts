import { Request, Response } from 'express';

export interface IRiddle {
  id: string;
  prompt: string; // e.g. "Sakwe sakwe!" -> "Soma!"
  question: string;
  acceptableAnswers: string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const RWANDAN_RIDDLES: IRiddle[] = [
  {
    id: 'sakwe_1',
    prompt: 'Sakwe sakwe!',
    question: 'Nyabukonji araturutse ntiyambaye ntiyicaye.',
    acceptableAnswers: ['uruzi', 'amazi', 'inzuzi', 'umugezi'],
    explanation: 'Uruzi rutemba bucece ijoro n\'amanywa, ntiyambara imyenda kandi ntiruhagarara.',
    difficulty: 'easy',
  },
  {
    id: 'sakwe_2',
    prompt: 'Sakwe sakwe!',
    question: 'Kaguru kamwe n\'umutwe munini.',
    acceptableAnswers: ['icyobo', 'icyobo cy\'urumamfu', 'igitoki', 'urumamfu', 'igikondo'],
    explanation: 'Icyobo (urumamfu) gifite umugina umwe n\'ingohe nini hejuru.',
    difficulty: 'medium',
  },
  {
    id: 'sakwe_3',
    prompt: 'Sakwe sakwe!',
    question: 'Kacira hejuru kakarara hasi.',
    acceptableAnswers: ['agatsinsino', 'ikirenge', 'urutsinsino', 'urukweto'],
    explanation: 'Agatsinsino iyo ugenda kagenda gasimbuka kajya hejuru kakongera kakarara ku butaka.',
    difficulty: 'easy',
  },
  {
    id: 'sakwe_4',
    prompt: 'Sakwe sakwe!',
    question: 'Nteye urubingo rutera imbere ntiruhagarara.',
    acceptableAnswers: ['ijisho', 'amaso', 'kureba'],
    explanation: 'Ijisho rireba kure cyane mu kanya gato ntiwakumira aho rigeza kureba.',
    difficulty: 'medium',
  },
  {
    id: 'sakwe_5',
    prompt: 'Sakwe sakwe!',
    question: 'Kajya mu mazi ntikatobe.',
    acceptableAnswers: ['igitutu', 'igitutu cy\'umuntu', 'igicucu'],
    explanation: 'Igitutu cyangwa igicucu iyo kigiye mu mazi ntabwo amazi agira icyo akitwara.',
    difficulty: 'easy',
  },
  {
    id: 'sakwe_6',
    prompt: 'Sakwe sakwe!',
    question: 'Hakurya mu mashyamba hari umugore urira.',
    acceptableAnswers: ['umuvuba', 'imvuba', 'umuvuba w\'umucuzi'],
    explanation: 'Umuvuba w\'umucuzi iyo bawuvugaho usohora urusaku nk\'umuntu urira cyangwa uhumeka cyane.',
    difficulty: 'hard',
  },
  {
    id: 'sakwe_7',
    prompt: 'Sakwe sakwe!',
    question: 'Inka yanjye irisha mu mashyamba ikabyagira mu bikingi.',
    acceptableAnswers: ['igisokozo', 'isokozo', 'urusokozo'],
    explanation: 'Igisokozo gicengera mu musatsi (amashyamba) hanyuma kikaruhukira ku meza cyangwa mu kantu kabigenewe.',
    difficulty: 'medium',
  },
  {
    id: 'sakwe_8',
    prompt: 'Sakwe sakwe!',
    question: 'Nyirakaruhura ntisinzira.',
    acceptableAnswers: ['uruzi', 'isumo', 'amazi atemba'],
    explanation: 'Amazi atemba ntasinzira, ahora atemba ubudatuza.',
    difficulty: 'easy',
  },
  {
    id: 'sakwe_9',
    prompt: 'Sakwe sakwe!',
    question: 'Data anyambika ubusa nkagenda.',
    acceptableAnswers: ['umwambi', 'umwambi w\'umuheto'],
    explanation: 'Umwambi bawuvanaho ibyari biwugize bakawurekura ukagenda wiruka hejuru mu kirere.',
    difficulty: 'hard',
  },
  {
    id: 'sakwe_10',
    prompt: 'Sakwe sakwe!',
    question: 'Nyuze mu kigari abagabo bambaza amano.',
    acceptableAnswers: ['inkoni', 'inkoni y\'umushumba'],
    explanation: 'Inkoni yo hasi abantu bayigendana ikagenda ikora hasi ahakandagira amano y\'abantu.',
    difficulty: 'medium',
  },
];

/**
 * Get a random riddle
 */
export const getRandomRiddle = (req: Request, res: Response): void => {
  const randomIndex = Math.floor(Math.random() * RWANDAN_RIDDLES.length);
  const riddle = RWANDAN_RIDDLES[randomIndex];

  res.json({
    success: true,
    riddle: {
      id: riddle.id,
      prompt: riddle.prompt,
      question: riddle.question,
      difficulty: riddle.difficulty,
    },
  });
};

/**
 * Check Riddle Answer
 */
export const checkRiddleAnswer = (req: Request, res: Response): void => {
  const { riddleId, answer } = req.body;

  if (!riddleId || !answer) {
    res.status(400).json({ success: false, message: 'Riddle ID n\'Igisubizo birakenewe.' });
    return;
  }

  const riddle = RWANDAN_RIDDLES.find((r) => r.id === riddleId);
  if (!riddle) {
    res.status(404).json({ success: false, message: 'Iki gisakuzo ntikibonetse.' });
    return;
  }

  const cleanUserAnswer = answer.trim().toLowerCase();
  const isCorrect = riddle.acceptableAnswers.some((ans) =>
    cleanUserAnswer.includes(ans) || ans.includes(cleanUserAnswer)
  );

  res.json({
    success: true,
    isCorrect,
    correctAnswer: riddle.acceptableAnswers[0],
    allAnswers: riddle.acceptableAnswers,
    explanation: riddle.explanation,
    message: isCorrect
      ? '🎉 Bravo! Wahamije igisakuzo! (Soma!)'
      : '❌ Ntabwo ari cyo neza. Gerageza kureba igisubizo nyacyo!',
  });
};

/**
 * Generate Traditional Rwandan Poetry or Explain Proverbs
 */
export const generatePoetryOrProverb = (req: Request, res: Response): void => {
  const { type, topic } = req.body;

  if (!topic) {
    res.status(400).json({ success: false, message: 'Ugomba kugaragaza insanganyamatsiko (topic).' });
    return;
  }

  if (type === 'proverb') {
    // Proverb explanation
    res.json({
      success: true,
      type: 'proverb',
      proverb: topic,
      meaning: `Umugani "${topic}" usobanura ubwenge n'ubushishozi bw'Abanyarwanda bo hambere. Utegura umuntu kwigengesera, gukora cyane, no gukunda umuryango mugari.`,
      culturalContext: 'Mu muco nyarwanda, imigani y\'imigenurano yabaga igamije gutoza abakiri bato indangagaciro z\'ubutwari, ubupfura, n\'ubumwe bw\'Abanyarwanda.',
      advice: 'Koresha uyu mugani mu biganiro by\'icyubahiro cyangwa mu guhanura no gutanga inama zifite ireme.',
    });
    return;
  }

  // Poetry generation
  const poemsByGenre: Record<string, { title: string; verses: string[]; meaning: string }> = {
    inka: {
      title: 'Amazina y\'Inka: Imparamba za Mutara',
      verses: [
        'Niraburiwe n\'inzobe y\'imparamba,',
        'Inyambo igarika amahembe nk\'umukororombya.',
        'Ivuza amacumu y\'amata ku museke,',
        'Ikazana umugisha mu rugo rw\'Abanyarwanda.',
        'Uruhimbi rukabyina ibyishimo n\'ishema!',
      ],
      meaning: 'Iki gisigo cy\'amazina y\'inka kigaragaza agaciro k\'inka n\'amata mu muco n\'uburanga bw\'u Rwanda rwa kera n\'ubu.',
    },
    ubutwari: {
      title: 'Umuvugo w\'Ubutwari: Intore z\'u Rwanda',
      verses: [
        'Intore zishinze umugara ku rugamba,',
        'Zirinda igihugu n\'umutuzo w\'abaturage.',
        'Icyumu cy\'ubupfura n\'ingabo y\'ubumwe,',
        'Ntizitatira igihango cy\'abakurambere.',
        'U Rwanda ruragana aheza, ruganza amahanga!',
      ],
      meaning: 'Uyu muvugo urata ubutwari, gukunda igihugu, no gushikama ku ndangagaciro z\'Ubunyarwanda.',
    },
    urukundo: {
      title: 'Umuvugo w\'Urukundo n\'Uburanga: Inyange yanjye',
      verses: [
        'Urasana n\'izuba rirashe mu birunga,',
        'Ijwi ryawe rikaba umusururu ku mutima wanjye.',
        'Nk\'inyange yera idafite inenge,',
        'Urukundo rwawe rubengerana amanywa n\'ijoro.',
        'Nzahora nkurata, nzahora ngushimagiza!',
      ],
      meaning: 'Umuvugo w\'urukundo ugaragaza uburanga bw\'umwali n\'umutima mwiza mu kinyarwanda cyizewe.',
    },
  };

  const selectedKey = (topic.toLowerCase().includes('inka')
    ? 'inka'
    : topic.toLowerCase().includes('twari') || topic.toLowerCase().includes('butwari')
    ? 'ubutwari'
    : 'urukundo');

  const poem = poemsByGenre[selectedKey] || poemsByGenre.urukundo;

  res.json({
    success: true,
    type: 'poem',
    title: poem.title,
    verses: poem.verses,
    analysis: poem.meaning,
  });
};

/**
 * Kinyarwanda Spell & Grammar Checker (Ikosora-Nteruro)
 */
export const checkGrammarAndSpelling = (req: Request, res: Response): void => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ success: false, message: 'Andika inyandiko ushaka gukosora.' });
    return;
  }

  interface GrammarIssue {
    original: string;
    suggestion: string;
    rule: string;
    explanation: string;
  }

  const issues: GrammarIssue[] = [];
  let correctedText = text;

  // Rules database for common Kinyarwanda orthography errors
  const rules = [
    {
      pattern: /\bkubwanjye\b/gi,
      replacement: 'ku bwanjye',
      rule: 'Itandukanywa ry\'ingombajwi "ku" n\'ijambo "bwanjye"',
      explanation: 'Mu mwandiko w\'Ikinyarwanda cyemewe, "ku" itandukana n\'ijambo riyikurikira (ku bwanjye, ku bwawe).',
    },
    {
      pattern: /\bnanje\b/gi,
      replacement: 'nanjye',
      rule: 'Imyandikire y\'ijambo "nanjye"',
      explanation: '"Nanjye" yandikwa na "jye" aho kuba "je".',
    },
    {
      pattern: /\bmugihe\b/gi,
      replacement: 'mu gihe',
      rule: 'Itandukanywa rya "mu" n\'izina "gihe"',
      explanation: '"Mu" ni akabanziriza-zina gatandukana n\'izina "gihe".',
    },
    {
      pattern: /\bkurijye\b/gi,
      replacement: 'kuri jye',
      rule: 'Itandukanywa rya "kuri" n\'ijambo "jye"',
      explanation: '"Kuri" yandikwa itandukanye n\'ijambo "jye".',
    },
    {
      pattern: /\bntakintu\b/gi,
      replacement: 'nta kintu',
      rule: 'Itandukanywa ry\'ihakana "nta" n\'izina "kintu"',
      explanation: 'Akajambo "nta" gatandukana n\'izina rikurikiyeho (nta kintu, nta muntu).',
    },
    {
      pattern: /\bbyoose\b/gi,
      replacement: 'byose',
      rule: 'Guca inyuguti z\'indagurura zirenze (Double Vowels)',
      explanation: 'Ijambo "byose" ryandikwa n\'inyuguti imwe gusa ya "o".',
    },
    {
      pattern: /\bumuns\b/gi,
      replacement: 'umunsi',
      rule: 'Umusozo w\'izina "umunsi"',
      explanation: 'Izina "umunsi" rikomoka ku nyuguti "si" ku musozo.',
    },
  ];

  rules.forEach((r) => {
    if (r.pattern.test(text)) {
      issues.push({
        original: r.pattern.source.replace(/\\b/g, ''),
        suggestion: r.replacement,
        rule: r.rule,
        explanation: r.explanation,
      });
      correctedText = correctedText.replace(r.pattern, r.replacement);
    }
  });

  res.json({
    success: true,
    originalText: text,
    correctedText,
    issueCount: issues.length,
    issues,
    message: issues.length === 0
      ? 'Inyandiko yawe nta makosa y\'imyandikire y\'Ikinyarwanda igaragaza! (Correct)'
      : `Hagaragaye amakosa ${issues.length} y\'imyandikire. Dore inama n\'uburyo bwo kuyakosora.`,
  });
};
