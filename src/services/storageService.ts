import { CEFRLevel } from '../data/topics';

export interface RecurringError {
  id: string;
  mistake: string;
  correction: string;
  explanation: string;
  occurrences: number;
  lastDetected: string;
  mastered: boolean;
}

export type ReviewQuality = 'easy' | 'good' | 'hard' | 'struggle';
export type ExpressionStatus = 'NEW' | 'ACTIVE_REVIEW' | 'MASTERED';

export interface ReviewHistoryEntry {
  date: string;
  quality: ReviewQuality;
  spokenAnswer?: string;
}

export interface SavedExpression {
  id: string;
  phrase: string;
  meaning: string; // Explication en français + traduction/sens arabe facultatif
  context?: string; // rétro-compatibilité
  example: string;
  topicTitle?: string;
  level?: CEFRLevel;
  dateLearned: string;
  reviewHistory: ReviewHistoryEntry[];
  intervalDays: number; // 1, 3, 7, 14, 30
  nextReviewDate: string; // ISO date string (YYYY-MM-DD)
  consecutiveSuccesses: number;
  status: ExpressionStatus;
  timesReused: number;
  mastered?: boolean; // rétro-compatibilité
}

export interface PracticedTopicRecord {
  topicId: string;
  topicTitle: string;
  level: CEFRLevel;
  lastPracticed: string;
  totalExchanges: number;
}

export interface UserProgress {
  version: number;
  currentLevel: CEFRLevel;
  subLevel: string;
  totalAnswersSpoken: number;
  practicedTopics: Record<string, PracticedTopicRecord>;
  recurringErrors: RecurringError[];
  savedExpressions: SavedExpression[];
  lastActiveDate: string;
  streakDays: number;
  reviewSessionsCompleted: number;
}

const STORAGE_KEY = 'parlons_francais_user_data_v1';

// Initial starter expressions with spaced repetition scheduling
const INITIAL_EXPRESSIONS: SavedExpression[] = [
  {
    id: 'init-1',
    phrase: 'Prendre du recul',
    meaning: 'Prendre de la distance émotionnelle pour analyser posément (التروي وأخذ مسافة للتفكير)',
    context: 'Prendre de la distance pour réfléchir',
    example: 'Après cette journée chargée, j\'ai besoin de prendre du recul.',
    topicTitle: 'Équilibre entre vie professionnelle et personnelle',
    level: 'B1',
    dateLearned: new Date().toISOString(),
    reviewHistory: [],
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    consecutiveSuccesses: 1,
    status: 'ACTIVE_REVIEW',
    timesReused: 1,
    mastered: false,
  },
  {
    id: 'init-2',
    phrase: 'Contre toute attente',
    meaning: 'De manière imprévue, contrairement à ce qui était prévu (على عكس كل التوقعات)',
    context: 'Dénouement inattendu',
    example: 'Contre toute attente, le train est parti exactement à l\'heure.',
    topicTitle: 'Raconter un voyage mémorable ou imprévu',
    level: 'B1',
    dateLearned: new Date().toISOString(),
    reviewHistory: [],
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    consecutiveSuccesses: 0,
    status: 'NEW',
    timesReused: 0,
    mastered: false,
  },
  {
    id: 'init-3',
    phrase: 'Ça en vaut la peine',
    meaning: 'L\'effort consenti est largement récompensé par le résultat (الأمر يستحق العناء)',
    context: 'L\'effort est justifié',
    example: 'Apprendre le français demande du travail régulier, mais ça en vaut la peine !',
    topicTitle: 'Mes projets et défis d\'avenir',
    level: 'B1',
    dateLearned: new Date(Date.now() - 14 * 86400000).toISOString(),
    reviewHistory: [
      { date: new Date(Date.now() - 7 * 86400000).toISOString(), quality: 'good' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), quality: 'easy' }
    ],
    intervalDays: 7,
    nextReviewDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    consecutiveSuccesses: 2,
    status: 'ACTIVE_REVIEW',
    timesReused: 2,
    mastered: false,
  },
  {
    id: 'init-4',
    phrase: 'Trouver un juste milieu',
    meaning: 'Chercher un équilibre raisonnable entre deux extrêmes (إيجاد حل وسط أو توازن)',
    context: 'Équilibre équitable',
    example: 'Il faut trouver un juste milieu entre investissement professionnel et repos.',
    topicTitle: 'Équilibre de vie',
    level: 'B1',
    dateLearned: new Date().toISOString(),
    reviewHistory: [],
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    consecutiveSuccesses: 0,
    status: 'NEW',
    timesReused: 0,
    mastered: false,
  }
];

const INITIAL_ERRORS: RecurringError[] = [
  {
    id: 'err-1',
    mistake: 'Je suis été en France',
    correction: 'J\'ai été en France / Je suis allé(e) en France',
    explanation: 'Le verbe "être" au passé composé se conjugue toujours avec l\'auxiliaire "avoir" (j\'ai été) ou utilisez "aller" (je suis allé).',
    occurrences: 2,
    lastDetected: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'err-2',
    mistake: 'Visiter à mes amis',
    correction: 'Rendre visite à mes amis / Visiter une ville',
    explanation: 'On visite un lieu (un monument, une ville), mais on "rend visite à" une personne.',
    occurrences: 1,
    lastDetected: new Date().toISOString(),
    mastered: false,
  }
];

// Helper to compute next review date by adding days
function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Spaced repetition interval schedule: 1, 3, 7, 14, 30 days
const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function getUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: UserProgress = {
        version: 2,
        currentLevel: 'B1',
        subLevel: 'B1.2',
        totalAnswersSpoken: 4,
        practicedTopics: {},
        recurringErrors: INITIAL_ERRORS,
        savedExpressions: INITIAL_EXPRESSIONS,
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakDays: 1,
        reviewSessionsCompleted: 1,
      };
      saveUserProgress(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);

    // Schema migration & preservation: ensure all expressions have SRS fields
    let updated = false;
    if (!parsed.version || parsed.version < 2) {
      parsed.version = 2;
      updated = true;
    }

    if (Array.isArray(parsed.savedExpressions)) {
      parsed.savedExpressions = parsed.savedExpressions.map((exp: any) => {
        let modified = false;
        const meaning = exp.meaning || exp.context || 'Expression authentique française';
        const reviewHistory = Array.isArray(exp.reviewHistory) ? exp.reviewHistory : [];
        const intervalDays = typeof exp.intervalDays === 'number' ? exp.intervalDays : 1;
        const nextReviewDate = exp.nextReviewDate || new Date().toISOString().split('T')[0];
        const consecutiveSuccesses = typeof exp.consecutiveSuccesses === 'number' ? exp.consecutiveSuccesses : (exp.timesReused || 0);
        let status: ExpressionStatus = exp.status;
        if (!status) {
          if (exp.mastered) {
            status = 'MASTERED';
          } else if (consecutiveSuccesses > 0) {
            status = 'ACTIVE_REVIEW';
          } else {
            status = 'NEW';
          }
          modified = true;
        }

        if (modified || !exp.meaning) updated = true;

        return {
          ...exp,
          meaning,
          reviewHistory,
          intervalDays,
          nextReviewDate,
          consecutiveSuccesses,
          status
        };
      });
    }

    if (updated) {
      saveUserProgress(parsed);
    }

    return parsed;
  } catch (e) {
    console.error('Erreur de lecture locale:', e);
    return {
      version: 2,
      currentLevel: 'B1',
      subLevel: 'B1.2',
      totalAnswersSpoken: 0,
      practicedTopics: {},
      recurringErrors: INITIAL_ERRORS,
      savedExpressions: INITIAL_EXPRESSIONS,
      lastActiveDate: new Date().toISOString().split('T')[0],
      streakDays: 1,
      reviewSessionsCompleted: 0,
    };
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Erreur d\'écriture locale:', e);
  }
}

export function recordSpokenAnswer(topicId: string, topicTitle: string, level: CEFRLevel): void {
  const data = getUserProgress();
  data.totalAnswersSpoken += 1;

  const today = new Date().toISOString().split('T')[0];
  if (data.lastActiveDate !== today) {
    data.streakDays += 1;
    data.lastActiveDate = today;
  }

  if (!data.practicedTopics[topicId]) {
    data.practicedTopics[topicId] = {
      topicId,
      topicTitle,
      level,
      lastPracticed: new Date().toISOString(),
      totalExchanges: 1,
    };
  } else {
    data.practicedTopics[topicId].lastPracticed = new Date().toISOString();
    data.practicedTopics[topicId].totalExchanges += 1;
  }

  saveUserProgress(data);
}

export function recordDetectedMistake(mistake: string, correction: string, explanation: string): void {
  if (!mistake || !correction) return;
  const data = getUserProgress();
  const existing = data.recurringErrors.find(
    (e) => e.mistake.toLowerCase().trim() === mistake.toLowerCase().trim()
  );

  if (existing) {
    existing.occurrences += 1;
    existing.lastDetected = new Date().toISOString();
    existing.mastered = false;
  } else {
    data.recurringErrors.unshift({
      id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      mistake,
      correction,
      explanation,
      occurrences: 1,
      lastDetected: new Date().toISOString(),
      mastered: false,
    });
  }

  saveUserProgress(data);
}

export function saveUsefulExpression(
  phrase: string,
  meaning: string,
  example: string,
  topicTitle?: string,
  level?: CEFRLevel
): void {
  if (!phrase) return;
  const data = getUserProgress();
  const existing = data.savedExpressions.find(
    (item) => item.phrase.toLowerCase().trim() === phrase.toLowerCase().trim()
  );

  if (existing) {
    existing.timesReused += 1;
    if (meaning && (!existing.meaning || existing.meaning.length < meaning.length)) {
      existing.meaning = meaning;
    }
  } else {
    const today = new Date().toISOString().split('T')[0];
    data.savedExpressions.unshift({
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      phrase,
      meaning: meaning || 'Expression idiomatique française',
      example: example || `Exemple d'usage : « ${phrase} »`,
      topicTitle,
      level,
      dateLearned: new Date().toISOString(),
      reviewHistory: [],
      intervalDays: 1,
      nextReviewDate: today,
      consecutiveSuccesses: 0,
      status: 'NEW',
      timesReused: 0,
      mastered: false,
    });
  }

  saveUserProgress(data);
}

/**
 * Spaced Repetition (SRS) review handler:
 * Intervals: 1, 3, 7, 14, 30 days
 * Quality:
 *  - 'easy': increases interval by 2 steps, consecutiveSuccesses + 1
 *  - 'good': increases interval by 1 step, consecutiveSuccesses + 1
 *  - 'hard': resets interval to 1 day, keeps successes
 *  - 'struggle': resets interval to 1 day, resets successes
 */
export function recordExpressionReview(
  expressionId: string,
  quality: ReviewQuality,
  spokenAnswer?: string
): void {
  const data = getUserProgress();
  const exp = data.savedExpressions.find(e => e.id === expressionId);
  if (!exp) return;

  const today = new Date().toISOString().split('T')[0];
  exp.reviewHistory.unshift({
    date: new Date().toISOString(),
    quality,
    spokenAnswer
  });

  const currentIndex = SRS_INTERVALS.indexOf(exp.intervalDays);
  let nextInterval = exp.intervalDays;

  if (quality === 'easy') {
    exp.consecutiveSuccesses += 1;
    const targetIdx = currentIndex === -1 ? 1 : Math.min(SRS_INTERVALS.length - 1, currentIndex + 2);
    nextInterval = SRS_INTERVALS[targetIdx];
  } else if (quality === 'good') {
    exp.consecutiveSuccesses += 1;
    const targetIdx = currentIndex === -1 ? 1 : Math.min(SRS_INTERVALS.length - 1, currentIndex + 1);
    nextInterval = SRS_INTERVALS[targetIdx];
  } else if (quality === 'hard') {
    nextInterval = 1;
  } else {
    // struggle
    nextInterval = 1;
    exp.consecutiveSuccesses = 0;
  }

  exp.intervalDays = nextInterval;
  exp.nextReviewDate = addDays(today, nextInterval);

  // Status progression: never mark mastered on 1 answer
  // Requires at least 3 consecutive successes and interval >= 14 days
  if (exp.consecutiveSuccesses >= 3 && exp.intervalDays >= 14) {
    exp.status = 'MASTERED';
    exp.mastered = true;
  } else if (exp.consecutiveSuccesses > 0) {
    exp.status = 'ACTIVE_REVIEW';
    exp.mastered = false;
  } else {
    exp.status = 'NEW';
    exp.mastered = false;
  }

  saveUserProgress(data);
}

export function toggleExpressionMastered(id: string): void {
  const data = getUserProgress();
  const target = data.savedExpressions.find((e) => e.id === id);
  if (target) {
    if (target.status === 'MASTERED') {
      target.status = 'ACTIVE_REVIEW';
      target.mastered = false;
      target.intervalDays = 3;
      target.nextReviewDate = new Date().toISOString().split('T')[0];
    } else {
      target.status = 'MASTERED';
      target.mastered = true;
      target.intervalDays = 30;
      target.consecutiveSuccesses = Math.max(3, target.consecutiveSuccesses);
    }
    saveUserProgress(data);
  }
}

export function toggleErrorMastered(id: string): void {
  const data = getUserProgress();
  const target = data.recurringErrors.find((e) => e.id === id);
  if (target) {
    target.mastered = !target.mastered;
    saveUserProgress(data);
  }
}

export function incrementExpressionReuse(phrase: string): void {
  const data = getUserProgress();
  const target = data.savedExpressions.find(
    (e) => e.phrase.toLowerCase().includes(phrase.toLowerCase()) || phrase.toLowerCase().includes(e.phrase.toLowerCase())
  );
  if (target) {
    target.timesReused += 1;
    saveUserProgress(data);
  }
}

export function recordReviewCompleted(): void {
  const data = getUserProgress();
  data.reviewSessionsCompleted += 1;
  saveUserProgress(data);
}

export function updateCurrentLevel(level: CEFRLevel, subLevel: string = 'B1.2'): void {
  const data = getUserProgress();
  data.currentLevel = level;
  data.subLevel = subLevel;
  saveUserProgress(data);
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Backup / Export functionality (JSON download)
 */
export function exportUserDataAsJson(providedData?: UserProgress): void {
  const data = providedData || getUserProgress();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const today = new Date().toISOString().split('T')[0];
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `parlons-francais-sauvegarde-${today}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Restore / Import functionality
 */
export function importUserDataFromJson(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Fichier invalide ou vide.' };
    }
    if (!Array.isArray(parsed.savedExpressions) || !Array.isArray(parsed.recurringErrors)) {
      return { success: false, message: 'Le format du fichier ne correspond pas à Parlons Français.' };
    }
    parsed.version = 2;
    saveUserProgress(parsed);
    return { success: true, message: 'Progression et carnet restaurés avec succès !' };
  } catch (err: any) {
    return { success: false, message: 'Erreur lors de la lecture du fichier JSON : ' + (err?.message || 'Inconnu') };
  }
}
