import React, { useState, useEffect, useRef } from 'react';
import { Topic } from '../data/topics';
import { speechService } from '../services/speechService';
import { evaluateSpokenAnswer, EvaluationResult } from '../services/feedbackService';
import { FeedbackCard } from './FeedbackCard';
import { 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowLeft, 
  Send, 
  Edit3, 
  Sparkles, 
  Info,
  CheckCircle,
  HelpCircle,
  Pause,
  Play,
  Volume1,
  Target,
  Sparkle
} from 'lucide-react';

interface SpeakingRoomProps {
  topic: Topic;
  onExit: () => void;
  onRecordAnswer: (topicId: string, topicTitle: string, level: Topic['level']) => void;
  onSaveExpression: (phrase: string, context: string, example: string) => void;
  onSaveError: (mistake: string, correction: string, explanation: string) => void;
  onReuseExpression: (phrase: string) => void;
}

interface MessageExchange {
  id: string;
  question: string;
  userAnswer?: string;
  evaluation?: EvaluationResult;
}

export const SpeakingRoom: React.FC<SpeakingRoomProps> = ({
  topic,
  onExit,
  onRecordAnswer,
  onSaveExpression,
  onSaveError,
  onReuseExpression
}) => {
  // Conversational state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<string>(topic.initialQuestion);
  const [history, setHistory] = useState<MessageExchange[]>([]);
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  
  // Audio & Speech states
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState<boolean>(false);
  const [isSpeakingUserResponse, setIsSpeakingUserResponse] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [isEditingTranscript, setIsEditingTranscript] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [autoSpeakQuestion, setAutoSpeakQuestion] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Evaluation & loading states (guarding against duplicate AI calls)
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationResult | null>(null);

  const transcriptInputRef = useRef<HTMLTextAreaElement>(null);
  const isEvaluatingRef = useRef<boolean>(false);

  // Speak initial question on mount if autoSpeak is on
  useEffect(() => {
    if (autoSpeakQuestion) {
      speakText(topic.initialQuestion);
    }
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, []);

  const speakText = (text: string) => {
    speechService.stopListening();
    setIsSpeakingUserResponse(false);
    setIsSpeakingQuestion(true);
    speechService.speak(
      text,
      () => setIsSpeakingQuestion(true),
      () => setIsSpeakingQuestion(false),
      (err) => {
        setIsSpeakingQuestion(false);
        console.warn('TTS question warning:', err);
      }
    );
  };

  const speakUserResponse = (text: string) => {
    if (!text.trim()) return;
    speechService.stopListening();
    setIsSpeakingQuestion(false);
    setIsSpeakingUserResponse(true);
    speechService.speak(
      text,
      () => setIsSpeakingUserResponse(true),
      () => setIsSpeakingUserResponse(false),
      (err) => {
        setIsSpeakingUserResponse(false);
        console.warn('TTS user response warning:', err);
      }
    );
  };

  const handleToggleSpeakCurrentQuestion = () => {
    if (isSpeakingQuestion) {
      speechService.stopSpeaking();
      setIsSpeakingQuestion(false);
    } else {
      speakText(currentQuestion);
    }
  };

  const handleToggleReplayUserResponse = () => {
    if (isSpeakingUserResponse) {
      speechService.stopSpeaking();
      setIsSpeakingUserResponse(false);
    } else if (spokenTranscript.trim()) {
      speakUserResponse(spokenTranscript);
    }
  };

  const handleSpeedChange = (newRate: number) => {
    setSpeechRate(newRate);
    speechService.setRate(newRate);
  };

  const handleStartListening = () => {
    if (!sessionActive) {
      setSessionActive(true);
    }
    setAudioError(null);
    speechService.stopSpeaking();
    setIsSpeakingQuestion(false);
    setIsSpeakingUserResponse(false);
    setIsEditingTranscript(false);

    const started = speechService.startListening(
      (transcript) => {
        setSpokenTranscript(transcript);
      },
      (errorMsg) => {
        setAudioError(errorMsg);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  const handlePauseSession = () => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setIsListening(false);
    setIsSpeakingQuestion(false);
    setIsSpeakingUserResponse(false);
    setSessionActive(false);
  };

  const handleResumeSession = () => {
    setSessionActive(true);
    if (autoSpeakQuestion && !spokenTranscript) {
      speakText(currentQuestion);
    }
  };

  const handleSubmitAnswer = async () => {
    // Guard against duplicate / concurrent AI requests
    if (isEvaluatingRef.current || isEvaluating) return;

    const trimmed = spokenTranscript.trim();
    if (!trimmed) {
      setAudioError("Veuillez prononcer ou saisir votre réponse en français avant d'envoyer.");
      return;
    }

    handleStopListening();
    isEvaluatingRef.current = true;
    setIsEvaluating(true);
    setAudioError(null);

    // Record user activity locally
    onRecordAnswer(topic.id, topic.title, topic.level);

    // Check for expression reuse
    topic.keyExpressions.forEach(exp => {
      if (trimmed.toLowerCase().includes(exp.phrase.toLowerCase())) {
        onReuseExpression(exp.phrase);
      }
    });

    const conversationHistory = history.flatMap(item => [
      { role: 'assistant' as const, content: item.question },
      ...(item.userAnswer ? [{ role: 'user' as const, content: item.userAnswer }] : [])
    ]);

    try {
      const evaluation = await evaluateSpokenAnswer(
        trimmed,
        topic,
        currentQuestion,
        conversationHistory,
        currentQuestionIndex,
        topic.keyExpressions.map(k => k.phrase)
      );

      setCurrentEvaluation(evaluation);

      // Add to conversation history
      setHistory(prev => [
        ...prev,
        {
          id: `ex-${Date.now()}`,
          question: currentQuestion,
          userAnswer: trimmed,
          evaluation
        }
      ]);
    } catch (err: any) {
      console.error('Erreur lors de l\'évaluation:', err);
      setAudioError("Le service IA gratuit a rencontré une indisponibilité temporaire. Vos progrès sont bien sauvegardés.");
    } finally {
      isEvaluatingRef.current = false;
      setIsEvaluating(false);
    }
  };

  const handleContinueNextQuestion = () => {
    if (!currentEvaluation) return;

    const nextQ = currentEvaluation.nextQuestion;
    setCurrentQuestion(nextQ);
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentEvaluation(null);
    setSpokenTranscript('');
    setIsEditingTranscript(false);

    if (autoSpeakQuestion && sessionActive) {
      speakText(nextQ);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Bar: Back & Topic Context */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Changer de sujet</span>
        </button>

        <div className="flex items-center space-x-2">
          {sessionActive ? (
            <button
              onClick={handlePauseSession}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition-colors"
              title="Mettre en pause la session orale"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Mettre en pause</span>
            </button>
          ) : (
            <button
              onClick={handleResumeSession}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
              title="Reprendre la session orale"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Reprendre</span>
            </button>
          )}

          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Niveau {topic.subLevel || topic.level}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Échange #{currentQuestionIndex + 1}
          </span>
        </div>
      </div>

      {/* Topic Card Info with speaking objective */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
              {topic.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {topic.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
              Grammaire : {topic.targetGrammar}
            </span>
          </div>
        </div>

        {/* Short Speaking Objective */}
        {topic.speakingObjective && (
          <div className="mt-2.5 flex items-start gap-2 text-xs text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-2.5">
            <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-200">Objectif oral : </span>
              <span>{topic.speakingObjective}</span>
            </div>
          </div>
        )}

        {/* Suggested Expressions for this topic */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Expressions authentiques suggérées :</span>
          {topic.keyExpressions.map((exp, i) => (
            <button
              key={i}
              onClick={() => {
                setSpokenTranscript(prev => (prev ? `${prev} ${exp.phrase}` : exp.phrase));
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-800/50 transition-colors cursor-pointer"
              title={`${exp.context} ${exp.arabicMeaning ? `(${exp.arabicMeaning})` : ''} — Ex: ${exp.example}`}
            >
              « {exp.phrase} »
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversational Turn: ACTIVE QUESTION */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-slate-750 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Tutor Avatar & Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white text-base font-bold">FR</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Tuteur Parlons Français</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pratique continue
                </span>
              </div>
              <p className="text-xs text-slate-400">Écoutez la question et répondez naturellement à voix haute</p>
            </div>
          </div>

          {/* Voice Controls: Speed & Audio Repeat Question */}
          <div className="flex items-center space-x-2">
            {/* Speed pills */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-[11px] border border-slate-700">
              <button
                onClick={() => handleSpeedChange(0.8)}
                className={`px-2 py-0.5 rounded ${speechRate === 0.8 ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                title="Vitesse lente (0.8x)"
              >
                0.8x
              </button>
              <button
                onClick={() => handleSpeedChange(0.95)}
                className={`px-2 py-0.5 rounded ${speechRate === 0.95 ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                title="Vitesse normale (1.0x)"
              >
                1.0x
              </button>
              <button
                onClick={() => handleSpeedChange(1.15)}
                className={`px-2 py-0.5 rounded ${speechRate === 1.15 ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                title="Vitesse rapide (1.15x)"
              >
                1.15x
              </button>
            </div>

            {/* Repeat Question Button */}
            <button
              onClick={handleToggleSpeakCurrentQuestion}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSpeakingQuestion
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
              }`}
              title="Réécouter la question posée par le tuteur (Repeat Question)"
            >
              {isSpeakingQuestion ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Réécouter la question</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* The Question Text in Prominent Typography */}
        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-750">
          <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
            « {currentQuestion} »
          </p>
        </div>

        {/* Live Audio Waves indicator when tutor is speaking */}
        {isSpeakingQuestion && (
          <div className="mt-3 flex items-center justify-center space-x-1.5 py-1">
            <span className="w-1.5 bg-blue-400 rounded-full animate-soundwave-1"></span>
            <span className="w-1.5 bg-indigo-400 rounded-full animate-soundwave-2"></span>
            <span className="w-1.5 bg-blue-300 rounded-full animate-soundwave-3"></span>
            <span className="w-1.5 bg-purple-400 rounded-full animate-soundwave-4"></span>
            <span className="w-1.5 bg-blue-500 rounded-full animate-soundwave-5"></span>
            <span className="text-xs text-blue-300 ml-2 font-medium">Lecture orale de la question en cours...</span>
          </div>
        )}
      </div>

      {/* FEEDBACK COMPONENT: Shown when an answer has just been evaluated */}
      {currentEvaluation ? (
        <FeedbackCard
          result={currentEvaluation}
          onContinue={handleContinueNextQuestion}
          onSaveExpression={onSaveExpression}
          onSaveError={onSaveError}
          isContinuing={isEvaluating}
        />
      ) : (
        /* VOICE RECORDING & USER RESPONSE PANEL */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Votre réponse à l'oral
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              {isListening ? 'Microphone actif (en écoute)' : 'Prêt pour votre prise de parole'}
            </span>
          </div>

          {/* Large Interactive Microphone Centerpiece with START / STOP Controls */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping"></div>
              )}
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-8 ring-rose-500/20'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 ring-8 ring-blue-500/10'
                }`}
                title={isListening ? 'Arrêter l\'enregistrement (Stop)' : 'Démarrer la prise de parole (Start)'}
              >
                {isListening ? (
                  <>
                    <Square className="w-8 h-8 fill-white mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 sm:w-9 sm:h-9 mb-1" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Parler</span>
                  </>
                )}
              </button>
            </div>

            {/* Status text under mic */}
            <div className="text-center">
              {isListening ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-rose-400 animate-pulse">
                    Enregistrement de votre voix en cours...
                  </p>
                  <p className="text-xs text-slate-400">
                    Parlez librement en français. Cliquez sur Stop quand vous avez fini votre réponse.
                  </p>
                </div>
              ) : spokenTranscript ? (
                <p className="text-xs text-emerald-400 font-medium">
                  Réponse capturée avec succès. Vous pouvez la réécouter, la modifier ou la soumettre.
                </p>
              ) : (
                <p className="text-xs text-slate-400 max-w-xs">
                  Touchez « Parler » pour démarrer. Vous pouvez parler autant de temps que souhaité.
                </p>
              )}
            </div>
          </div>

          {/* Transcript Display & Replay Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Transcription de votre réponse orale :
              </span>
              <div className="flex items-center space-x-2">
                {/* REPLAY RESPONSE CONTROL: Listen to user's response spoken aloud */}
                {spokenTranscript && (
                  <button
                    onClick={handleToggleReplayUserResponse}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded text-xs transition-colors ${
                      isSpeakingUserResponse
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title="Réécouter ma réponse vocale via la synthèse vocale (Replay Response)"
                  >
                    {isSpeakingUserResponse ? <VolumeX className="w-3.5 h-3.5" /> : <Volume1 className="w-3.5 h-3.5" />}
                    <span>{isSpeakingUserResponse ? 'Arrêter réécoute' : 'Réécouter ma réponse'}</span>
                  </button>
                )}

                {spokenTranscript && (
                  <button
                    onClick={() => {
                      setIsEditingTranscript(!isEditingTranscript);
                      setTimeout(() => transcriptInputRef.current?.focus(), 50);
                    }}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingTranscript ? 'Valider le texte' : 'Corriger / Écrire'}</span>
                  </button>
                )}
              </div>
            </div>

            {isEditingTranscript ? (
              <textarea
                ref={transcriptInputRef}
                value={spokenTranscript}
                onChange={(e) => setSpokenTranscript(e.target.value)}
                placeholder="Vous pouvez ajuster les mots reconnus par le microphone ou saisir votre réponse..."
                rows={3}
                className="w-full p-3 bg-slate-800 border border-blue-500 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            ) : (
              <div 
                onClick={() => {
                  setIsEditingTranscript(true);
                  setTimeout(() => transcriptInputRef.current?.focus(), 50);
                }}
                className={`w-full min-h-[70px] p-3.5 rounded-xl border text-sm leading-relaxed cursor-text transition-colors ${
                  spokenTranscript 
                    ? 'bg-slate-800/80 border-slate-700 text-white' 
                    : 'bg-slate-800/30 border-slate-800 text-slate-400 italic'
                }`}
              >
                {spokenTranscript || "Votre réponse transcrite apparaîtra ici dès que vous commencerez à parler..."}
              </div>
            )}
          </div>

          {/* Audio Error Banner */}
          {audioError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{audioError}</span>
            </div>
          )}

          {/* Send / Evaluate Action Bar with Duplicate Guard */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSpokenTranscript('');
                handleStopListening();
                setAudioError(null);
              }}
              disabled={!spokenTranscript || isEvaluating}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40"
            >
              Effacer la réponse
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={!spokenTranscript.trim() || isEvaluating}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyse pédagogique en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Obtenir le retour & Continuer l'échange</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Previous Exchanges History */}
      {history.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Échanges précédents de cette conversation continue ({history.length})
          </h4>
          <div className="space-y-3">
            {history.map((exchange, idx) => (
              <div key={exchange.id} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-blue-300">Question #{idx + 1}</span>
                  {exchange.evaluation && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {exchange.evaluation.source === 'gemini' ? 'IA Gemini' : 'Tuteur Local'}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 font-medium">« {exchange.question} »</p>
                {exchange.userAnswer && (
                  <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-800 text-slate-200">
                    <span className="text-slate-400 font-medium">Votre réponse : </span>
                    {exchange.userAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
