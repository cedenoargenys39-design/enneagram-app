import { TypeId, Instinct } from "@/lib/types/enneagram";
import { ALL_TYPES, ALL_INSTINCTS } from "@/lib/engine/weights";

export type TypePosterior = Record<TypeId, number>;
export type InstinctPosterior = Record<Instinct, number>;

export function uniformTypePosterior(): TypePosterior {
  const p = {} as TypePosterior;
  for (const t of ALL_TYPES) p[t] = 1 / ALL_TYPES.length;
  return p;
}

export function uniformInstinctPosterior(): InstinctPosterior {
  const p = {} as InstinctPosterior;
  for (const i of ALL_INSTINCTS) p[i] = 1 / ALL_INSTINCTS.length;
  return p;
}

/**
 * Actualización bayesiana: posterior_nuevo(t) ∝ likelihood(t) * posterior_previo(t)
 * seguida de normalización. Esto es el corazón del "sistema de pesos" pedido:
 * cada respuesta mueve la probabilidad de los 9 tipos simultáneamente, no solo
 * suma puntos a un tipo "ganador".
 */
export function updateTypePosterior(
  prior: TypePosterior,
  likelihood: Record<TypeId, number>
): TypePosterior {
  const raw = {} as TypePosterior;
  for (const t of ALL_TYPES) {
    raw[t] = prior[t] * likelihood[t];
  }
  const sum = ALL_TYPES.reduce((acc, t) => acc + raw[t], 0);
  const posterior = {} as TypePosterior;
  for (const t of ALL_TYPES) {
    posterior[t] = sum > 0 ? raw[t] / sum : prior[t];
  }
  return posterior;
}

export function updateInstinctPosterior(
  prior: InstinctPosterior,
  likelihood: Record<Instinct, number>
): InstinctPosterior {
  const raw = {} as InstinctPosterior;
  for (const i of ALL_INSTINCTS) {
    raw[i] = prior[i] * likelihood[i];
  }
  const sum = ALL_INSTINCTS.reduce((acc, i) => acc + raw[i], 0);
  const posterior = {} as InstinctPosterior;
  for (const i of ALL_INSTINCTS) {
    posterior[i] = sum > 0 ? raw[i] / sum : prior[i];
  }
  return posterior;
}

/**
 * Compara dos respuestas de un mismo mirrorGroup. Como cada respuesta ya trae
 * su propio vector de verosimilitud, la "distancia" entre ambos vectores es
 * una proxy razonable de incoherencia: si los dos vectores apuntan a tipos
 * muy distintos, la persona respondió el par espejo de forma contradictoria.
 */
export function mirrorPairInconsistency(
  likelihoodA: Record<TypeId, number>,
  likelihoodB: Record<TypeId, number>
): number {
  // distancia euclídea normalizada entre 0 (perfectamente consistente) y 1 (muy inconsistente)
  let sumSq = 0;
  for (const t of ALL_TYPES) {
    const diff = likelihoodA[t] - likelihoodB[t];
    sumSq += diff * diff;
  }
  const dist = Math.sqrt(sumSq);
  return Math.min(dist / 1.2, 1); // 1.2 ~ distancia máxima empírica esperada, se puede recalibrar
}

/**
 * Combina el histórico de inconsistencias de pares espejo en un único score 0..1
 * que penaliza la confianza final.
 */
export function aggregateInconsistency(mirrorScores: number[]): number {
  if (mirrorScores.length === 0) return 0;
  const avg = mirrorScores.reduce((a, b) => a + b, 0) / mirrorScores.length;
  return avg;
}

export interface ConfidenceInputs {
  posterior: TypePosterior;
  inconsistencyScore: number; // 0..1
  dimensionsCovered: number; // cuántas dimensiones psicológicas distintas se cubrieron
  totalDimensions: number;
}

/**
 * Confianza final = separación entre el top-1 y el top-2 (cuanto más despegado,
 * más confianza) × (1 - inconsistencia) × cobertura de dimensiones.
 */
export function computeConfidence({
  posterior,
  inconsistencyScore,
  dimensionsCovered,
  totalDimensions,
}: ConfidenceInputs): number {
  const sorted = ALL_TYPES.map((t) => posterior[t]).sort((a, b) => b - a);
  const [top1, top2] = sorted;
  const separation = Math.max(0, Math.min(1, (top1 - top2) / top1));
  const coverage = Math.max(0, Math.min(1, dimensionsCovered / totalDimensions));
  const consistencyFactor = 1 - inconsistencyScore;
  const confidence = separation * consistencyFactor * coverage;
  return Math.round(confidence * 1000) / 1000;
}

export function rankTypes(posterior: TypePosterior): { type: TypeId; probability: number }[] {
  return ALL_TYPES
    .map((t) => ({ type: t, probability: posterior[t] }))
    .sort((a, b) => b.probability - a.probability);
}

export function rankInstincts(
  posterior: InstinctPosterior
): { instinct: Instinct; probability: number }[] {
  return ALL_INSTINCTS
    .map((i) => ({ instinct: i, probability: posterior[i] }))
    .sort((a, b) => b.probability - a.probability);
}

/**
 * Decide si activar la rama adaptativa de desambiguación: se activa cuando,
 * tras cubrir la mayor parte del banco fijo, los dos tipos más probables están
 * muy cerca entre sí (ambigüedad real, no solo falta de datos).
 */
export function shouldTriggerAdaptiveBranch(
  posterior: TypePosterior,
  progressRatio: number // 0..1, cuánto del banco fijo se respondió
): boolean {
  if (progressRatio < 0.65) return false;
  const [top1, top2] = rankTypes(posterior).map((r) => r.probability);
  return top1 - top2 < 0.08;
}

/** Calcula las alas comparando la probabilidad posterior de los dos tipos vecinos. */
export function computeWing(
  mainType: TypeId,
  wings: [TypeId, TypeId],
  posterior: TypePosterior
): { wing: TypeId; confidence: "alta" | "media" | "baja" } {
  const [a, b] = wings;
  const pa = posterior[a];
  const pb = posterior[b];
  const wing = pa >= pb ? a : b;
  const diff = Math.abs(pa - pb);
  const confidence = diff > 0.05 ? "alta" : diff > 0.02 ? "media" : "baja";
  return { wing, confidence };
}
