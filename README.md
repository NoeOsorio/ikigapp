# 🌸 Ikigapp

**Tu ikigai, paso a paso.** Una app web que guía el proceso de autoexploración basado en el modelo de los cuatro círculos: lo que amas, en lo que eres bueno, lo que el mundo necesita y por lo que te pueden pagar.

---

## ¿Qué es el Ikigai?

*Ikigai* (生き甲斐) es un concepto japonés que suele representarse como la intersección de cuatro áreas. **No es una fórmula rápida**, sino un proceso de clarificación por pasos: exploras cada círculo, identificas intersecciones (pasión, misión, vocación, profesión) y luego formulas una frase de propósito y acciones concretas.

| Círculo | Pregunta |
|--------|----------|
| 🌸 **Lo que amas** | ¿En qué actividades pierdes la noción del tiempo? ¿De qué no te cansas de hablar? |
| ☀️ **En lo que eres bueno** | Habilidades técnicas y personales en las que destacas (pide feedback si dudas). |
| 🍂 **Lo que el mundo necesita** | Problemas o causas que te importan: educación, salud, medio ambiente, comunidad… |
| ❄️ **Por lo que te pueden pagar** | Lo que ya te pagan o podría razonablemente pagarte: trabajo actual, asesorías, cursos, contenido. |

Las **intersecciones** dan sentido a la búsqueda: **pasión** (amas + eres bueno), **misión** (amas + mundo necesita), **profesión** (eres bueno + te pagan), **vocación** (mundo necesita + te pagan). El ikigai se va refinando con el tiempo; la app te acompaña en esa primera versión y en el siguiente paso: **una acción concreta** para validarlo en la práctica.

---

## Qué hace esta app

- **Sin backend:** todo el estado vive en la URL (sesión, nombre, pasos, respuestas). Ideal para talleres o uso individual.
- **Flujo guiado:** Join → Lobby (con QR para compartir sesión) → 4 pasos de categorías → Paso de acción → Snapshot para ver, descargar o compartir tu tarjeta de resultado.
- **Estética minimalista:** paleta tipo washi, theming por estación (primavera, verano, otoño, invierno) y tipografía Noto Serif/Sans JP.

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Desarrollo (Vite + HMR)
npm run dev
```

Abre la URL que muestre Vite (por ejemplo `http://localhost:5173`).

```bash
# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

---

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, **nuqs** (estado en query params), html2canvas (export de snapshot), qrcode.react, nanoid.

---

*El ikigai no se “descubre” un día y ya; se va refinando con autoobservación y pequeños experimentos en la vida real.*
