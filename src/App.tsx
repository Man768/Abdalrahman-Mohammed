/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CEFRLevel, Topic, TOPICS } from './data/topics';
import { 
  getUserProgress, 
  UserProgress, 
  updateCurrentLevel,
  recordSpokenAnswer,
  saveUsefulExpression,
  recordDetectedMistake,
  incrementExpressionReuse
} from './services/storageService';
import { Header } from './components/Header';
import { LevelModal } from './components/LevelModal';
import { TopicList } from './components/TopicList';
import { SpeakingRoom } from './components/SpeakingRoom';
import { ReviewMode } from './components/ReviewMode';
import { ProgressView } from './components/ProgressView';
import { AndroidGuide } from './components/AndroidGuideModal';

export default function App() {
  const [userData, setUserData] = useState<UserProgress>(getUserProgress());
  const [currentTab, setCurrentTab] = useState<'topics' | 'review' | 'progress' | 'guide'>('topics');
  const [activeLevelFilter, setActiveLevelFilter] = useState<CEFRLevel | 'ALL'>('B1'); // Defaults to user's B1 level
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);
  const [activeSpeakingTopic, setActiveSpeakingTopic] = useState<Topic | null>(null);

  // Sync state with storage on mount and refresh
  const refreshUserData = () => {
    setUserData(getUserProgress());
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const handleSelectLevel = (level: CEFRLevel, subLevel: string) => {
    updateCurrentLevel(level, subLevel);
    setActiveLevelFilter(level);
    refreshUserData();
  };

  const handleSelectTopicToPractice = (topic: Topic) => {
    setActiveSpeakingTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitPractice = () => {
    setActiveSpeakingTopic(null);
    refreshUserData();
  };

  const handleRecordAnswer = (topicId: string, topicTitle: string, level: CEFRLevel) => {
    recordSpokenAnswer(topicId, topicTitle, level);
    refreshUserData();
  };

  const handleSaveExpression = (phrase: string, context: string, example: string) => {
    saveUsefulExpression(
      phrase,
      context,
      example,
      activeSpeakingTopic ? activeSpeakingTopic.title : undefined,
      activeSpeakingTopic ? activeSpeakingTopic.level : userData.currentLevel
    );
    refreshUserData();
  };

  const handleSaveError = (mistake: string, correction: string, explanation: string) => {
    recordDetectedMistake(mistake, correction, explanation);
    refreshUserData();
  };

  const handleReuseExpression = (phrase: string) => {
    incrementExpressionReuse(phrase);
    refreshUserData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setActiveSpeakingTopic(null);
          setCurrentTab(tab);
        }}
        currentLevel={userData.currentLevel}
        subLevel={userData.subLevel}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
        streakDays={userData.streakDays}
        totalAnswers={userData.totalAnswersSpoken}
        isPracticing={Boolean(activeSpeakingTopic)}
        onExitPractice={handleExitPractice}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* If user is actively practicing a topic */}
        {activeSpeakingTopic ? (
          <SpeakingRoom
            topic={activeSpeakingTopic}
            onExit={handleExitPractice}
            onRecordAnswer={handleRecordAnswer}
            onSaveExpression={handleSaveExpression}
            onSaveError={handleSaveError}
            onReuseExpression={handleReuseExpression}
          />
        ) : (
          <>
            {/* VIEW 1: TOPICS LIBRARY */}
            {currentTab === 'topics' && (
              <TopicList
                currentLevel={userData.currentLevel}
                subLevel={userData.subLevel}
                practicedTopics={userData.practicedTopics}
                onSelectTopic={handleSelectTopicToPractice}
                activeLevelFilter={activeLevelFilter}
                onFilterLevelChange={(lvl) => setActiveLevelFilter(lvl)}
              />
            )}

            {/* VIEW 2: REVIEW MODE */}
            {currentTab === 'review' && (
              <ReviewMode
                savedExpressions={userData.savedExpressions}
                currentLevel={userData.currentLevel}
                subLevel={userData.subLevel}
                onRefreshData={refreshUserData}
              />
            )}

            {/* VIEW 3: PROGRESS & NOTEBOOK */}
            {currentTab === 'progress' && (
              <ProgressView
                progress={userData}
                onRefreshData={refreshUserData}
                onSelectTopic={handleSelectTopicToPractice}
                onSwitchToReview={() => setCurrentTab('review')}
              />
            )}

            {/* VIEW 4: ANDROID GUIDE & ZERO COST TRANSPARENCY */}
            {currentTab === 'guide' && (
              <AndroidGuide
                onBackToApp={() => setCurrentTab('topics')}
              />
            )}
          </>
        )}
      </main>

      {/* Level Selection Modal */}
      <LevelModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        currentLevel={userData.currentLevel}
        subLevel={userData.subLevel}
        onSelectLevel={handleSelectLevel}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-300">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Parlons Français • Application personnelle d'expression orale • 100% Gratuit & Zéro abonnement
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveSpeakingTopic(null);
                setCurrentTab('guide');
              }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Guide micro Android
            </button>
            <span>•</span>
            <span className="text-slate-300 font-medium">CECRL A1 → C2 (Priorité B1.2)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
