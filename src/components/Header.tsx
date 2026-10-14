import React from 'react';
import { CEFRLevel } from '../data/topics';
import { Mic, Flame, BookOpen, RotateCcw, Smartphone, Award } from 'lucide-react';

interface HeaderProps {
  currentTab: 'topics' | 'review' | 'progress' | 'guide';
  setCurrentTab: (tab: 'topics' | 'review' | 'progress' | 'guide') => void;
  currentLevel: CEFRLevel;
  subLevel: string;
  onOpenLevelModal: () => void;
  streakDays: number;
  totalAnswers: number;
  isPracticing: boolean;
  onExitPractice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentLevel,
  subLevel,
  onOpenLevelModal,
  streakDays,
  totalAnswers,
  isPracticing,
  onExitPractice
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isPracticing && onExitPractice) {
                  onExitPractice();
                }
                setCurrentTab('topics');
              }}
              className="flex items-center space-x-2 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-rose-500 p-[2px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Mic className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                    Parlons Français
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    100% Gratuit
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Pratique orale quotidienne • Expression spontanée
                </p>
              </div>
            </button>
          </div>

          {/* Stats & Current Level badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Level Badge */}
            <button
              onClick={onOpenLevelModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-blue-900/40 transition-colors text-xs font-medium"
              title="Changer de niveau CECRL"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Niveau {subLevel || currentLevel}</span>
            </button>

            {/* Streak & Answers */}
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{streakDays} j de suite</span>
              </div>
              <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>{totalAnswers} réponses orales</span>
              </div>
            </div>

            {/* Android Guide Button */}
            <button
              onClick={() => setCurrentTab('guide')}
              className={`p-2 rounded-lg border transition-colors ${
                currentTab === 'guide'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
              title="Guide micro & Android"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile & Desktop) */}
        {!isPracticing && (
          <nav className="flex space-x-1 pb-2 overflow-x-auto no-scrollbar text-sm">
            <button
              onClick={() => setCurrentTab('topics')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentTab === 'topics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Sujets de conversation</span>
            </button>
            <button
              onClick={() => setCurrentTab('review')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentTab === 'review'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mode Révision</span>
            </button>
            <button
              onClick={() => setCurrentTab('progress')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentTab === 'progress'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mon Carnet & Erreurs</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
