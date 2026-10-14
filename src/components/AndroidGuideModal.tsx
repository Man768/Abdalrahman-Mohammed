import React from 'react';
import { 
  Smartphone, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Download,
  Settings,
  Wifi,
  WifiOff,
  Cpu,
  Lock
} from 'lucide-react';

interface AndroidGuideProps {
  onBackToApp: () => void;
}

export const AndroidGuide: React.FC<AndroidGuideProps> = ({ onBackToApp }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                0€ Garanti • Zéro Frais • Usage Personnel
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Guide Vocal Android, Architecture Gratuite & Vie Privée
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Configuration de la reconnaissance vocale et de la synthèse vocale française sur Android, fonctionnement hors-ligne et garanties de gratuité.
            </p>
          </div>
        </div>
      </div>

      {/* Online vs Offline Capabilities Matrix (Feature 4 requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <span>Tableau des fonctionnalités : Local vs Connexion Requise</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* 100% Local / Offline */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <WifiOff className="w-4 h-4" />
              <span>100% Local (Sans Internet / 0€)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Bibliothèque de sujets :</strong> Tous les sujets A1 à C2 sont stockés localement dans l'application.</li>
              <li><strong>Répétition espacée (SRS) :</strong> Le calendrier des intervalles (1, 3, 7, 14, 30j) est calculé sur votre appareil.</li>
              <li><strong>Carnet d'expressions & Erreurs :</strong> Sauvegardés dans votre navigateur (`LocalStorage`).</li>
              <li><strong>Tuteur linguistique local de secours :</strong> Détection autonome des fautes courantes en français sans aucun appel externe.</li>
              <li><strong>Exportation & Restauration JSON :</strong> Sauvegarde complète sans serveur payant.</li>
            </ul>
          </div>

          {/* Requires Internet */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>Connexion Requise (Free Tier / 0€)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Reconnaissance vocale Android (Chrome) :</strong> L'API Web Speech de Google nécessite un accès réseau pour transcrire la voix en texte avec haute précision.</li>
              <li><strong>Analyses approfondies Gemini (Free Tier) :</strong> Les retours avancés et les questions de relance dynamiques interrogent le modèle gratuit côté serveur.</li>
              <li><em>En cas de coupure réseau :</em> Le tuteur local prend automatiquement et instantanément le relais sans blocage.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security & Strict Zero-Cost Guarantee */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Garantie de Sécurité & Clés API Préservées</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Clés API strictement côté serveur :</strong> Aucune clé secrète n'est exposée ou injectée dans le code JavaScript frontend du navigateur.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Modèles gratuits uniquement :</strong> Utilise exclusivement les modèles de la dotation gratuite de Google (<code>gemini-3.1-flash-lite</code> avec repli <code>gemini-3.8-flash</code>). Aucun compte de facturation ni carte bancaire n'est requis.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Anti-gaspillage de quota :</strong> Les requêtes multiples et doubles clics sont verrouillés par le système (`isEvaluatingRef`).</span>
          </li>
        </ul>
      </div>

      {/* 5-Step Android Testing Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <span>Étapes pas-à-pas pour tester la voix sur smartphone Android</span>
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Ouvrez le lien dans Google Chrome sur Android
              </h4>
              <p className="text-slate-300">
                Sur Android, Google Chrome dispose de la meilleure implémentation native de la reconnaissance vocale Web Speech en français.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Autorisez l'accès au microphone
              </h4>
              <p className="text-slate-300">
                Lorsque vous touchez le bouton micro pour la première fois, Chrome affiche une invite : appuyez sur <strong>« Autoriser »</strong> (ou « Lorsque vous utilisez l'application »).
              </p>
              <div className="mt-1 p-2 rounded bg-slate-800 text-[11px] text-slate-400">
                <em>Si refusé par mégarde :</em> Touchez l'icône de cadenas à gauche de la barre d'adresse dans Chrome → « Paramètres du site » → activez le microphone.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Vérifiez la langue de reconnaissance Google sur votre téléphone
              </h4>
              <p className="text-slate-300">
                Pour une précision optimale de la dictée française :
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 mt-1">
                <li>Allez dans les <strong>Paramètres</strong> d'Android.</li>
                <li>Rendez-vous dans <strong>Système &gt; Langues et saisie &gt; Saisie vocale</strong>.</li>
                <li>Vérifiez que la reconnaissance vocale Google prend en charge le <strong>Français (France)</strong>.</li>
              </ol>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Optimiser la voix française du tuteur (Synthèse vocale HD)
              </h4>
              <p className="text-slate-300">
                Pour que les questions du tuteur sonnent comme un véritable francophone :
              </p>
              <p className="text-slate-300 mt-1">
                Dans Paramètres &gt; Accessibilité &gt; Sortie de synthèse vocale &gt; Moteur Google : appuyez sur l'engrenage des paramètres &gt; <em>Installer des données vocales</em> &gt; téléchargez la voix <strong>Français</strong> haute qualité.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              5
            </span>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white text-sm">
                Installer l'application sur votre écran d'accueil Android (PWA)
              </h4>
              <p className="text-slate-300">
                Dans Chrome, touchez les trois points en haut à droite (<span className="font-bold">⋮</span>), puis sélectionnez <strong>« Ajouter à l'écran d'accueil »</strong> ou <strong>« Installer l'application »</strong>. L'application s'ouvrira alors en plein écran sans barre de navigation, comme une application native Android !
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBackToApp}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
        >
          Retourner à la pratique orale
        </button>
      </div>
    </div>
  );
};
