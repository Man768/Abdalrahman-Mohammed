import { Topic } from '../data/topics';

export interface EvaluationResult {
  praise: string;
  grammar: string;
  vocabulary: string;
  naturalPhrasing: string;
  fluency: string;
  nextQuestion: string;
  detectedError: {
    mistake: string;
    correction: string;
    explanation: string;
  } | null;
  usefulExpression?: {
    french: string;
    usage: string;
  } | null;
  source: 'gemini' | 'local_fallback';
}

// Common pitfalls in spoken French for intermediate learners (especially B1-B2)
const COMMON_MISTAKES_RULES = [
  {
    regex: /\b(visiter\s+[aà]\s+(?:mes|mon|ma|des|les|un|une|[A-Z][a-z]+))/i,
    mistake: 'visiter à quelqu\'un',
    correction: 'rendre visite à quelqu\'un',
    explanation: 'En français, on "visite" un lieu (ex: visiter Paris), mais on "rend visite à" une personne.'
  },
  {
    regex: /\b(je\s+suis\s+(?:été|nagé|dormi|travaillé))\b/i,
    mistake: 'je suis été / je suis travaillé',
    correction: 'j\'ai été / j\'ai travaillé',
    explanation: 'Les verbes d\'action comme être ou travailler se conjuguent avec l\'auxiliaire "avoir" au passé composé.'
  },
  {
    regex: /\b(beaucoup\s+des\s+)/i,
    mistake: 'beaucoup des',
    correction: 'beaucoup de / beaucoup d\'',
    explanation: 'Après les adverbes de quantité (beaucoup, peu, trop), l\'article partitif devient simplement "de" ou "d\'".'
  },
  {
    regex: /\b(faire\s+du\s+sens)\b/i,
    mistake: 'faire du sens',
    correction: 'avoir du sens / être logique',
    explanation: '"Faire du sens" est un calque de l\'anglais. En bon français, dites "avoir du sens" ou "tenir debout".'
  },
  {
    regex: /\b(j['’]ai\s+allé)\b/i,
    mistake: 'j\'ai allé',
    correction: 'je suis allé(e)',
    explanation: 'Le verbe "aller" exprime un mouvement et se conjugue avec l\'auxiliaire "être" au passé composé.'
  },
  {
    regex: /\b(demander\s+pour)\b/i,
    mistake: 'demander pour',
    correction: 'demander quelque chose',
    explanation: 'Le verbe demander est transitif direct : on demande un renseignement, on ne demande pas "pour".'
  },
  {
    regex: /\b(intéressé\s+dans)\b/i,
    mistake: 'intéressé dans',
    correction: 'intéressé par / s\'intéresser à',
    explanation: 'Dites "je suis intéressé par ce sujet" ou "je m\'intéresse à la musique".'
  },
  {
    regex: /\b(au\s+(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche))\b/i,
    mistake: 'au samedi / au lundi',
    correction: 'le samedi / samedi',
    explanation: 'Pour les jours de la semaine, n\'utilisez pas "au". Dites "samedi" (prochain) ou "le samedi" (habitude).'
  },
  {
    regex: /\b(écouter\s+[aà]\s+(?:la|le|les|du))\b/i,
    mistake: 'écouter à',
    correction: 'écouter de la / écouter la',
    explanation: 'Le verbe écouter est direct : on écoute la radio ou de la musique, pas "à".'
  },
  {
    regex: /\b(actuellement)\b/i,
    mistake: 'actuellement (si sens "en fait")',
    correction: 'en réalité / en fait / actuellement (= en ce moment)',
    explanation: 'Rappel : en français, "actuellement" signifie "en ce moment" et non "en réalité" (actually en anglais).'
  }
];

export async function evaluateSpokenAnswer(
  userAnswer: string,
  topic: Topic,
  currentQuestion: string,
  conversationHistory: { role: 'assistant' | 'user'; content: string }[],
  questionIndex: number,
  targetExpressions: string[] = []
): Promise<EvaluationResult> {
  // 1. Try free-tier server endpoint
  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicTitle: topic.title,
        level: topic.level,
        conversationHistory,
        userSpokenAnswer: userAnswer,
        targetExpressions: targetExpressions.length > 0 ? targetExpressions : topic.keyExpressions.map(k => k.phrase)
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.source === 'gemini' && data.nextQuestion) {
        return data as EvaluationResult;
      }
    }
  } catch (err) {
    // network or offline, fallback to local
    console.info('Utilisation du moteur linguistique local intégré');
  }

  // 2. Intelligent local linguistic evaluation
  return evaluateLocally(userAnswer, topic, currentQuestion, questionIndex, targetExpressions);
}

function evaluateLocally(
  userAnswer: string,
  topic: Topic,
  currentQuestion: string,
  questionIndex: number,
  targetExpressions: string[]
): EvaluationResult {
  const text = userAnswer.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Check common mistakes
  let detectedError: EvaluationResult['detectedError'] = null;
  for (const rule of COMMON_MISTAKES_RULES) {
    if (rule.regex.test(text)) {
      detectedError = {
        mistake: rule.mistake,
        correction: rule.correction,
        explanation: rule.explanation
      };
      break;
    }
  }

  // Check reused expression
  const matchedTarget = targetExpressions.find(expr => 
    text.toLowerCase().includes(expr.toLowerCase())
  ) || topic.keyExpressions.find(k => text.toLowerCase().includes(k.phrase.toLowerCase()))?.phrase;

  // Check linguistic markers
  const hasSubjunctive = /\b(soit|soient|puisse|puissent|fasse|fassent|aie|ayons|ayez|aient)\b/i.test(text);
  const hasConnectors = /\b(cependant|pourtant|en revanche|par conséquent|d'ailleurs|en effet|certes|toutefois|ainsi)\b/i.test(text);
  const hasConditionnel = /\b(aimerais|voudrais|serait|pourrait|devrait|préférerais)\b/i.test(text);

  // Generate tailored praise
  let praise = "C'est une réponse très intéressante et bien construite !";
  if (wordCount > 25) {
    praise = "Bravo pour le développement de votre propos et votre clarté d'expression !";
  } else if (matchedTarget) {
    praise = `Excellent réemploi de l'expression « ${matchedTarget} » ! C'est très naturel.`;
  } else if (hasConnectors) {
    praise = "Très bonne structuration avec des connecteurs logiques appropriés !";
  }

  // Generate grammar feedback
  let grammar = "Structure grammaticale solide et claire.";
  if (detectedError) {
    grammar = `Point d'attention : préférez « ${detectedError.correction} » plutôt que « ${detectedError.mistake} ».`;
  } else if (topic.level === 'B1' && !hasConditionnel && /souhait|rêve|idéal/i.test(currentQuestion)) {
    grammar = "Astuce : pensez à mobiliser le conditionnel présent (ex: « J'aimerais », « Ce serait ») pour nuancer vos souhaits.";
  } else if (wordCount < 10) {
    grammar = "La phrase est correcte mais courte. Essayez d'ajouter une proposition relative avec « qui » ou « dont ».";
  }

  // Generate vocabulary feedback
  let vocabulary = "Vocabulaire adapté et compréhensible.";
  if (topic.suggestedVocab && topic.suggestedVocab.length > 0) {
    const randomVocab = topic.suggestedVocab[questionIndex % topic.suggestedVocab.length];
    vocabulary = `Pour enrichir votre lexique sur ce sujet, essayez d'utiliser le mot « ${randomVocab} ».`;
  }

  // Generate natural phrasing
  let naturalPhrasing = "Tournure fluide et compréhensible.";
  const keyExp = topic.keyExpressions[questionIndex % topic.keyExpressions.length];
  if (keyExp && !matchedTarget) {
    naturalPhrasing = `Pour sonner encore plus authentique, vous pourriez glisser l'expression : « ${keyExp.phrase} » (${keyExp.context.toLowerCase()}).`;
  } else if (matchedTarget) {
    naturalPhrasing = `Votre utilisation de « ${matchedTarget} » sonne parfaitement authentique en français moderne !`;
  }

  // Fluency feedback
  let fluency = "Bonne spontanéité orale.";
  if (wordCount >= 20) {
    fluency = "Votre débit et la longueur de votre intervention témoignent d'une belle confiance à l'oral.";
  } else if (wordCount < 10) {
    fluency = "Prenez le temps d'étoffer en illustrant avec un exemple personnel (« Par exemple, l'autre jour... »).";
  } else {
    fluency = "Rythme équilibré. Pensez à lier vos idées avec « du coup » ou « c'est pourquoi ».";
  }

  // Next question logic (pick next follow up or responsive follow up)
  let nextQuestion = "";
  if (questionIndex < topic.followUpQuestions.length) {
    nextQuestion = topic.followUpQuestions[questionIndex];
  } else {
    // Generate an open concluding reflection
    nextQuestion = "Si vous deviez résumer votre position ou donner un conseil personnel sur ce sujet, que diriez-vous pour conclure ?";
  }

  // Contextual twist if user mentions something specific
  if (/toujours|jamais|parfois/i.test(text) && questionIndex === 0 && topic.followUpQuestions[0]) {
    nextQuestion = topic.followUpQuestions[0];
  }

  return {
    praise,
    grammar,
    vocabulary,
    naturalPhrasing,
    fluency,
    nextQuestion,
    detectedError,
    usefulExpression: keyExp ? {
      french: keyExp.phrase,
      usage: `${keyExp.context} (ex: ${keyExp.example})`
    } : null,
    source: 'local_fallback'
  };
}
