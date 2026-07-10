# Test de Eneagrama — v1

Implementación de la arquitectura acordada: Next.js 14 (App Router) + TypeScript +
Prisma + PostgreSQL, con un motor de inferencia bayesiano corriendo en el backend.

## Cómo correrlo

```bash
npm install
cp .env.example .env   # y completar DATABASE_URL con tu Postgres
npx prisma migrate dev --name init
npm run seed            # carga el banco de preguntas en la base de datos
npm run dev
```

Abrir `http://localhost:3000`.

## Qué está implementado (v1)

- **Modelo psicológico completo de los 9 tipos** (`src/lib/types/enneagram.ts`):
  miedo, deseo, motivación inconsciente, fijación, pasión, virtud, mecanismo de
  defensa, líneas de estrés/seguridad, alas, fortalezas, puntos ciegos y
  confusiones típicas — con la base teórica documentada (Riso-Hudson + Naranjo +
  Chestnut).
- **Motor bayesiano** (`src/lib/engine/bayesian-engine.ts`): actualización de
  posterior sobre los 9 tipos y sobre los 3 instintos, detección de
  inconsistencia vía pares espejo, cálculo de confianza, ranking completo,
  cómputo de ala y activación de rama adaptativa cuando hay ambigüedad real.
- **El cálculo corre 100% en el servidor** (rutas `/api/answer` y
  `/api/report/[sessionId]`): el cliente nunca recibe los vectores de peso, solo
  el texto de las opciones, por lo que no se puede manipular el resultado desde
  devtools (tal como se decidió).
- **Banco de preguntas semilla**: 80 ítems reales (no placeholders) organizados en:
  - Bloque 0 — Centro dominante (9 ítems, elección forzada)
  - Bloque 1 — Miedo / Deseo / Defensa (los 9 tipos completos) + Conflicto y
    Estrés-Seguridad (tipos 1, 2, 3, 4, 5, 7, 8, 9 — falta solo el tipo 6 en
    Conflicto) (45 ítems Likert-6, con pares espejo explícitos para detección
    de contradicciones)
  - Bloque 2 — Elección forzada entre virtudes (10 ítems, neutraliza
    deseabilidad social)
  - Bloque 3 — Subtipo instintivo sobre los 8 ejes pedidos (16 ítems Likert-6)
  
  Todas las preguntas están escritas de forma indirecta (situación → qué se
  protege/teme/prioriza), nunca como rasgo autodescriptivo directo.
- **Flujo de usuario completo**: intro → bloque de centro → bloque de tipo (con
  rama adaptativa opcional si hay ambigüedad) → bloque de subtipo → informe.
  Progreso persistido en `localStorage` (retomar sesión) + backend (fuente de
  verdad real).
- **Informe final** con: resumen, tipo principal justificado, miedo, deseo,
  motivación, fijación, pasión, virtud, defensa, comportamiento en estrés y en
  seguridad, ala, subtipo, ranking completo de tipos e instintos, nivel de
  confianza, fortalezas, puntos ciegos y explicación de por qué no se
  seleccionaron los tipos más cercanos.
- **UI**: Next.js + Tailwind con tokens de color light/dark inspirados en
  Linear/Vercel, transiciones con Framer Motion, barra de progreso con tiempo
  estimado, y accesibilidad básica (foco visible, roles de botón).

## Decisiones y compromisos de esta v1 (léase antes de escalar)

1. **80 preguntas, no 120.** El banco fue escrito con las mismas plantillas y
   nivel de rigor descritos en la arquitectura, pero se priorizó entregar un
   sistema end-to-end funcionando. Los 9 tipos ya tienen Miedo, Deseo y
   Defensa completos, y Conflicto / Estrés-Seguridad están completos para 1,
   2, 3, 4, 5, 7, 8 y 9 (falta el ítem de Conflicto del tipo 6). Para llegar a
   120: agregar ese ítem faltante, sumar un segundo ítem por dimensión, y más
   pares espejo. El generador `buildLikertTypeOptions` en `weights.ts` hace
   que agregar un ítem nuevo sea una sola línea (texto + tipos asociados), no
   requiere escribir los 6 vectores de peso a mano.
2. **Subtipo no condicionado al tipo principal todavía.** La arquitectura
   original pedía que las preguntas de subtipo variaran según el tipo principal
   (un SX2 no se pregunta igual que un SX8). En v1 el bloque de subtipo es
   genérico sobre los 8 ejes. Migrar a preguntas condicionadas es straightforward
   con la estructura actual: agregar un campo `applicableTypes?: TypeId[]` a
   `QuestionSeed` y filtrar en la ruta `GET /api/session/[sessionId]`.
3. **"Volver atrás" es local, no revierte el posterior del servidor.** Permite
   releer y recontestar una pregunta anterior, pero el cálculo del servidor no
   se recalcula desde cero al cambiar una respuesta pasada (para eso habría que
   guardar el historial completo de respuestas y recomputar el posterior entero
   cada vez, que es sencillo pero se dejó fuera de esta v1 por alcance).
4. **Tritype**: excluido de esta versión, según lo decidido.
5. **Autenticación de usuario**: no incluida; las sesiones son anónimas
   (`userId` nullable en el modelo `Session`, listo para conectar un sistema de
   auth después).

## Estructura

```
prisma/schema.prisma          Modelo de datos completo
prisma/seed.ts                 Carga el banco de preguntas a la DB
src/lib/types/enneagram.ts     Metadata psicológica de los 9 tipos
src/lib/data/question-bank.ts  Banco de preguntas (fuente de verdad del contenido)
src/lib/engine/weights.ts      Generadores programáticos de vectores de peso
src/lib/engine/bayesian-engine.ts   Motor de inferencia
src/lib/engine/report-generator.ts  Ensamblado del informe final
src/app/api/...                Rutas de backend (sesión, respuesta, informe)
src/app/(páginas)              Intro, cuestionario, informe
src/components/                Componentes de UI reutilizables
```
