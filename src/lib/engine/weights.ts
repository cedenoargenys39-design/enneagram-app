import { TypeId, Instinct } from "@/lib/types/enneagram";

export const ALL_TYPES: TypeId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const ALL_INSTINCTS: Instinct[] = ["SP", "SO", "SX"];

// Piso mínimo de verosimilitud para que ningún tipo llegue nunca a probabilidad cero
// (evita que un error temprano elimine irreversiblemente una hipótesis, ver sección de
// problemas metodológicos: riesgo de sesgo temprano del bloque de Centro).
const FLOOR = 0.03;

/**
 * Recibe un vector parcial (solo los tipos con señal fuerte) y devuelve
 * un vector completo sobre los 9 tipos, normalizado a que sume 1.
 */
export function expandTypeWeights(
  partial: Partial<Record<TypeId, number>>
): Record<TypeId, number> {
  const raw: Record<TypeId, number> = {} as Record<TypeId, number>;
  for (const t of ALL_TYPES) {
    raw[t] = Math.max(partial[t] ?? FLOOR, FLOOR);
  }
  const sum = ALL_TYPES.reduce((acc, t) => acc + raw[t], 0);
  const normalized: Record<TypeId, number> = {} as Record<TypeId, number>;
  for (const t of ALL_TYPES) {
    normalized[t] = raw[t] / sum;
  }
  return normalized;
}

export function expandInstinctWeights(
  partial: Partial<Record<Instinct, number>>
): Record<Instinct, number> {
  const raw: Record<Instinct, number> = {} as Record<Instinct, number>;
  for (const i of ALL_INSTINCTS) {
    raw[i] = Math.max(partial[i] ?? 0.05, 0.05);
  }
  const sum = ALL_INSTINCTS.reduce((acc, i) => acc + raw[i], 0);
  const normalized: Record<Instinct, number> = {} as Record<Instinct, number>;
  for (const i of ALL_INSTINCTS) {
    normalized[i] = raw[i] / sum;
  }
  return normalized;
}

// Mapea cada tipo a su centro, para construir las preguntas de filtro inicial (bloque "center").
export const TYPE_TO_CENTER: Record<TypeId, "instintivo" | "emocional" | "mental"> = {
  8: "instintivo",
  9: "instintivo",
  1: "instintivo",
  2: "emocional",
  3: "emocional",
  4: "emocional",
  5: "mental",
  6: "mental",
  7: "mental",
};

export function centerWeights(
  center: "instintivo" | "emocional" | "mental",
  strong = 0.22,
  weak = 0.06
): Partial<Record<TypeId, number>> {
  const partial: Partial<Record<TypeId, number>> = {};
  for (const t of ALL_TYPES) {
    partial[t] = TYPE_TO_CENTER[t] === center ? strong : weak;
  }
  return partial;
}

export const LIKERT_6_LABELS = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Algo en desacuerdo",
  "Algo de acuerdo",
  "De acuerdo",
  "Totalmente de acuerdo",
];

const NEUTRAL_BASE = 0.05;

/**
 * Genera las 6 opciones de una pregunta tipo Likert de forma programática a partir de:
 * - positiveTypes: tipos cuya probabilidad SUBE cuanto más de acuerdo esté la persona
 * - negativeTypes: tipos cuya probabilidad SUBE cuanto más EN DESACUERDO esté la persona
 * Esto evita tener que escribir a mano 6 vectores de pesos por cada ítem.
 */
export function buildLikertTypeOptions(
  positiveTypes: Partial<Record<TypeId, number>> = {},
  negativeTypes: Partial<Record<TypeId, number>> = {}
) {
  return LIKERT_6_LABELS.map((label, level) => {
    const f = level / 5; // 0 (total desacuerdo) .. 1 (total acuerdo)
    const partial: Partial<Record<TypeId, number>> = {};
    for (const t of ALL_TYPES) partial[t] = NEUTRAL_BASE;
    for (const [tStr, strength] of Object.entries(positiveTypes)) {
      const t = Number(tStr) as TypeId;
      partial[t] = NEUTRAL_BASE + (strength as number) * f;
    }
    for (const [tStr, strength] of Object.entries(negativeTypes)) {
      const t = Number(tStr) as TypeId;
      partial[t] = NEUTRAL_BASE + (strength as number) * (1 - f);
    }
    return {
      text: label,
      typeWeights: expandTypeWeights(partial),
    };
  });
}

/**
 * Igual que buildLikertTypeOptions pero para el bloque de subtipo: genera pesos de
 * instinto (SP/SO/SX) en lugar de tipo. Las preguntas de subtipo no aportan señal de
 * tipo, por lo que su vector de tipo se deja neutro (uniforme).
 */
export function buildLikertInstinctOptions(
  positiveInstincts: Partial<Record<Instinct, number>> = {},
  negativeInstincts: Partial<Record<Instinct, number>> = {}
) {
  return LIKERT_6_LABELS.map((label, level) => {
    const f = level / 5;
    const partial: Partial<Record<Instinct, number>> = {};
    for (const i of ALL_INSTINCTS) partial[i] = NEUTRAL_BASE;
    for (const [iStr, strength] of Object.entries(positiveInstincts)) {
      const i = iStr as Instinct;
      partial[i] = NEUTRAL_BASE + (strength as number) * f;
    }
    for (const [iStr, strength] of Object.entries(negativeInstincts)) {
      const i = iStr as Instinct;
      partial[i] = NEUTRAL_BASE + (strength as number) * (1 - f);
    }
    return {
      text: label,
      typeWeights: expandTypeWeights({}),
      instinctWeights: expandInstinctWeights(partial),
    };
  });
}

/** Construye las opciones (2 o 3) de una pregunta de elección forzada entre tipos. */
export function buildForcedChoiceTypeOptions(
  choices: { text: string; type: TypeId; strength?: number }[]
) {
  return choices.map((c) => ({
    text: c.text,
    typeWeights: expandTypeWeights({ [c.type]: c.strength ?? 0.75 } as Partial<
      Record<TypeId, number>
    >),
  }));
}

/** Construye las opciones (2 o 3) de una pregunta de elección forzada entre instintos. */
export function buildForcedChoiceInstinctOptions(
  choices: { text: string; instinct: Instinct; strength?: number }[]
) {
  return choices.map((c) => ({
    text: c.text,
    typeWeights: expandTypeWeights({}),
    instinctWeights: expandInstinctWeights({
      [c.instinct]: c.strength ?? 0.8,
    } as Partial<Record<Instinct, number>>),
  }));
}
