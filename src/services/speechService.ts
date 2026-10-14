export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private frenchVoice: SpeechSynthesisVoice | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private speechRate: number = 0.95; // Slightly clear and deliberate for French learner

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public isSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  public loadVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    // Prioritize natural French voices
    const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
    
    // Pick the best default voice
    const preferredNames = ['Google français', 'Thomas', 'Amélie', 'Audrey', 'Virginie', 'Hortense', 'French'];
    let chosen: SpeechSynthesisVoice | null = null;

    for (const name of preferredNames) {
      chosen = frenchVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase())) || null;
      if (chosen) break;
    }

    if (!chosen && frenchVoices.length > 0) {
      chosen = frenchVoices[0];
    }

    this.frenchVoice = chosen;
    return frenchVoices;
  }

  public getAvailableFrenchVoices(): SpeechVoiceOption[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices().filter(v => v.lang.startsWith('fr'));
    return voices.map(v => ({
      name: v.name,
      lang: v.lang,
      voice: v
    }));
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.frenchVoice = voice;
  }

  public setRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.4, rate));
  }

  public getRate(): number {
    return this.speechRate;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.synth) {
      if (onError) onError(new Error('Synthèse vocale non disponible'));
      return;
    }

    // Cancel any previous speech
    this.synth.cancel();

    // Clean text to pronounce French naturally
    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;

    if (this.frenchVoice) {
      utterance.voice = this.frenchVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Erreur synthèse vocale:', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Échec de lecture vocale:', e);
      if (onError) onError(e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ): boolean {
    if (this.isListening) {
      this.stopListening();
    }

    const SpeechRecClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecClass) {
      onError('Reconnaissance vocale non prise en charge sur ce navigateur. Utilisez Chrome ou utilisez la dictée de votre clavier.');
      return false;
    }

    try {
      this.recognition = new SpeechRecClass();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      let finalAccumulated = '';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalAccumulated += (finalAccumulated ? ' ' : '') + transcriptChunk;
          } else {
            interimTranscript += transcriptChunk;
          }
        }
        const fullCurrent = (finalAccumulated + ' ' + interimTranscript).trim();
        onTranscript(fullCurrent, false);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Erreur reconnaissance vocale:', event.error);
        let msg = 'Une erreur est survenue lors de l\'écoute.';
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          msg = 'Accès au micro refusé. Veuillez autoriser le micro dans les paramètres du navigateur.';
        } else if (event.error === 'no-speech') {
          msg = 'Aucune parole détectée. Veuillez parler plus distinctement ou rapprocher le micro.';
        } else if (event.error === 'network') {
          msg = 'Erreur réseau pour la reconnaissance vocale. Sur Android / Chrome, la dictée requiert un accès réseau.';
        } else if (event.error === 'audio-capture') {
          msg = 'Microphone introuvable ou non fonctionnel.';
        }
        onError(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      console.error('Erreur démarrage reconnaissance:', err);
      onError('Impossible d\'activer le microphone. Vérifiez les autorisations.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
