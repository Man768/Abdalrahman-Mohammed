import React from 'react';
import { CEFRLevel, LEVEL_INFO } from '../data/topics';
import { X, Check, Star } from 'lucide-react';

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: CEFRLevel;
  subLevel: string;
  onSelectLevel: (level: CEFRLevel, subLevel: string) => void;
}

const ALL_LEVELS: { level: CEFRLevel; subLevels: string[]; badge?: string }[] = [
  { level: 'A1', subLevels: ['A1.1', 'A1.2'] },
  { level: 'A2', subLevels: ['A2.1', 'A2.2'] },
  { level: 'B1', subLevels: ['B1.1', 'B1.2'], badge: 'Recommandé (Votre niveau actuel)' },
  { level: 'B2', subLevels: ['B2.1', 'B2.2'], badge: 'Objectif suivant' },
  { level: 'C1', subLevels: ['C1.1', 'C1.2'] },
  { level: 'C2', subLevels: ['C2.1', 'C2.2'] },
];

export const LevelModal: React.FC<LevelModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  subLevel,
  onSelectLevel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Échelle des niveaux CECRL</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cadre Européen Commun de Référence pour les Langues
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {ALL_LEVELS.map(({ level, subLevels, badge }) => {
            const info = LEVEL_INFO[level];
            const isSelected = currentLevel === level;

            return (
              <div
                key={level}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/5'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {info.label}
                      </span>
                      {badge && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          <Star className="w-2.5 h-2.5 fill-blue-300" />
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      {info.description}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      {info.targetAudience}
                    </p>
                  </div>
                </div>

                {/* Sublevel buttons */}
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60">
                  <span className="text-xs text-slate-400 font-medium">Sous-niveaux :</span>
                  {subLevels.map((sub) => {
                    const isSubSelected = currentLevel === level && subLevel === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => {
                          onSelectLevel(level, sub);
                          onClose();
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          isSubSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isSubSelected && <Check className="w-3 h-3" />}
                        <span>{sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
