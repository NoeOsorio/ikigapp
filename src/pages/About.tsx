import { Link } from "react-router-dom";
import { sessionUrl } from "../lib/routes";
import IkigaiVennDiagram from "../components/IkigaiVennDiagram";

const STEPS = [
  {
    num: 1,
    title: "Dibuja tu 'flor' de ikigai",
    content:
      "En una hoja dibuja cuatro círculos que se crucen formando una especie de flor (diagrama de Venn de 4 círculos). Nombra cada círculo así: 'Lo que amo', 'En lo que soy bueno', 'Lo que el mundo necesita' y 'Por lo que me pueden pagar'.",
    season: "spring" as const,
  },
  {
    num: 2,
    title: "Explora 'lo que amas'",
    content:
      "En el círculo 'Lo que amo' escribe 3–10 cosas que realmente disfrutas hacer: hobbies, actividades, temas que te apasionan. Puedes ayudarte con preguntas: ¿en qué actividades pierdo la noción del tiempo?, ¿qué me encantaba hacer de niño?, ¿de qué temas no me canso de hablar?",
    season: "spring" as const,
  },
  {
    num: 3,
    title: "Explora 'en lo que eres bueno'",
    content:
      "En el círculo 'En lo que soy bueno' anota habilidades en las que tienes facilidad: técnicas (por ejemplo, programar, diseñar) y personales (escuchar, liderar, comunicar). Si dudas, pide feedback a personas cercanas: '¿En qué dirías que destaco?', y añade lo que se repita.",
    season: "summer" as const,
  },
  {
    num: 4,
    title: "Explora 'lo que el mundo necesita'",
    content:
      "En el círculo 'Lo que el mundo necesita' escribe problemas, necesidades o causas que te importen: educación, salud mental, medio ambiente, comunidad local, etc. No pienses aún en soluciones perfectas, solo en qué te duele o te gustaría ver mejor en tu entorno o en la sociedad.",
    season: "autumn" as const,
  },
  {
    num: 5,
    title: "Explora 'por lo que te pueden pagar'",
    content:
      "En el círculo 'Por lo que me pueden pagar' apunta actividades o servicios por los que hoy te pagan o podrían razonablemente pagarte en tu contexto. Incluye tanto cosas que ya haces (tu trabajo actual) como servicios potenciales basados en tus habilidades: asesorías, cursos, productos, creación de contenido, etc.",
    season: "winter" as const,
  },
  {
    num: 6,
    title: "Identifica las intersecciones",
    content:
      "Mira las zonas donde se cruzan los círculos y saca conclusiones: Pasión = lo que amas + en lo que eres bueno; Misión = lo que amas + lo que el mundo necesita; Profesión = en lo que eres bueno + por lo que te pagan; Vocación = lo que el mundo necesita + por lo que te pagan. Puedes escribir listas cortas en cada intersección; por ejemplo, si 'enseñar' está en lo que amas y en lo que eres bueno, eso apunta a tu pasión.",
    season: "spring" as const,
  },
  {
    num: 7,
    title: "Formula una primera frase de ikigai",
    content:
      "Revisa tus intersecciones y redacta 1–3 frases que describan un posible propósito, por ejemplo: 'Ayudar a jóvenes a desarrollar habilidades digitales a través de cursos prácticos accesibles'. No busques la frase perfecta; piensa en una 'versión 1.0' que combine pasión, impacto, talento y posibilidad de ingreso.",
    season: "summer" as const,
  },
  {
    num: 8,
    title: "Conviértelo en acciones pequeñas",
    content:
      "El ikigai solo se valida en la práctica: elige una o dos acciones concretas para las próximas semanas alineadas con tu frase (dar una clase piloto, abrir un blog, ofrecer una sesión gratuita, etc.). Después de probar, pregúntate: ¿me da energía?, ¿tiene sentido para otros?, ¿hay potencial de ingresos?, y ajusta tu frase de ikigai en función de lo aprendido.",
    season: "autumn" as const,
  },
  {
    num: 9,
    title: "Repite y ajusta (proceso continuo)",
    content:
      "El ikigai no se 'descubre' un día y ya, se va refinando con autoobservación constante y pequeños experimentos en la vida real. Puedes revisar tu diagrama cada 3–6 meses, actualizar lo que amas, lo que aprendiste que haces bien y cómo cambian las necesidades del mundo o tus oportunidades de ingreso.",
    season: "winter" as const,
  },
];

const SEASON_COLORS = {
  spring: {
    bg: "bg-spring-bg",
    text: "text-spring-dark",
    accent: "text-spring-accent",
    border: "border-spring-accent/20",
  },
  summer: {
    bg: "bg-summer-bg",
    text: "text-summer-dark",
    accent: "text-summer-accent",
    border: "border-summer-accent/20",
  },
  autumn: {
    bg: "bg-autumn-bg",
    text: "text-autumn-dark",
    accent: "text-autumn-accent",
    border: "border-autumn-accent/20",
  },
  winter: {
    bg: "bg-winter-bg",
    text: "text-winter-dark",
    accent: "text-winter-accent",
    border: "border-winter-accent/20",
  },
};

export default function About() {
  return (
    <div className="w-full">
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 relative">
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none font-serif text-[8rem] sm:text-[12rem] text-dawn-accent opacity-[0.12] leading-none tracking-tighter"
          aria-hidden
        >
          生き甲斐
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6 animate-fade-up">
          <p className="text-xs text-dawn-muted tracking-[0.2em] uppercase font-medium">
            Descubre tu propósito
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-dawn-dark tracking-tight font-semibold">
            ¿Qué es el Ikigai?
          </h1>
          <p className="text-base sm:text-lg text-dawn-muted leading-relaxed max-w-xl mx-auto">
            Ikigai (生き甲斐) es un concepto japonés que representa la intersección de lo que amas, en lo que eres bueno, lo que el mundo necesita y por lo que te pueden pagar. 
            <strong className="text-dawn-dark"> No es una fórmula rápida</strong>, sino un proceso de clarificación por pasos.
          </p>
          <div className="pt-6 animate-[fade-up_0.8s_ease_0.2s_both]">
            <Link
              to={sessionUrl()}
              className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-dawn-dark text-white font-display text-base tracking-wide hover:bg-dawn-accent hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-dawn-dark/20 hover:shadow-dawn-accent/30"
            >
              Empezar mi Ikigai →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-dawn-dark mb-4 font-semibold">
              Las cuatro áreas y sus intersecciones
            </h2>
            <p className="text-dawn-muted text-sm max-w-lg mx-auto leading-relaxed">
              El ikigai vive en el centro donde convergen tus cuatro círculos. Pasa el cursor sobre cada intersección para conocer su significado.
            </p>
          </div>
          <IkigaiVennDiagram />
        </div>
      </section>

      <section className="py-20 px-4 bg-linear-to-b from-white/50 to-dawn-bg/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl text-dawn-dark mb-4 font-semibold">
              Los 9 pasos del proceso
            </h2>
            <p className="text-dawn-muted text-sm max-w-lg mx-auto leading-relaxed">
              Aplicar el ikigai es un proceso de autoexploración por pasos. Sigue estos pasos para clarificar cuatro áreas y buscar intersecciones realistas entre ellas.
            </p>
          </div>

          <div className="space-y-8">
            {STEPS.map((step, idx) => {
              const colors = SEASON_COLORS[step.season];
              return (
                <article
                  key={step.num}
                  className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 animate-[fade-up_0.6s_ease_both]`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center font-display text-lg sm:text-xl ${colors.text} font-semibold`}
                    >
                      {step.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-display text-lg sm:text-xl ${colors.text} mb-3 font-semibold`}
                      >
                        {step.title}
                      </h3>
                      <p className={`text-sm sm:text-base ${colors.text} opacity-90 leading-relaxed`}>
                        {step.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-dawn-bg">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-dawn-muted text-sm italic leading-relaxed">
            "El ikigai no se 'descubre' un día y ya; se va refinando con autoobservación y pequeños experimentos en la vida real."
          </p>
          <Link
            to={sessionUrl()}
            className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-dawn-dark text-white font-display text-base tracking-wide hover:bg-dawn-accent hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-dawn-dark/20 hover:shadow-dawn-accent/30"
          >
            Comienza tu proceso →
          </Link>
        </div>
      </section>
    </div>
  );
}
