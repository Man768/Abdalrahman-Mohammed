import React, { useState, useMemo } from 'react';
import { CEFRLevel, Topic, TOPICS, TopicCategory, LEVEL_INFO } from '../data/topics';
import { PracticedTopicRecord } from '../services/storageService';
import { Search, Sparkles, Mic, CheckCircle2, ChevronRight, BookOpen, Clock, Target, ArrowUpDown, Filter } from 'lucide-react';

interface TopicListProps {
  currentLevel: CEFRLevel;
  subLevel: string;
  practicedTopics: Record<string, PracticedTopicRecord>;
  onSelectTopic: (topic: Topic) => void;
  onFilterLevelChange: (level: CEFRLevel | 'ALL') => void;
  activeLevelFilter: CEFRLevel | 'ALL';
}

const ALL_CATEGORIES: (TopicCategory | 'Toutes')[] = [
  'Toutes',
  'Vie quotidienne & Expériences',
  'Famille & Relations humaines',
  'Éducation & Vie étudiante',
  'Travail & Vie professionnelle',
  'Voyages & Culture',
  'Sciences & Technologies',
  'Environnement & Société',
  'Livres, Cinéma & Actualités',
  'Opinions, Arguments & Débats'
];

export const TopicList: React.FC<TopicListProps> = ({
  currentLevel,
  subLevel,
  practicedTopics,
  onSelectTopic,
  onFilterLevelChange,
  activeLevelFilter
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | 'Toutes'>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'unpracticed_first' | 'default'>('unpracticed_first');

  // Smart selection of next unpracticed topic
  const nextUnpracticedTopic = useMemo(() => {
    // Look first in current user level
    const candidates = TOPICS.filter(t => activeLevelFilter === 'ALL' ? t.level === currentLevel : t.level === activeLevelFilter);
    const unpracticed = candidates.filter(t => !practicedTopics[t.id]);
    if (unpracticed.length > 0) return unpracticed[0];

    // If all are practiced, pick the one practiced longest ago
    const sortedByDate = [...candidates].sort((a, b) => {
      const dateA = practicedTopics[a.id]?.lastPracticed || '';
      const dateB = practicedTopics[b.id]?.lastPracticed || '';
      return dateA.localeCompare(dateB);
    });
    return sortedByDate[0] || TOPICS[0];
  }, [currentLevel, activeLevelFilter, practicedTopics]);

  // Filtered and sorted topics
  const displayedTopics = useMemo(() => {
    let list = TOPICS.filter(topic => {
      // Level filter
      if (activeLevelFilter !== 'ALL' && topic.level !== activeLevelFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'Toutes' && topic.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = topic.title.toLowerCase().includes(q);
        const matchesDesc = topic.description.toLowerCase().includes(q);
        const matchesGrammar = topic.targetGrammar.toLowerCase().includes(q);
        const matchesObjective = topic.speakingObjective.toLowerCase().includes(q);
        const matchesExpressions = topic.keyExpressions.some(e => e.phrase.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesGrammar && !matchesObjective && !matchesExpressions) {
          return false;
        }
      }
      return true;
    });

    // Sort order
    if (sortOrder === 'unpracticed_first') {
      list = [...list].sort((a, b) => {
        const isAPracticed = Boolean(practicedTopics[a.id]);
        const isBPracticed = Boolean(practicedTopics[b.id]);
        if (!isAPracticed && isBPracticed) return -1;
        if (isAPracticed && !isBPracticed) return 1;
        return 0;
      });
    }

    return list;
  }, [activeLevelFilter, selectedCategory, searchQuery, sortOrder, practicedTopics]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Recommended / Next Unpracticed Topic Hero Banner */}
      {nextUnpracticedTopic && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Sujet recommandé non pratiqué ({nextUnpracticedTopic.subLevel || nextUnpracticedTopic.level})
                </span>
                <span className="text-xs text-slate-400">
                  Évitez les répétitions et variez vos discussions
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {nextUnpracticedTopic.title}
              </h2>

              <p className="text-sm text-slate-300">
                {nextUnpracticedTopic.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-medium text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800 flex items-center gap-1">
                  <Target className="w-3 h-3 text-indigo-400" />
                  Objectif : {nextUnpracticedTopic.speakingObjective}
                </span>
                <span className="font-medium text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800">
                  Point clé : {nextUnpracticedTopic.targetGrammar}
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectTopic(nextUnpracticedTopic)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>Démarrer ce sujet</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Level Filters Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Niveaux CECRL (Priorité B1 & B2)
          </h3>
          <span className="text-xs text-slate-400">
            {displayedTopics.length} sujet{displayedTopics.length > 1 ? 's' : ''} disponible{displayedTopics.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Level Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => onFilterLevelChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeLevelFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
            }`}
          >
            Tous les niveaux
          </button>

          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
            const isUserLevel = currentLevel === lvl;
            const isSelected = activeLevelFilter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onFilterLevelChange(lvl)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>{lvl}</span>
                {isUserLevel && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Votre niveau actuel" />
                )}
                {lvl === 'B1' && (
                  <span className="text-[10px] text-blue-200 opacity-80">(B1.2)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé, règle (ex: passé composé, conditionnel, travail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Sort Button (Unpracticed first) */}
          <button
            onClick={() => setSortOrder(prev => prev === 'unpracticed_first' ? 'default' : 'unpracticed_first')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
              sortOrder === 'unpracticed_first'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Trier les sujets non pratiqués en premier"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'unpracticed_first' ? 'Non pratiqués en 1er' : 'Ordre par défaut'}</span>
          </button>
        </div>

        {/* Categories Pills (All 9 Categories) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTopics.map((topic) => {
          const practiceRecord = practicedTopics[topic.id];
          const isUserLevel = topic.level === currentLevel;

          return (
            <div
              key={topic.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all hover:border-slate-600 bg-slate-900/60 backdrop-blur-sm ${
                isUserLevel
                  ? 'border-slate-750 hover:border-blue-500/50'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row: Level + Category + Practice Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      topic.level === 'B1' || topic.level === 'B2'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : topic.level === 'A1' || topic.level === 'A2'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {topic.subLevel || topic.level}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded truncate max-w-[160px]">
                      {topic.category}
                    </span>
                  </div>

                  {practiceRecord ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pratiqué ({practiceRecord.totalExchanges})
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium shrink-0">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Non pratiqué
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                {/* Speaking objective */}
                {topic.speakingObjective && (
                  <div className="bg-indigo-950/20 rounded-lg p-2 border border-indigo-900/30 text-xs text-indigo-300 flex items-start gap-1.5">
                    <Target className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-400" />
                    <span><strong>Objectif :</strong> {topic.speakingObjective}</span>
                  </div>
                )}

                {/* Grammatical Target */}
                <div className="bg-slate-800/40 rounded-lg p-2.5 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Point clé : </span>
                  <span className="text-slate-200">{topic.targetGrammar}</span>
                </div>

                {/* Expressions preview */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Expressions recommandées :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.keyExpressions.slice(0, 3).map((exp, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-900/50"
                        title={exp.arabicMeaning ? `Sens : ${exp.arabicMeaning}` : exp.context}
                      >
                        « {exp.phrase} »
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {topic.followUpQuestions.length + 1} questions orales
                </span>

                <button
                  onClick={() => onSelectTopic(topic)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Démarrer l'oral</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedTopics.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-300">Aucun sujet trouvé</h4>
          <p className="text-xs text-slate-400 mt-1">
            Essayez d'ajuster votre recherche ou de sélectionner « Tous les niveaux ».
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Toutes');
              setSearchQuery('');
              onFilterLevelChange('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
