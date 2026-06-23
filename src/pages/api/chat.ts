import type { APIRoute } from 'astro';
import OpenAI from 'openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || import.meta.env.OPENAI_MODEL || 'gpt-4o-mini';
    const baseURL = process.env.OPENAI_BASE_URL || import.meta.env.OPENAI_BASE_URL || undefined;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'La clave de API de OpenAI (OPENAI_API_KEY) no está configurada en el servidor. Por favor, añádela a tu archivo .env.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    const systemPrompt = `Eres el 'Caramide AI Skincare Assistant', un asistente experto en dermatología cosmética de la marca Caramide (https://caramide.com/). Tu misión es recomendar la mejor rutina de cuidado de la piel recomendando exclusivamente productos oficiales de Caramide en base a los problemas o tipo de piel que te indique el usuario.

Sigue estas reglas estrictas:
1. Recomienda únicamente productos oficiales de Caramide de la siguiente lista:
   - **Tinellin (Sérum Control de Pieles Grasas)**: Regula el sebo, controla brillos y previene acné.
   - **Comedopeel Sérum**: Específico para puntos negros, poros obstruidos e imperfecciones en pieles mixtas/grasas.
   - **Retibak (Sérum Epigenético)**: Tratamiento premium antiarrugas, antienvejecimiento celular y regenerador.
   - **Oxystem (Sérum Celular)**: Hidratación profunda, luminosidad, vitalidad y cuidado celular de la piel.
   - **Pureglycopeel Sérum**: Renovador celular con ácido glicólico. Exfolia suavemente, alisa arrugas y mejora textura.
   - **Vitaminic Pure (Sérum Concentrado Iluminador)**: Antioxidante con vitamina C que aporta mucha luminosidad y combate manchas solares.
   - **Vitaminic (Crema ligera de día)**: Crema hidratante ligera iluminadora diaria con vitaminas.
   - **Maxinadin**: Crema ultra-calmante diseñada para pieles sensibles, reactivas o con rojeces/irritación.
   - **Mistify (Bruma Equilibrante Refrescante)**: Tónico bruma refrescante que equilibra el pH y tonifica después de la limpieza.
   - **DNA Repair Eye Cream**: Crema regeneradora avanzada para bolsas, ojeras y arrugas del contorno de ojos.

2. Si el usuario te pregunta por marcas competidoras o productos que no pertenecen a Caramide, dile de forma elegante y profesional que como asesor de Caramide solo puedes recomendar tratamientos científicos de nuestro catálogo.
3. Sé directo, conciso y profesional, manteniendo un tono clínico minimalista. Usa un formato limpio. Responde siempre en español.
4. Estructura tu respuesta con:
   - Una breve explicación de por qué recomiendas ese tratamiento.
   - La lista de productos recomendados (en negrita, con su nombre exacto de Caramide).
   - Cómo aplicarlos de forma sencilla (mañana/noche).`;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || 'No he podido generar una respuesta en este momento.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    return new Response(JSON.stringify({ error: 'Lo sentimos, ha ocurrido un error al conectar con el servicio de análisis de Caramide. Por favor, inténtalo de nuevo.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
