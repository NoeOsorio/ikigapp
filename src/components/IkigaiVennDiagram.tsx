import { useState } from "react";

const CIRCLES = [
  {
    id: "love",
    label: "Lo que amas",
    cx: 200,
    cy: 150,
    color: "#e8829a",
    darkColor: "#3d1f28",
  },
  {
    id: "good",
    label: "En lo que eres bueno",
    cx: 350,
    cy: 150,
    color: "#4a8c5c",
    darkColor: "#1a3325",
  },
  {
    id: "need",
    label: "Lo que el mundo necesita",
    cx: 200,
    cy: 300,
    color: "#c4622d",
    darkColor: "#2d1a0e",
  },
  {
    id: "pay",
    label: "Por lo que te pueden pagar",
    cx: 350,
    cy: 300,
    color: "#4a6fa5",
    darkColor: "#0e1e35",
  },
];

const INTERSECTIONS = [
  {
    id: "passion",
    label: "Pasión",
    description: "Lo que amas + en lo que eres bueno",
    x: 275,
    y: 130,
  },
  {
    id: "mission",
    label: "Misión",
    description: "Lo que amas + lo que el mundo necesita",
    x: 180,
    y: 225,
  },
  {
    id: "profession",
    label: "Profesión",
    description: "En lo que eres bueno + por lo que te pagan",
    x: 370,
    y: 225,
  },
  {
    id: "vocation",
    label: "Vocación",
    description: "Lo que el mundo necesita + por lo que te pagan",
    x: 275,
    y: 320,
  },
  {
    id: "ikigai",
    label: "Ikigai",
    description: "La intersección de los cuatro círculos",
    x: 275,
    y: 225,
  },
];

export default function IkigaiVennDiagram() {
  const [hoveredIntersection, setHoveredIntersection] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-[600px] mx-auto">
      <svg
        viewBox="0 0 550 450"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {CIRCLES.map((c) => (
            <radialGradient key={c.id} id={`grad-${c.id}`}>
              <stop offset="0%" stopColor={c.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0.05" />
            </radialGradient>
          ))}
        </defs>

        {CIRCLES.map((c) => (
          <circle
            key={c.id}
            cx={c.cx}
            cy={c.cy}
            r="100"
            fill={`url(#grad-${c.id})`}
            stroke={c.color}
            strokeWidth="2"
            opacity="0.8"
          />
        ))}

        {CIRCLES.map((c) => (
          <text
            key={`label-${c.id}`}
            x={c.cx}
            y={c.cy < 200 ? c.cy - 115 : c.cy + 125}
            textAnchor="middle"
            className="text-xs font-medium fill-current"
            style={{ color: c.darkColor }}
          >
            {c.label}
          </text>
        ))}

        {INTERSECTIONS.map((int) => (
          <g key={int.id}>
            <circle
              cx={int.x}
              cy={int.y}
              r={int.id === "ikigai" ? "28" : "24"}
              fill={hoveredIntersection === int.id ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.75)"}
              stroke={int.id === "ikigai" ? "#2d1f0e" : "rgba(45, 31, 14, 0.2)"}
              strokeWidth={hoveredIntersection === int.id ? "2.5" : "1.5"}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredIntersection(int.id)}
              onMouseLeave={() => setHoveredIntersection(null)}
            />
            <text
              x={int.x}
              y={int.y + 4}
              textAnchor="middle"
              className={`text-[0.65rem] font-semibold fill-current pointer-events-none ${
                int.id === "ikigai" ? "text-dawn-dark" : "text-dawn-dark/80"
              }`}
            >
              {int.label}
            </text>
          </g>
        ))}
      </svg>

      {hoveredIntersection && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-xl px-4 py-3 shadow-lg border border-dawn-accent/20 max-w-[280px] text-center animate-fade-in">
          <p className="text-xs font-semibold text-dawn-dark mb-1">
            {INTERSECTIONS.find((i) => i.id === hoveredIntersection)?.label}
          </p>
          <p className="text-[0.7rem] text-dawn-muted">
            {INTERSECTIONS.find((i) => i.id === hoveredIntersection)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
