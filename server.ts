import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(aiClient),
    cost: '0€ (100% gratuit / Free Tier)'
  });
});

// Conversational feedback endpoint
app.post('/api/evaluate', async (req: Request, res: Response) => {
  const { topicTitle, level, conversationHistory, userSpokenAnswer, targetExpressions } = req.body;

  if (!userSpokenAnswer || typeof userSpokenAnswer !== 'string') {
    return res.status(400).json({ error: 'Réponse vocale requise' });
  }

  // If Gemini API is available, use gemini-3.8-flash for high quality conversational feedback
  if (aiClient) {
    try {
      const prompt = `Tu es un tuteur francophone bienveillant et exigeant pour l'application "Parlons Français".
L'apprenant pratique l'expression orale. Son niveau actuel est ${level || 'B1.2'}.
Le sujet de discussion est : "${topicTitle}".
Expressions clés du sujet ou à réviser : ${JSON.stringify(targetExpressions || [])}.

Historique récent de l'échange :
${(conversationHistory || []).map((msg: any) => `${msg.role === 'assistant' ? 'Tuteur' : 'Apprenant'}: ${msg.content}`).join('\n')}

Dernière réponse orale de l'apprenant :
"${userSpokenAnswer}"

RÈGLES STRICTES :
1. TOUT doit être rédigé en français naturel, chaleureux et direct.
2. Évalue la réponse sur 4 points CONCIS :
   - grammaire : 1 remarque courte et ciblée si nécessaire, ou félicitation si parfait.
   - vocabulaire : 1 suggestion d'enrichissement lexical ou de synonyme plus précis.
   - naturel : 1 suggestion de tournure plus idiomatique/authentique que dirait un Français au quotidien.
   - fluidité : commentaire bref sur la structure de la phrase ou les connecteurs logiques.
3. Ne donne JAMAIS de long modèle de réponse à mémoriser. Encourage l'expression personnelle.
4. Pose UNE SEULE question de relance captivante pour continuer la conversation naturellement en rebondissant sur ce que l'apprenant vient de dire.
5. Indique si l'apprenant a fait une erreur récurrente typique à retenir (ou null).
6. Repère s'il a réutilisé une expression cible (ou propose une expression idiomatique utile tirée de son idée).

Réponds UNIQUEMENT au format JSON strict suivant :
{
  "praise": "Courte phrase d'encouragement authentique (ex: 'Très bien pensé !', 'Excellente nuance !')",
  "grammar": "Remarque brève sur la grammaire ou 'Excellente maîtrise grammaticale'",
  "vocabulary": "Conseil concis de vocabulaire ou synonyme pertinent",
  "naturalPhrasing": "Astuce pour sonner plus français (tournure idiomatique)",
  "fluency": "Remarque sur l'enchaînement ou les connecteurs",
  "nextQuestion": "Une seule question ouverte et naturelle pour rebondir sur son propos",
  "detectedError": {
    "mistake": "extrait ou règle (ex: 'visiter à Paris')",
    "correction": "correction (ex: 'visiter Paris')",
    "explanation": "brève explication"
  } | null,
  "usefulExpression": {
    "french": "expression utile",
    "usage": "comment l'employer"
  }
}`;

      let response;
      try {
        response = await aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });
      } catch (liteErr) {
        // Fallback to gemini-3.8-flash
        response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });
      }

      const text = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json({ source: 'gemini', ...parsed });
      } catch (parseErr) {
        console.error('Failed to parse Gemini response as JSON:', text);
      }
    } catch (apiErr: any) {
      console.warn('Gemini API call failed, falling back to local engine:', apiErr?.message || apiErr);
    }
  }

  // Graceful response telling the client to rely on the rich client-side engine
  return res.json({ source: 'local_fallback', note: 'Mode local actif (0€, zéro clé requise)' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Parlons Français serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();
