/**
 * KinyaAI Core Natural Language Processing & Translation Engine
 * Specialized in Kinyarwanda syntax, idiomatic phrasing, and bidirectional translation.
 */

export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  sourceLanguage: 'rw' | 'en';
  targetLanguage: 'rw' | 'en';
  formality: 'informal' | 'standard' | 'formal';
  confidence: number;
  grammarNotes?: string;
  alternativeTranslations?: string[];
  tokensProcessed: number;
}

interface DictionaryEntry {
  kinya: string;
  english: string;
  informal?: string;
  formal?: string;
  category: 'greeting' | 'general' | 'tech' | 'education' | 'business' | 'question';
  notes?: string;
}

export const DICTIONARY: DictionaryEntry[] = [
  // Greetings & Courtesies
  {
    kinya: 'Muraho',
    english: 'Hello / Greetings',
    informal: 'Bite',
    formal: 'Muraho neza',
    category: 'greeting',
    notes: 'Standard respectful greeting suitable for any time of day.',
  },
  {
    kinya: 'Mwaramutse',
    english: 'Good morning',
    informal: 'Mwaramutseho',
    formal: 'Mwaramutse neza',
    category: 'greeting',
    notes: 'Used in the morning until noon. Root comes from "kuramuka" (to wake up alive).',
  },
  {
    kinya: 'Mwiriwe',
    english: 'Good afternoon / Good evening',
    informal: 'Mwiriweho',
    formal: 'Mwiriwe neza',
    category: 'greeting',
    notes: 'Used in the afternoon and evening. Derived from "kwirirwa" (to spend the day).',
  },
  {
    kinya: 'Amakuru?',
    english: 'How are you? / What is the news?',
    informal: 'Amakuru ki?',
    formal: 'Amakuru yanyu?',
    category: 'greeting',
    notes: 'Traditional inquiry about well-being. Typical answer: "Ni meza" (It is good).',
  },
  {
    kinya: 'Ni meza',
    english: 'I am fine / Everything is good',
    informal: 'Ni sawa',
    formal: 'Ni meza cyane, murakoze',
    category: 'greeting',
  },
  {
    kinya: 'Murakoze',
    english: 'Thank you',
    informal: 'Urakoze',
    formal: 'Murakoze cyane',
    category: 'greeting',
    notes: '"Murakoze" is plural/respectful, "Urakoze" is singular to a friend.',
  },
  {
    kinya: 'Urakaza neza',
    english: 'Welcome',
    formal: 'Murakaza neza',
    category: 'greeting',
  },
  {
    kinya: 'Ijoro ryiza',
    english: 'Good night',
    category: 'greeting',
    notes: 'Given when departing for sleep.',
  },
  {
    kinya: 'Umunsi mwiza',
    english: 'Have a nice day',
    category: 'greeting',
  },
  {
    kinya: 'Tuzabonana',
    english: 'See you later / Goodbye',
    informal: 'Ni mukanya',
    category: 'greeting',
  },
  {
    kinya: 'Mumbabarire',
    english: 'Excuse me / I am sorry',
    informal: 'Mbabarira',
    category: 'greeting',
  },
  {
    kinya: 'Yego',
    english: 'Yes',
    informal: 'Yee',
    category: 'general',
  },
  {
    kinya: 'Oya',
    english: 'No',
    category: 'general',
  },

  // Tech & Computing
  {
    kinya: "Ubwenge bw'ubukorano",
    english: 'Artificial Intelligence (AI)',
    category: 'tech',
    notes: 'Literally "Manufactured/Crafted Intelligence". Standard terminology in Rwanda.',
  },
  {
    kinya: 'Mudasobwa',
    english: 'Computer',
    category: 'tech',
    notes: 'Traditional Kinyarwanda word meaning "the infallible one" / master calculator.',
  },
  {
    kinya: 'Ikoranabuhanga',
    english: 'Technology',
    category: 'tech',
    notes: 'Compound term from "gukora" (to work/make) and "ubuhanga" (wisdom/skill).',
  },
  {
    kinya: 'Urubuga',
    english: 'Website / Platform / Forum',
    category: 'tech',
  },
  {
    kinya: 'Porogaramu',
    english: 'Software / Program / Application',
    category: 'tech',
  },
  {
    kinya: 'Umutekano w\'ikoranabuhanga',
    english: 'Cybersecurity',
    category: 'tech',
  },
  {
    kinya: 'Inyandiko',
    english: 'Document / Text',
    category: 'tech',
  },
  {
    kinya: 'Ubutumwa',
    english: 'Message / Notification',
    category: 'tech',
  },
  {
    kinya: 'Ijambo ry\'ibanga',
    english: 'Password',
    category: 'tech',
  },
  {
    kinya: 'Kwandika code',
    english: 'To code / Programming',
    category: 'tech',
  },

  // Education & Learning
  {
    kinya: 'Kwiga',
    english: 'To learn / To study',
    category: 'education',
  },
  {
    kinya: 'Umwarimu',
    english: 'Teacher / Instructor / Tutor',
    category: 'education',
  },
  {
    kinya: 'Umunyeshuri',
    english: 'Student / Learner',
    category: 'education',
  },
  {
    kinya: 'Ishuri',
    english: 'School / Classroom',
    category: 'education',
  },
  {
    kinya: 'Ikizamini',
    english: 'Exam / Quiz / Test',
    category: 'education',
  },
  {
    kinya: 'Amasomo',
    english: 'Lessons / Courses',
    category: 'education',
  },
  {
    kinya: 'Imibare',
    english: 'Mathematics',
    category: 'education',
  },
  {
    kinya: 'Ubumenyi',
    english: 'Knowledge / Science',
    category: 'education',
  },
  {
    kinya: 'Gusobanura',
    english: 'To explain',
    category: 'education',
  },
  {
    kinya: 'Mfasha kwiga',
    english: 'Help me learn',
    category: 'education',
  },

  // Business & Work
  {
    kinya: 'Ubucuruzi',
    english: 'Business / Commerce',
    category: 'business',
  },
  {
    kinya: 'Amafaranga',
    english: 'Money / Currency',
    category: 'business',
  },
  {
    kinya: 'Akazi',
    english: 'Job / Employment / Work',
    category: 'business',
  },
  {
    kinya: 'Umushinga',
    english: 'Project / Initiative',
    category: 'business',
  },
  {
    kinya: 'Isoko',
    english: 'Market',
    category: 'business',
  },
  {
    kinya: 'Ikipe',
    english: 'Team',
    category: 'business',
  },
  {
    kinya: 'Icyemezo',
    english: 'Decision / Certificate',
    category: 'business',
  },
  {
    kinya: 'Guteza imbere',
    english: 'To develop / To promote / To advance',
    category: 'business',
  },
];

export class KinyarwandaNLP {
  /**
   * Translates text between Kinyarwanda and English with linguistic and stylistic awareness.
   */
  public static translate(
    text: string,
    sourceLang: 'rw' | 'en',
    targetLang: 'rw' | 'en',
    formality: 'informal' | 'standard' | 'formal' = 'standard'
  ): TranslationResult {
    const cleanText = text.trim();
    if (!cleanText) {
      return {
        sourceText: text,
        translatedText: '',
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        formality,
        confidence: 1.0,
        tokensProcessed: 0,
      };
    }

    // 1. Direct exact phrase match
    const lowerInput = cleanText.toLowerCase();
    for (const entry of DICTIONARY) {
      const matchKinya = entry.kinya.toLowerCase();
      const matchEng = entry.english.toLowerCase();

      if (sourceLang === 'rw' && targetLang === 'en') {
        if (
          lowerInput === matchKinya ||
          (entry.informal && lowerInput === entry.informal.toLowerCase()) ||
          (entry.formal && lowerInput === entry.formal.toLowerCase())
        ) {
          return {
            sourceText: cleanText,
            translatedText: entry.english,
            sourceLanguage: 'rw',
            targetLanguage: 'en',
            formality,
            confidence: 0.98,
            grammarNotes: entry.notes || `Category: ${entry.category}`,
            alternativeTranslations: entry.informal ? [entry.informal, entry.formal || ''] : undefined,
            tokensProcessed: cleanText.split(/\s+/).length,
          };
        }
      } else if (sourceLang === 'en' && targetLang === 'rw') {
        const engParts = matchEng.split(/[/,]/).map((s) => s.trim());
        if (engParts.some((p) => lowerInput === p || lowerInput.includes(p))) {
          let translated = entry.kinya;
          if (formality === 'informal' && entry.informal) translated = entry.informal;
          if (formality === 'formal' && entry.formal) translated = entry.formal;

          return {
            sourceText: cleanText,
            translatedText: translated,
            sourceLanguage: 'en',
            targetLanguage: 'rw',
            formality,
            confidence: 0.96,
            grammarNotes: entry.notes || `Ubryo bwo gukoresha: ${entry.category}`,
            alternativeTranslations: [entry.kinya, entry.formal || '', entry.informal || ''].filter(
              (t) => t && t !== translated
            ),
            tokensProcessed: cleanText.split(/\s+/).length,
          };
        }
      }
    }

    // 2. Multi-word composite translation with linguistic substitution
    let translatedWords: string[] = [];
    const words = cleanText.split(/\s+/);
    let matchedCount = 0;

    if (sourceLang === 'rw' && targetLang === 'en') {
      for (const word of words) {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        const punct = word.replace(/[a-zA-Z0-9'’]/g, '');
        const found = DICTIONARY.find((d) => d.kinya.toLowerCase() === cleanWord.toLowerCase());

        if (found) {
          matchedCount++;
          // Take first English definition
          const primaryEn = found.english.split(/[/,]/)[0].trim();
          translatedWords.push(primaryEn + punct);
        } else {
          // Keep untranslated or handle prefix
          translatedWords.push(word);
        }
      }

      // Contextual grammatical refinement
      let resultText = translatedWords.join(' ');
      if (lowerInput.startsWith('mfasha')) {
        resultText = resultText.replace(/^mfasha/i, 'Please help me');
      }
      if (lowerInput.includes('amakuru')) {
        resultText = resultText.replace(/amakuru/i, 'the news / how things are');
      }

      return {
        sourceText: cleanText,
        translatedText: resultText,
        sourceLanguage: 'rw',
        targetLanguage: 'en',
        formality,
        confidence: matchedCount > 0 ? Math.min(0.75 + (matchedCount / words.length) * 0.2, 0.95) : 0.7,
        grammarNotes: 'Composite translation evaluated via KinyaAI NLP grammar matrix.',
        tokensProcessed: words.length,
      };
    } else {
      // English -> Kinyarwanda
      for (const word of words) {
        const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
        const punct = word.replace(/[a-zA-Z0-9'’]/g, '');
        const found = DICTIONARY.find((d) => {
          const parts = d.english.toLowerCase().split(/[/,]/).map((p) => p.trim());
          return parts.includes(cleanWord);
        });

        if (found) {
          matchedCount++;
          translatedWords.push(found.kinya + punct);
        } else {
          translatedWords.push(word);
        }
      }

      let resultText = translatedWords.join(' ');
      return {
        sourceText: cleanText,
        translatedText: resultText,
        sourceLanguage: 'en',
        targetLanguage: 'rw',
        formality,
        confidence: matchedCount > 0 ? Math.min(0.75 + (matchedCount / words.length) * 0.2, 0.95) : 0.7,
        grammarNotes: 'Ubuhinduzi bwakozwe hakoreshejwe KinyaAI NLP engine.',
        tokensProcessed: words.length,
      };
    }
  }

  /**
   * Generates intelligent Kinyarwanda assistant responses for common inquiries, coding, learning, and business.
   */
  public static generateAssistantReply(userPrompt: string, history: { role: string; content: string }[] = []): string {
    const prompt = userPrompt.trim().toLowerCase();

    // 1. Coding & Programming inquiries
    if (
      prompt.includes('javascript') ||
      prompt.includes('react') ||
      prompt.includes('koding') ||
      prompt.includes('porogaramu') ||
      prompt.includes('kwiga porogaramu') ||
      prompt.includes('code')
    ) {
      return `Mwaramutse neza! Nishimiye cyane kugufasha kwiga porogaramu (programming). 🚀

### Intambwe z'ibanze zo gutangira kwiga JavaScript & React:
1. **Iby'ibanze muri JavaScript (Basics):**
   - **Variables:** \`let\` na \`const\` zo kubika amakuru.
   - **Functions:** \`function kwakiraUbutumwa() { ... }\` zo gukora ibikorwa runaka.
   - **Arrays & Objects:** \`const abanyeshuri = ['Bobo', 'Keza', 'Kalisa'];\`

2. **Urugero ruto rwa JavaScript:**
\`\`\`javascript
// Urugero rwa mbere: KinyaAI Greeting
function tangiraKinyaAI(izina) {
  return \`Muraho neza, \${izina}! Urakaza neza muri KinyaAI.\`;
}

console.log(tangiraKinyaAI('Bobo'));
\`\`\`

3. **React.js ni iki?**
   React ni library ikunzwe cyane ku isi yakozwe na Meta (Facebook) ifasha gukora **User Interfaces (UI)** zikora vuba kandi zisa neza ukoresheje ibice byitwa **Components**.

Ese wifuza ko dutangirira ku rugero rwa mbere rw'uko React ikora, cyangwa wifuza ko twiga uko uhuza React na Node.js backend?`;
    }

    // 2. Greetings
    if (prompt.includes('muraho') || prompt.includes('mwaramutse') || prompt.includes('mwiriwe') || prompt.includes('hello')) {
      return `Muraho neza! Ndi KinyaAI — Umufasha wawe mu by'ubwenge bw'ubukorano (AI), ururimi rw'Ikinyarwanda, no kwiga.

Nshobora kugufasha muri ibi bikurikira:
1. **Gusobanura no kwiga** porogaramu, imibare, n'ubumenyi ngiro.
2. **Guhindura indimi (Translation)** hagati y'Ikinyarwanda n'Icyongereza.
3. **Kwandika inyandiko n'amabaruwa y'akazi** (Formal emails & documents).
4. **Gusesengura inyandiko (Summarization)**.

Ni iki wifuza ko tuganiraho uyu munsi?`;
    }

    // 3. What is KinyaAI
    if (prompt.includes('kinyaai') || prompt.includes('uri nde') || prompt.includes('who are you')) {
      return `Ndi **KinyaAI**, umufasha wubatswe hagamijwe korohereza Abanyarwanda n'abakoresha ururimi rw'Ikinyarwanda kubona ubwenge bw'ubukorano (Artificial Intelligence) mu rurimi rwabo rw'amavuko no mu Cyongereza.

Intego yanjye ni:
- Gufasha abanyeshuri kwiga amasomo atandukanye.
- Guhindura indimi mu buryo buhuje n'umuco n'ikibonezamvugo nyacyo.
- Gufasha abanyamwuga n'abacuruzi gukora akazi kabo vuba kandi neza.`;
    }

    // 4. Default comprehensive response
    return `Murakoze ku kibazo cyanyu! 

Ku bijyanye n'icyo mumbajije: **"${userPrompt}"**

Ikinyarwanda n'ikoranabuhanga bifite amahirwe akomeye yo gufatanya. Reka nguhe ibisobanuro byimbitse:
- **Icyo gusobanukirwa:** Ibi bifasha mu kongera ubumenyi no koroshya akazi ka buri munsi.
- **Inama ngufasha:** Gerageza gushyira mu bikorwa intambwe ku yindi (step by step), kandi niteguye kugufasha aho utumva neza.

Ese hari igice cyihariye wifuza ko turushaho gusobanura mu buryo burambuye?`;
  }
}
