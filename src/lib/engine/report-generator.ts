import { TypeId, Instinct, ENNEAGRAM_TYPES, INSTINCT_LABELS } from "@/lib/types/enneagram";
import {
  TypePosterior,
  InstinctPosterior,
  rankTypes,
  rankInstincts,
  computeWing,
  computeConfidence,
} from "@/lib/engine/bayesian-engine";

export interface FullReport {
  typeResult: TypeId;
  typeName: string;
  confidence: number;
  confidenceLabel: "alta" | "media" | "baja";
  typeRanking: { type: TypeId; name: string; probability: number }[];
  wing: { wing: TypeId; confidence: "alta" | "media" | "baja" } | null;
  instinctResult: Instinct | null;
  instinctLabel: string | null;
  instinctRanking: { instinct: Instinct; label: string; probability: number }[] | null;
  summary: string;
  basicFear: string;
  basicDesire: string;
  motivation: string;
  fixation: string;
  passion: string;
  virtue: string;
  defenseMechanism: string;
  underStress: string;
  inSecurity: string;
  strengths: string[];
  blindSpots: string[];
  possibleConfusions: { type: TypeId; name: string; whyNot: string }[];
  inconsistencyNotes: string[];
}

export function generateReport(params: {
  typePosterior: TypePosterior;
  instinctPosterior: InstinctPosterior | null;
  inconsistencyScore: number;
  dimensionsCovered: number;
  totalDimensions: number;
}): FullReport {
  const { typePosterior, instinctPosterior, inconsistencyScore, dimensionsCovered, totalDimensions } = params;

  const ranking = rankTypes(typePosterior);
  const top = ranking[0];
  const mainTypeMeta = ENNEAGRAM_TYPES[top.type];

  const confidence = computeConfidence({
    posterior: typePosterior,
    inconsistencyScore,
    dimensionsCovered,
    totalDimensions,
  });
  const confidenceLabel: "alta" | "media" | "baja" =
    confidence > 0.5 ? "alta" : confidence > 0.25 ? "media" : "baja";

  const wing = computeWing(top.type, mainTypeMeta.wings, typePosterior);

  let instinctResult: Instinct | null = null;
  let instinctRanking: { instinct: Instinct; label: string; probability: number }[] | null = null;
  if (instinctPosterior) {
    const iRanking = rankInstincts(instinctPosterior);
    instinctResult = iRanking[0].instinct;
    instinctRanking = iRanking.map((r) => ({
      instinct: r.instinct,
      label: INSTINCT_LABELS[r.instinct],
      probability: r.probability,
    }));
  }

  const possibleConfusions = mainTypeMeta.commonlyConfusedWith.map((confusedType) => {
    const confusedMeta = ENNEAGRAM_TYPES[confusedType];
    const confusedProb = typePosterior[confusedType];
    return {
      type: confusedType,
      name: confusedMeta.name,
      whyNot: `Comparte ${describeSharedTrait(top.type, confusedType)} con el tipo ${top.type}, pero la evidencia recogida (probabilidad ${(confusedProb * 100).toFixed(1)}%) fue consistentemente menor que la del tipo ${top.type} (${(top.probability * 100).toFixed(1)}%), especialmente en las preguntas de miedo básico y mecanismo de defensa.`,
    };
  });

  const inconsistencyNotes: string[] = [];
  if (inconsistencyScore > 0.15) {
    inconsistencyNotes.push(
      `Se detectó un nivel de inconsistencia de ${(inconsistencyScore * 100).toFixed(0)}% entre pares de preguntas espejo. Esto reduce la confianza reportada y sugiere que algunas respuestas pueden reflejar la personalidad "aprendida" o una autoimagen idealizada más que el patrón motivacional real. Se recomienda revisar el resultado con calma o repetir el test en otro momento.`
    );
  }
  if (dimensionsCovered < totalDimensions) {
    inconsistencyNotes.push(
      `Se cubrieron ${dimensionsCovered} de ${totalDimensions} dimensiones psicológicas planeadas. Completar el test entero mejora la precisión del resultado.`
    );
  }

  const summary = `Tu patrón de respuestas se alinea de forma predominante con el tipo ${top.type} (${mainTypeMeta.name}). Esto significa que, ante situaciones de tensión, tu estructura psicológica tiende a organizarse alrededor de ${mainTypeMeta.basicFear.toLowerCase()}, y busca protegerse asegurando ${mainTypeMeta.basicDesire.toLowerCase()}. La confianza de este resultado es ${confidenceLabel} (${(confidence * 100).toFixed(0)}%).`;

  return {
    typeResult: top.type,
    typeName: mainTypeMeta.name,
    confidence,
    confidenceLabel,
    typeRanking: ranking.map((r) => ({
      type: r.type,
      name: ENNEAGRAM_TYPES[r.type].name,
      probability: r.probability,
    })),
    wing,
    instinctResult,
    instinctLabel: instinctResult ? INSTINCT_LABELS[instinctResult] : null,
    instinctRanking,
    summary,
    basicFear: mainTypeMeta.basicFear,
    basicDesire: mainTypeMeta.basicDesire,
    motivation: mainTypeMeta.unconsciousMotivation,
    fixation: mainTypeMeta.fixation,
    passion: mainTypeMeta.passion,
    virtue: mainTypeMeta.virtue,
    defenseMechanism: mainTypeMeta.defenseMechanism,
    underStress: mainTypeMeta.underStress,
    inSecurity: mainTypeMeta.inSecurity,
    strengths: mainTypeMeta.strengths,
    blindSpots: mainTypeMeta.blindSpots,
    possibleConfusions,
    inconsistencyNotes,
  };
}

function describeSharedTrait(a: TypeId, b: TypeId): string {
  const centerA = ENNEAGRAM_TYPES[a].center;
  const centerB = ENNEAGRAM_TYPES[b].center;
  if (centerA === centerB) return `el mismo centro (${centerA}) y algunos rasgos conductuales superficiales`;
  return "algunos rasgos conductuales superficiales";
}
