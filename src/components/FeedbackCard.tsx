import React, { useState } from 'react';
import { EvaluationResult } from '../services/feedbackService';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookMarked, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  Plus, 
  Check, 
  Lightbulb, 
  Zap,
  BookmarkPlus
} from 'lucide-react';

interface FeedbackCardProps {
  result: EvaluationResult;
  onContinue: () => void;
  onSaveExpression: (phrase: string, context: string, example: string) => void;
  onSaveError: (mistake: string, correction: string, explanation: string) => void;
  isContinuing: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  result,
  onContinue,
  onSaveExpression,
  onSaveError,
  isContinuing
}) => {
  const [expressionSaved, setExpressionSaved] = useState<boolean>(false);
  const [errorSaved, setErrorSaved] = useState<boolean>(false);

  const handleSaveExp = () => {
    if (result.usefulExpression && !expressionSaved) {
      onSaveExpression(
        result.usefulExpression.french,
        result.usefulExpression.usage,
        result.naturalPhrasing
      );
      setExpressionSaved(true);
    }
  };

  const handleSaveErr = () => {
    if (result.detectedError && !errorSaved) {
      onSaveError(
        result.detectedError.mistake,
        result.detectedError.correction,
        result.detectedError.explanation
      );
      setErrorSaved(true);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fade-in">
      {/* Praise Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Analyse de votre réponse orale
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {result.praise}
            </h3>
          </div>
        </div>

        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 border ${
          result.source === 'gemini'
            ? 'bg-blue-950/60 text-blue-300 border-blue-800/60'
            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
        }`}>
          {result.source === 'gemini' ? (
            <>
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Généré par IA Gemini</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Mode Tuteur Local Hors-ligne</span>
            </>
          )}
        </span>
      </div>

      {/* 4 Pillars of Pedagogical Feedback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Grammaire */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>Grammaire & Syntaxe</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {result.grammar}
          </p>

          {result.detectedError && (
            <div className="mt-2 pt-2 border-t border-slate-700/60 bg-amber-500/10 rounded-lg p-2.5 text-xs border border-amber-500/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-amber-300 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Point à surveiller :</span>
                  </div>
                  <div className="text-slate-300 mt-1">
                    <span className="line-through text-rose-300">{result.detectedError.mistake}</span>
                    {' → '}
                    <span className="text-emerald-300 font-semibold">{result.detectedError.correction}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {result.detectedError.explanation}
                  </p>
                </div>

                <button
                  onClick={handleSaveErr}
                  disabled={errorSaved}
                  className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    errorSaved
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                  title="Enregistrer cette erreur pour la réviser plus tard"
                >
                  {errorSaved ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span>{errorSaved ? 'Noté' : 'Retenir'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Tournure naturelle */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <span>Tournure Naturelle (Comme un natif)</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {result.naturalPhrasing}
          </p>

          {result.usefulExpression && (
            <div className="mt-2 pt-2 border-t border-slate-700/60 bg-blue-950/40 rounded-lg p-2.5 text-xs border border-blue-800/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold uppercase">Expression clé :</span>
                  <p className="text-white font-bold mt-0.5">« {result.usefulExpression.french} »</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{result.usefulExpression.usage}</p>
                </div>
                <button
                  onClick={handleSaveExp}
                  disabled={expressionSaved}
                  className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    expressionSaved
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                  title="Ajouter à mon carnet personnel"
                >
                  {expressionSaved ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                  <span>{expressionSaved ? 'Sauvegardé' : 'Carnet'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Vocabulaire */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wide">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>Vocabulaire & Nuance</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {result.vocabulary}
          </p>
        </div>

        {/* 4. Fluidité */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-wide">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Fluidité & Connecteurs</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {result.fluency}
          </p>
        </div>
      </div>

      {/* Next Question Teaser & Primary Continue Action */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">Prêt pour la suite ?</span> Continuez à développer vos idées avec vos propres mots.
        </div>

        <button
          onClick={onContinue}
          disabled={isContinuing}
          className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Question suivante</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
