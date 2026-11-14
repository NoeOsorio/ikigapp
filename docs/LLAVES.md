# Llaves de Ikigapp

## Dónde viven

| Llave | Dónde | Nota |
|---|---|---|
| OpenAI (intersecciones y resumen) | Llavero de macOS, ítem `ikigapp-openai-api-key`, cuenta `$USER` | Movida del `.env` el 2026-11-14 (NOE-560), comprobada por hash. Hoy el código la lee de `VITE_OPENAI_API_KEY`, que la mete en el navegador: no se inyecta en ningún build hasta que la llamada viva en un servidor. |
| Configuración web de Firebase (`VITE_FIREBASE_*`) | `.env` local | No es secreta: Firebase la diseña para ir en el navegador. La protección real son las reglas de Firestore. |

En la nube no hay llaves todavía: la app no está desplegada (no hay configuración de Vercel ni Firebase Hosting en el repo).

Revisión de fugas al moverla (2026-11-14): `.env` nunca entró a git (`git log --all -- .env` vacío), el `dist/` local no contiene `sk-`, y no hay despliegue.

## Plan de emergencia (si una llave se filtra)

1. Crear una llave nueva en el panel del proveedor, con límite de gasto.
2. Cambiarla en el Llavero: `pbpaste | tr -d '\n'` hacia `security -i` (nunca como argumento de comando).
3. Borrar la llave vieja en el panel del proveedor.
4. Buscar otras copias: `.env*`, `dist/`, historial de git, capturas, logs.
5. Revisar el uso y el gasto de los últimos días en el panel del proveedor.
6. Anotarlo en Linear, proyecto Ikigapp.

## Rotación mensual

El día 1 de cada mes, dentro del ticket «Rotación mensual de llaves»: crear llave nueva, cambiarla en el Llavero, borrar la vieja y comprobar que la app sigue generando intersecciones.
