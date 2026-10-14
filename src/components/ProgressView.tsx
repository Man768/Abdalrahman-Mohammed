import React, { useState, useRef } from 'react';
import { 
  UserProgress, 
  toggleExpressionMastered, 
  toggleErrorMastered, 
  saveUsefulExpression,
  resetProgress,
  exportUserDataAsJson,
  importUserDataFromJson
} from '../services/storageService';
import { Topic, TOPICS } from '../data/topics';
import { 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Mic, 
  BookmarkCheck, 
  RotateCcw,
  Sparkles,
  Check,
  Download,
  Upload,
  ShieldCheck,
  Calendar,
  Layers,
  Info
} from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  onRefreshData: () => void;
  onSelectTopic: (topic: Topic) => void;
  onSwitchToReview: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onRefreshData,
  onSelectTopic,
  onSwitchToReview
}) => {
  const [activeTab, setActiveTab] = useState<'expressions' | 'errors' | 'history' | 'backup'>('expressions');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newPhrase, setNewPhrase] = useState<string>('');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [newExample, setNewExample] = useState<string>('');
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleExp = (id: string) => {
    toggleExpressionMastered(id);
    onRefreshData();
  };

  const handleToggleErr = (id: string) => {
    toggleErrorMastered(id);
    onRefreshData();
  };

  const handleAddCustomExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhrase.trim()) return;
    saveUsefulExpression(
      newPhrase.trim(),
      newMeaning.trim() || 'Expression personnalisée',
      newExample.trim() || `Exemple : ${newPhrase.trim()}`,
      'Ajout personnel',
      progress.currentLevel
    );
    setNewPhrase('');
    setNewMeaning('');
    setNewExample('');
    setShowAddModal(false);
    onRefreshData();
  };

  const handleExportUserData = () => {
    try {
      const jsonString = JSON.stringify(progress, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'parlons-francais-backup.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupMessage("Fichier 'parlons-francais-backup.json' téléchargé avec succès !");
      setTimeout(() => setBackupMessage(null), 4000);
    } catch (err: any) {
      console.error("Erreur lors de l'exportation des données :", err);
      setBackupMessage("Erreur lors de l'exportation des données.");
    }
  };

  const handleExportBackup = () => {
    handleExportUserData();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importUserDataFromJson(content);
        if (result.success) {
          onRefreshData();
          setBackupMessage(result.message);
        } else {
          setBackupMessage(result.message);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser vos statistiques locales ? (Cette action est irréversible, pensez à faire une sauvegarde avant)")) {
      resetProgress();
      onRefreshData();
    }
  };

  const practicedList = Object.values(progress.practicedTopics);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Régularité</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {progress.streakDays}
            </span>
            <span className="text-xs text-slate-400 ml-1">jours consécutifs</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Prises de parole</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {progress.totalAnswersSpoken}
            </span>
            <span className="text-xs text-slate-400 ml-1">réponses orales</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Expressions Clés</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {progress.savedExpressions.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">en carnet</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Erreurs Détectées</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {progress.recurringErrors.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">à surveiller</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('expressions')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'expressions'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mon Carnet SRS ({progress.savedExpressions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'errors'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Erreurs Récurrentes ({progress.recurringErrors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sujets Pratiqués ({practicedList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sauvegarde & Confidentialité</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Dedicated button labeled 'Exporter les données' */}
          <button
            onClick={handleExportUserData}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-colors shrink-0 shadow-sm cursor-pointer"
            title="Télécharger une sauvegarde parlons-francais-backup.json"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter les données</span>
          </button>

          {activeTab === 'expressions' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {backupMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{backupMessage}</span>
        </div>
      )}

      {/* TAB 1: EXPRESSIONS NOTEBOOK WITH SRS SCHEDULE */}
      {activeTab === 'expressions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <p>
              Expressions authentiques organisées selon l'algorithme de répétition espacée (1, 3, 7, 14, 30 jours).
            </p>
            <button
              onClick={onSwitchToReview}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Lancer le Mode Révision</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progress.savedExpressions.map((exp) => (
              <div
                key={exp.id}
                className={`p-4 rounded-xl border transition-all ${
                  exp.status === 'MASTERED'
                    ? 'bg-slate-900/40 border-slate-800/80'
                    : exp.status === 'ACTIVE_REVIEW'
                    ? 'bg-slate-900 border-blue-900/40'
                    : 'bg-slate-900 border-purple-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">
                        « {exp.phrase} »
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        exp.status === 'MASTERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : exp.status === 'ACTIVE_REVIEW'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {exp.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {exp.meaning}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleExp(exp.id)}
                    className={`shrink-0 p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      exp.status === 'MASTERED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={exp.status === 'MASTERED' ? 'Rétrograder en révision active' : 'Marquer comme acquise'}
                  >
                    {exp.status === 'MASTERED' ? (
                      <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="mt-2.5 p-2 bg-slate-800/50 rounded-lg text-xs text-slate-300 italic border border-slate-800">
                  {exp.example}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Prochaine révision : {exp.nextReviewDate || 'Dès que possible'} ({exp.intervalDays}j)
                  </span>
                  <span>Réutilisée {exp.timesReused || 0} fois</span>
                </div>
              </div>
            ))}
          </div>

          {progress.savedExpressions.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucune expression enregistrée pour l'instant. Lors de vos conversations orales, touchez « Sauvegarder » sur les expressions suggérées.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECURRING ERRORS */}
      {activeTab === 'errors' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Ces points de vigilance sont automatiquement détectés lors de vos prises de parole pour vous éviter d'ancrer de mauvaises habitudes orales.
          </p>

          <div className="space-y-3">
            {progress.recurringErrors.map((err) => (
              <div
                key={err.id}
                className={`p-4 rounded-xl border transition-all ${
                  err.mastered
                    ? 'bg-slate-900/40 border-slate-800 opacity-70'
                    : 'bg-slate-900 border-rose-900/40 hover:border-rose-700/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {err.occurrences} fois repérée
                      </span>
                      {err.mastered && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ Maîtrisée
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-semibold">
                      <span className="line-through text-rose-400">{err.mistake}</span>
                      <span className="text-slate-400 mx-2">→</span>
                      <span className="text-emerald-300 font-bold">{err.correction}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {err.explanation}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleErr(err.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      err.mastered
                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {err.mastered ? 'Rouvrir' : 'Marquer comme corrigée'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {progress.recurringErrors.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucune erreur récurrente répertoriée ! Continuez vos séances orales.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOPICS HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Historique de vos sujets de conversation explorés sur cet appareil.
          </p>

          <div className="space-y-2.5">
            {practicedList.map((rec) => {
              const fullTopic = TOPICS.find((t) => t.id === rec.topicId);
              return (
                <div
                  key={rec.topicId}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {rec.level}
                      </span>
                      <h4 className="font-bold text-white text-sm">
                        {rec.topicTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400">
                      Dernière pratique : {new Date(rec.lastPracticed).toLocaleDateString('fr-FR')} • {rec.totalExchanges} échanges oraux
                    </p>
                  </div>

                  {fullTopic && (
                    <button
                      onClick={() => onSelectTopic(fullTopic)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Rejouer</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {practicedList.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Vous n'avez pas encore terminé de sujet. Rendez-vous dans la liste des sujets pour démarrer !
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BACKUP, EXPORT & PRIVACY (Feature 5) */}
      {activeTab === 'backup' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Confidentialité & Stockage Local</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vos données d'expression orale (expressions enregistrées, répétitions espacées, erreurs récurrentes et historique des sujets) sont stockées <strong>exclusivement dans le stockage local de votre navigateur (LocalStorage)</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-white">⚠️ Précautions concernant le stockage navigateur :</p>
              <p>• Si vous videz les données de navigation ou le cache de votre navigateur sur votre téléphone Android, vos données locales seront effacées.</p>
              <p>• C'est pourquoi nous mettons à votre disposition ci-dessous un bouton d'exportation pour sauvegarder régulièrement votre carnet au format JSON.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Download className="w-4 h-4" />
                <span>Exporter ma sauvegarde</span>
              </div>
              <p className="text-xs text-slate-300">
                Téléchargez un fichier de sauvegarde <code>.json</code> contenant toutes vos expressions, erreurs et statistiques pour ne jamais rien perdre.
              </p>
              <button
                onClick={handleExportUserData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exporter les données</span>
              </button>
            </div>

            {/* Import Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Upload className="w-4 h-4" />
                <span>Restaurer une sauvegarde</span>
              </div>
              <p className="text-xs text-slate-300">
                Importez un fichier <code>.json</code> précédemment exporté pour restaurer votre carnet sur un nouveau téléphone ou navigateur.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Sélectionner un fichier de sauvegarde</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Stats Option at bottom */}
      <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
        <span>Toutes les données sont conservées localement sur cet appareil.</span>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Réinitialiser les données locales</span>
        </button>
      </div>

      {/* Manual Add Expression Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-white">
              Ajouter une expression au carnet SRS
            </h3>
            <form onSubmit={handleAddCustomExp} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Expression en français *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Prendre du recul"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Signification en français (ou arabe facultatif)
                </label>
                <input
                  type="text"
                  placeholder="ex: Prendre de la distance pour réfléchir (التروي للتفكير)"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Exemple d'utilisation
                </label>
                <input
                  type="text"
                  placeholder="ex: Après cette réunion intense, j'ai besoin de prendre du recul."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
                >
                  Ajouter au carnet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
