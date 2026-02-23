import type { ParticipantAnswers } from "../models/participant.model";

interface OpenAIChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Calls the OpenAI Chat Completions API with the participant's four Ikigai
 * categories and action to generate a short, warm summary in Spanish.
 *
 * Only runs client-side; the key is visible in the browser bundle.
 * For production, move this call to a server or Cloud Function.
 */
export async function generateIkigaiFromAnswers(
  answers: ParticipantAnswers
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error(
      "VITE_OPENAI_API_KEY is not set. Add it to your .env file."
    );
  }

  const systemPrompt = `Eres un coach de propósito de vida experto en la filosofía japonesa del Ikigai.
Tu tarea es leer las respuestas de una persona a las cuatro preguntas del Ikigai y redactar un resumen cálido, personal e inspirador de 2 a 3 frases en español.
El resumen debe reflejar la intersección de sus cuatro áreas y sonar como una frase de propósito significativa y auténtica, no genérica.
Usa tuteo (tú). No menciones explícitamente los cuatro círculos ni uses términos técnicos como "pasión" o "misión". Habla de la persona directamente.`;

  const formatList = (items: string[]) =>
    items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "- (sin respuesta)";

  const userMessage = `Estas son las respuestas de la persona:

Lo que amo hacer:
${formatList(answers.c1)}

En lo que soy bueno:
${formatList(answers.c2)}

Lo que el mundo necesita y me importa:
${formatList(answers.c3)}

Por lo que me pueden pagar:
${formatList(answers.c4)}

Compromiso de acción:
${answers.action.trim() || "(sin respuesta)"}

Escribe el resumen de su Ikigai en 2–3 frases.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as OpenAIChatResponse;
  const content = data.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI returned an empty response.");
  return content;
}
