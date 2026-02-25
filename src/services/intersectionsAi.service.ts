import type { ParticipantAnswers, Intersections } from "../models/participant.model";

interface OpenAIChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Calls the OpenAI Chat Completions API to generate the four Ikigai
 * intersections from the participant's c1–c4 answers. Returns structured
 * strings for Pasión, Misión, Profesión, Vocación.
 */
export async function generateIntersectionsFromAnswers(
  answers: Pick<ParticipantAnswers, "c1" | "c2" | "c3" | "c4">
): Promise<Intersections> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error(
      "VITE_OPENAI_API_KEY is not set. Add it to your .env file."
    );
  }

  const systemPrompt = `Eres un coach de propósito experto en el modelo Ikigai.
Tu tarea es generar las CUATRO intersecciones del Ikigai a partir de las respuestas de la persona.
Debes devolver ÚNICAMENTE un JSON válido con exactamente estas cuatro claves (en español): "pasion", "mision", "profesion", "vocacion".
Cada valor debe ser una oración o frase corta (1-2 frases) en español, específica para esta persona, en tuteo (tú).

Definiciones que debes seguir:
- **Pasión** = lo que amas + en lo que eres bueno: actividades que disfrutas y se te dan bien.
- **Misión** = lo que amas + lo que el mundo necesita: causas en las que te gustaría aportar sentido.
- **Profesión** = en lo que eres bueno + por lo que te pagan: aquello que puede sostenerte económicamente.
- **Vocación** = lo que el mundo necesita + por lo que te pagan: formas de servir al mundo que también son sostenibles.

Sé concreto y personal. No repitas las listas; sintetiza en una frase por intersección.`;

  const formatList = (items: string[]) =>
    items.length > 0 ? items.map((i) => `- ${i}`).join("\n") : "- (sin respuesta)";

  const userMessage = `Estas son las respuestas de la persona:

Lo que amo hacer (c1):
${formatList(answers.c1)}

En lo que soy bueno (c2):
${formatList(answers.c2)}

Lo que el mundo necesita (c3):
${formatList(answers.c3)}

Por lo que me pueden pagar (c4):
${formatList(answers.c4)}

Devuelve solo el JSON con las cuatro claves: pasion, mision, profesion, vocacion. Sin markdown ni texto extra.`;

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
      max_tokens: 500,
      temperature: 0.6,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as OpenAIChatResponse;
  const content = data.choices[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenAI returned an empty response.");

  const parsed = parseIntersectionsJson(content);
  if (!parsed) throw new Error("OpenAI response was not valid JSON with four intersection fields.");
  return parsed;
}

function parseIntersectionsJson(raw: string): Intersections | null {
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  let data: unknown;
  try {
    data = JSON.parse(cleaned);
  } catch {
    return null;
  }
  if (data == null || typeof data !== "object" || Array.isArray(data)) return null;
  const o = data as Record<string, unknown>;
  const pasion = o.pasion; const mision = o.mision;
  const profesion = o.profesion; const vocacion = o.vocacion;
  if (
    typeof pasion === "string" &&
    typeof mision === "string" &&
    typeof profesion === "string" &&
    typeof vocacion === "string"
  ) {
    return { pasion, mision, profesion, vocacion };
  }
  return null;
}
