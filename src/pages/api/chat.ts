import type { APIRoute } from 'astro';
import OpenAI from 'openai';

type ChatRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const SYSTEM_PROMPT = `Eres el 'Caramide AI Skincare Assistant', un asistente experto en dermatología cosmética. Tu misión es recomendar la mejor rutina de cuidado de la piel sugiriendo productos de marcas reconocidas del sector (CeraVe, La Roche-Posay, The Ordinary, Vichy, Bioderma, Eucerin, Neutrogena, Avène, etc.) en función del tipo de piel o la preocupación que indique el usuario.

Reglas estrictas:
1. NO recomiendes productos de la marca Caramide ni de larimide.com. Tu catálogo es el mercado general de skincare dermocosmético.
2. Para CADA producto recomendado incluye SIEMPRE dos enlaces Markdown de búsqueda externos (Amazon España y Google Shopping). El formato exacto debe ser:
   - **[Nombre del Producto]** (Marca) - [Ver en Amazon](https://www.amazon.es/s?k=PRODUCTO+MARCA) | [Ver en Google](https://www.google.com/search?tbm=shop&q=PRODUCTO+MARCA)
   Codifica el nombre y la marca en el query string con '+' entre palabras y sin caracteres especiales.
3. Prioriza productos con buena evidencia clínica (retinol, niacinamida, ácidos AHA/BHA, ceramidas, vitamina C, ácido hialurónico, péptidos, SPF).
4. Si el usuario menciona una alergia o contraindicación, evita ese ingrediente o familia.
5. Sé directo, conciso y profesional, con tono clínico minimalista. Responde siempre en español.
6. Estructura la respuesta en:
   - Una breve justificación de la recomendación (1-2 frases).
   - Rutina de mañana y de noche con los productos y sus enlaces.
   - Un consejo final breve (SPF diario, orden de aplicación, etc.).`;

function readEnv(name: string, fallback = ''): string {
  return process.env[name] || import.meta.env[name] || fallback;
}

async function callOpenRouter(apiKey: string, model: string, messages: ChatMessage[]): Promise<string> {
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://caramide-ai-assistant.vercel.app',
      'X-OpenRouter-Title': 'Caramide AI Skincare Assistant',
    },
  });

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenRouter devolvió una respuesta vacía');
  }
  return content;
}

async function callGemini(apiKey: string, model: string, messages: ChatMessage[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini devolvió una respuesta vacía');
  }
  return text;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Se requiere un array de mensajes.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitized: ChatMessage[] = messages
      .filter(
        (m: unknown): m is ChatMessage =>
          typeof m === 'object' &&
          m !== null &&
          'role' in m &&
          'content' in m &&
          typeof (m as ChatMessage).content === 'string' &&
          ['user', 'assistant', 'system'].includes((m as ChatMessage).role),
      )
      .map((m) => ({ role: m.role, content: m.content }));

    const openRouterKey = readEnv('OPENROUTER_API_KEY');
    const openRouterModel = readEnv('OPENROUTER_MODEL', 'openrouter/free');
    const geminiKey = readEnv('GEMINI_API_KEY');
    const geminiModel = readEnv('GEMINI_MODEL', 'gemini-2.5-flash');

    if (!openRouterKey && !geminiKey) {
      return new Response(
        JSON.stringify({
          error:
            'No hay claves de IA configuradas en el servidor. Define OPENROUTER_API_KEY y/o GEMINI_API_KEY en el archivo .env.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    let reply = '';
    let provider = 'openrouter';
    let usedFallback = false;

    if (openRouterKey) {
      try {
        reply = await callOpenRouter(openRouterKey, openRouterModel, sanitized);
      } catch (error) {
        console.error('OpenRouter falló, usando Gemini como fallback:', error);
        if (!geminiKey) throw error;
        reply = await callGemini(geminiKey, geminiModel, sanitized);
        provider = 'gemini';
        usedFallback = true;
      }
    } else {
      reply = await callGemini(geminiKey, geminiModel, sanitized);
      provider = 'gemini';
    }

    return new Response(JSON.stringify({ reply, provider, fallback: usedFallback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return new Response(
      JSON.stringify({
        error:
          'Lo sentimos, ha ocurrido un error al conectar con el servicio de análisis. Por favor, inténtalo de nuevo.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
