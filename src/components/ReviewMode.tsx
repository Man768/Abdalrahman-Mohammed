import React, { useState, useEffect, useMemo } from 'react';
import { 
  SavedExpression, 
  ReviewQuality, 
  recordExpressionReview, 
  recordReviewCompleted,
  incrementExpressionReuse
} from '../services/storageService';
import { speechService } from '../services/speechService';
import { evaluateSpokenAnswer, EvaluationResult } from '../services/feedbackService';
import { CEFRLevel, TOPICS } from '../data/topics';
import { 
  RotateCcw, 
  Mic, 
  Square, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Volume1,
  Send, 
  AlertCircle, 
  Award, 
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
  Flame,
  CheckCircle
} from 'lucide-react';

interface ReviewModeProps {
  savedExpressions: SavedExpression[];
  currentLevel: CEFRLevel;
  subLevel: string;
  onRefreshData: () => void;
}

export const ReviewMode: React.FC<ReviewModeProps> = ({
  savedExpressions,
  currentLevel,
  subLevel,
  onRefreshData
}) => {
  const [includeMastered, setIncludeMastered] = useState<boolean>(false);
  const [activeExpressionIndex, setActiveExpressionIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false);

  // Audio states
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState<boolean>(false);
  const [isSpeakingUserResponse, setIsSpeakingUserResponse] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [reviewedCurrent, setReviewedCurrent] = useState<boolean>(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter queue of expressions due for spaced review
  const reviewQueue = useMemo(() => {
    let list = savedExpressions.filter(exp => {
      if (includeMastered) return true;
      if (exp.status === 'MASTERED') return false;
      return !exp.nextReviewDate || exp.nextReviewDate <= todayStr || exp.status === 'NEW';
    });

    if (list.length === 0 && savedExpressions.length > 0) {
      // If nothing is strictly due, show all expressions sorted by nextReviewDate
      list = [...savedExpressions].sort((a, b) => (a.nextReviewDate || '').localeCompare(b.nextReviewDate || ''));
    }

    return list;
  }, [savedExpressions, includeMastered, todayStr]);

  const currentExp: SavedExpression | undefined = reviewQueue[activeExpressionIndex];

  // Reset state when switching expression
  useEffect(() => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setIsSpeakingPrompt(false);
    setIsSpeakingUserResponse(false);
    setIsListening(false);
    setTranscript('');
    setEvaluation(null);
    setShowHint(false);
    setRevealAnswer(false);
    setFeedbackError(null);
    setReviewedCurrent(false);
  }, [activeExpressionIndex, currentExp?.id]);

  const promptScenario = useMemo(() => {
    if (!currentExp) return '';
    return `Mettez en pratique orale l'expression liée à : ${currentExp.topicTitle || 'votre quotidien'}. Énoncez à haute voix une phrase complète et personnelle qui exprime cette idée sans hésiter.`;
  }, [currentExp]);

  const handleSpeakPrompt = () => {
    if (!currentExp) return;
    if (isSpeakingPrompt) {
      speechService.stopSpeaking();
      setIsSpeakingPrompt(false);
    } else {
      setIsSpeakingUserResponse(false);
      setIsSpeakingPrompt(true);
      const textToSpeak = `${promptScenario} Objectif : ${currentExp.meaning}.`;
      speechService.speak(
        textToSpeak,
        () => setIsSpeakingPrompt(true),
        () => setIsSpeakingPrompt(false),
        () => setIsSpeakingPrompt(false)
      );
    }
  };

  const handleToggleReplayResponse = () => {
    if (isSpeakingUserResponse) {
      speechService.stopSpeaking();
      setIsSpeakingUserResponse(false);
    } else if (transcript.trim()) {
      setIsSpeakingPrompt(false);
      setIsSpeakingUserResponse(true);
      speechService.speak(
        transcript,
        () => setIsSpeakingUserResponse(true),
        () => setIsSpeakingUserResponse(false),
        () => setIsSpeakingUserResponse(false)
      );
    }
  };

  const handleStartListening = () => {
    setFeedbackError(null);
    speechService.stopSpeaking();
    setIsSpeakingPrompt(false);
    setIsSpeakingUserResponse(false);

    const started = speechService.startListening(
      (text) => setTranscript(text),
      (err) => {
        setFeedbackError(err);
        setIsListening(false);
      },
      () => setIsListening(false)
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const handleEvaluateSubmission = async () => {
    if (!currentExp || !transcript.trim()) {
      setFeedbackError("Veuillez prononcer votre phrase à voix haute avant de valider.");
      return;
    }

    handleStopListening();
    setIsEvaluating(true);
    setFeedbackError(null);

    const syntheticTopic = TOPICS.find(t => t.level === currentLevel) || TOPICS[0];

    try {
      const result = await evaluateSpokenAnswer(
        transcript,
        syntheticTopic,
        promptScenario,
        [{ role: 'assistant', content: promptScenario }],
        0,
        [currentExp.phrase]
      );

      const phraseFound = transcript.toLowerCase().includes(currentExp.phrase.toLowerCase());
      if (phraseFound) {
        incrementExpressionReuse(currentExp.phrase);
      }

      setEvaluation(result);
      setRevealAnswer(true);
    } catch (err: any) {
      console.error('Erreur évaluation révision:', err);
      setFeedbackError("Évaluation impossible, mais vos données locales sont préservées.");
      setRevealAnswer(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRatePerformance = (quality: ReviewQuality) => {
    if (!currentExp) return;
    recordExpressionReview(currentExp.id, quality, transcript);
    recordReviewCompleted();
    onRefreshData();
    setReviewedCurrent(true);

    // Auto advance after brief delay
    setTimeout(() => {
      if (activeExpressionIndex < reviewQueue.length - 1) {
        setActiveExpressionIndex(prev => prev + 1);
      } else {
        setActiveExpressionIndex(0);
      }
    }, 600);
  };

  if (!currentExp) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Toutes vos révisions sont à jour pour aujourd'hui !</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Vous avez révisé toutes les expressions programmées par l'algorithme de répétition espacée (SRS).
          </p>
          <button
            onClick={() => setIncludeMastered(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Réviser également les expressions maîtrisées
          </button>
        </div>
      </div>
    );
  }

  const isExpressionDetected = transcript.toLowerCase().includes(currentExp.phrase.toLowerCase());

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Title & Introduction Banner with Spaced Repetition stats */}
      <div className="bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <RotateCcw className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Répétition Espacée (1, 3, 7, 14, 30 jours)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Révision Orale Spontanée
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Mobilisez vos expressions acquises en situation réelle sans les lire à l'avance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncludeMastered(!includeMastered)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                includeMastered
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {includeMastered ? 'Toutes expressions incluses' : 'Filtrer dues aujourd\'hui'}
            </button>
          </div>
        </div>

        {/* Progress queue indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <span>Expression {activeExpressionIndex + 1} sur {reviewQueue.length}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Statut :</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentExp.status === 'MASTERED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : currentExp.status === 'ACTIVE_REVIEW'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}>
              {currentExp.status} (Intervalle : {currentExp.intervalDays}j)
            </span>
          </div>
        </div>
      </div>

      {/* Spoken Challenge Card: Do NOT reveal expression before user tries */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Oral Prompt Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Défi oral (Sens à exprimer) :
            </span>
            <button
              onClick={handleSpeakPrompt}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isSpeakingPrompt
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
              title="Écouter la consigne à voix haute"
            >
              {isSpeakingPrompt ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeakingPrompt ? 'Arrêter' : 'Écouter consigne'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-750 space-y-2">
            <p className="text-sm text-slate-300">
              Formulez une phrase spontanée pour exprimer :
            </p>
            <p className="text-base sm:text-lg font-bold text-white">
              « {currentExp.meaning} »
            </p>
            {currentExp.topicTitle && (
              <p className="text-xs text-slate-400 italic">
                Sujet d'origine : {currentExp.topicTitle}
              </p>
            )}
          </div>
        </div>

        {/* HINT & REVEAL SYSTEM: User can ask for a hint if struggling */}
        <div className="bg-slate-800/30 rounded-xl p-3.5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Aide à la mémorisation</span>
            </span>

            <div className="flex items-center space-x-2">
              {!showHint && !revealAnswer && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                >
                  💡 Afficher un indice
                </button>
              )}

              <button
                onClick={() => setRevealAnswer(!revealAnswer)}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
              >
                {revealAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealAnswer ? 'Masquer l\'expression' : 'Voir l\'expression'}</span>
              </button>
            </div>
          </div>

          {showHint && !revealAnswer && (
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300 animate-fade-in">
              <strong>Indice :</strong> Cette expression commence par la lettre « {currentExp.phrase.charAt(0)} » et compte environ {currentExp.phrase.split(' ').length} mots.
            </div>
          )}

          {revealAnswer && (
            <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/50 text-xs space-y-1 animate-fade-in">
              <span className="text-[10px] text-purple-400 uppercase font-bold">Expression cible :</span>
              <p className="text-base font-bold text-white">« {currentExp.phrase} »</p>
              <p className="text-slate-300 italic">Exemple : {currentExp.example}</p>
            </div>
          )}
        </div>

        {/* Voice Recording Controls (Start / Stop) */}
        <div className="pt-2 border-t border-slate-800 space-y-4">
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white ring-8 ring-rose-500/20 animate-pulse'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white ring-8 ring-purple-500/10'
              }`}
              title={isListening ? 'Arrêter l\'enregistrement (Stop)' : 'Démarrer la réponse orale (Start)'}
            >
              {isListening ? (
                <>
                  <Square className="w-6 h-6 fill-white mb-0.5" />
                  <span className="text-[10px] font-bold uppercase">Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-7 h-7 mb-0.5" />
                  <span className="text-[10px] font-bold uppercase">Parler</span>
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              {isListening
                ? 'Écoute active... Prononcez votre phrase en employant l\'expression !'
                : 'Touchez « Parler » et prononcez votre réponse spontanée.'}
            </p>
          </div>

          {/* Transcript Box with Replay Response Option */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">Votre prise de parole :</span>
              {transcript && (
                <button
                  onClick={handleToggleReplayResponse}
                  className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
                >
                  <Volume1 className="w-3.5 h-3.5" />
                  <span>{isSpeakingUserResponse ? 'Arrêter réécoute' : 'Réécouter ma réponse'}</span>
                </button>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Votre réponse orale transcrite apparaîtra ici..."
              rows={3}
              className="w-full p-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {feedbackError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{feedbackError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleEvaluateSubmission}
              disabled={!transcript.trim() || isEvaluating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Évaluation en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Vérifier mon réemploi oral</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RECALL PERFORMANCE RATING BAR: Spaced Repetition interval adjustment */}
        {revealAnswer && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Évaluez votre aisance de rappel (Ajustement SRS) :
              </span>
              {isExpressionDetected && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Expression reconnue dans vos propos !
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleRatePerformance('struggle')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/50 border border-slate-700 hover:border-rose-500 text-left transition-colors group cursor-pointer"
              >
                <div className="text-xs font-bold text-rose-400 group-hover:text-rose-300">Oublié / Difficile</div>
                <div className="text-[11px] text-slate-400">Revoir demain (1j)</div>
              </button>

              <button
                onClick={() => handleRatePerformance('hard')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-amber-950/50 border border-slate-700 hover:border-amber-500 text-left transition-colors group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">Hésitant</div>
                <div className="text-[11px] text-slate-400">Revoir dans 1-2j</div>
              </button>

              <button
                onClick={() => handleRatePerformance('good')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-950/50 border border-slate-700 hover:border-blue-500 text-left transition-colors group cursor-pointer"
              >
                <div className="text-xs font-bold text-blue-400 group-hover:text-blue-300">Bien réussi</div>
                <div className="text-[11px] text-slate-400">Palier suivant (+1)</div>
              </button>

              <button
                onClick={() => handleRatePerformance('easy')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-950/50 border border-slate-700 hover:border-emerald-500 text-left transition-colors group cursor-pointer"
              >
                <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">Parfait / Facile</div>
                <div className="text-[11px] text-slate-400">Grand saut (+2)</div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Feedback Result */}
      {evaluation && (
        <div className="bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Analyse de votre révision orale
              </span>
              <h3 className="text-lg font-bold text-white">
                {isExpressionDetected
                  ? "🎉 Expression employée avec succès !"
                  : "👍 Belle tentative de prise de parole !"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-indigo-300">Grammaire :</span>
              <p className="text-slate-300">{evaluation.grammar}</p>
            </div>
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-blue-300">Naturel :</span>
              <p className="text-slate-300">{evaluation.naturalPhrasing}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation between expressions in queue */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <button
          onClick={() => setActiveExpressionIndex(prev => Math.max(0, prev - 1))}
          disabled={activeExpressionIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
        >
          Précédente
        </button>

        <span>{activeExpressionIndex + 1} / {reviewQueue.length}</span>

        <button
          onClick={() => setActiveExpressionIndex(prev => Math.min(reviewQueue.length - 1, prev + 1))}
          disabled={activeExpressionIndex >= reviewQueue.length - 1}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
        >
          Suivante
        </button>
      </div>
    </div>
  );
};
