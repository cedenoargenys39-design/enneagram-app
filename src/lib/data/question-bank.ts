import { TypeId, Instinct } from "@/lib/types/enneagram";
import {
  buildLikertTypeOptions,
  buildLikertInstinctOptions,
  buildForcedChoiceTypeOptions,
  buildForcedChoiceInstinctOptions,
  centerWeights,
  expandTypeWeights,
} from "@/lib/engine/weights";

export interface OptionSeed {
  text: string;
  typeWeights: Record<TypeId, number>;
  instinctWeights?: Record<Instinct, number>;
}

export interface QuestionSeed {
  code: string;
  block: "center" | "type" | "subtype";
  dimension: string;
  text: string;
  scaleType: "likert6" | "forced_choice";
  mirrorGroup?: string;
  options: OptionSeed[];
}

// ---------------------------------------------------------------------------
// BLOQUE 0 — CENTRO DOMINANTE (9 ítems, 3 por centro)
// Escenarios de elección forzada entre una reacción instintiva, una emocional
// y una mental frente a la misma situación. Ajustan el prior, nunca eliminan
// hipótesis (ver "floor" en weights.ts).
// ---------------------------------------------------------------------------
const centerBlock: QuestionSeed[] = [
  {
    code: "C-01",
    block: "center",
    dimension: "centro_reaccion_conflicto",
    text: "Cuando algo se sale de control de forma repentina, lo primero que aparece en mí es...",
    scaleType: "forced_choice",
    options: [
      { text: "Una reacción física inmediata: tensión, impulso de actuar ya", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Una oleada de emoción: preocupación por cómo afecta a las personas involucradas", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Un análisis rápido: necesito entender qué pasó antes de reaccionar", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-02",
    block: "center",
    dimension: "centro_prioridad_decision",
    text: "Al tomar una decisión importante, lo que más peso tiene para mí es...",
    scaleType: "forced_choice",
    options: [
      { text: "Lo que me dicta el instinto o la sensación de 'esto se siente correcto'", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Cómo impacta emocionalmente a mí y a las personas cercanas", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "El análisis lógico de opciones y consecuencias", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-03",
    block: "center",
    dimension: "centro_energia_base",
    text: "Cuando estoy agotado/a, lo que se agota primero es...",
    scaleType: "forced_choice",
    options: [
      { text: "Mi cuerpo y mi capacidad de acción física", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Mi disponibilidad emocional para los demás", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Mi capacidad de concentrarme y pensar con claridad", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-04",
    block: "center",
    dimension: "centro_emocion_reprimida",
    text: "La emoción que más me cuesta reconocer que siento (aunque otros la noten antes que yo) es...",
    scaleType: "forced_choice",
    options: [
      { text: "La ira, incluso cuando está justificada", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "La vergüenza o la sensación de no ser suficiente", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "El miedo o la inseguridad ante lo desconocido", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-05",
    block: "center",
    dimension: "centro_forma_presencia",
    text: "Cuando entro a un lugar lleno de gente que no conozco, lo que ocupa mi atención primero es...",
    scaleType: "forced_choice",
    options: [
      { text: "Evaluar el espacio físico y quién tiene el control de la situación", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Captar el ambiente emocional y cómo se sienten las personas", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Observar y entender la lógica o estructura de lo que está pasando", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-06",
    block: "center",
    dimension: "centro_bloqueo",
    text: "Cuando me bloqueo ante un problema, es más probable que sea porque...",
    scaleType: "forced_choice",
    options: [
      { text: "Actué demasiado rápido sin pensarlo del todo", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Me dejé llevar demasiado por cómo me sentía en el momento", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Me quedé analizando en lugar de decidir", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-07",
    block: "center",
    dimension: "centro_recuperacion",
    text: "Para recuperar energía después de un día muy demandante, lo que más necesito es...",
    scaleType: "forced_choice",
    options: [
      { text: "Movimiento físico o hacer algo con las manos", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Conectar emocionalmente con alguien de confianza", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Tiempo a solas para procesar mentalmente lo ocurrido", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-08",
    block: "center",
    dimension: "centro_confianza",
    text: "Confío en que algo va a salir bien principalmente cuando...",
    scaleType: "forced_choice",
    options: [
      { text: "Siento que tengo el control físico de la situación", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "Siento una conexión genuina con las personas involucradas", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "Tengo suficiente información y un plan claro", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
  {
    code: "C-09",
    block: "center",
    dimension: "centro_autocritica",
    text: "Cuando algo sale mal por mi culpa, me juzgo más duramente por...",
    scaleType: "forced_choice",
    options: [
      { text: "No haber actuado con la fuerza o decisión necesarias", typeWeights: expandTypeWeights(centerWeights("instintivo")) },
      { text: "No haber cuidado bien la relación o el vínculo", typeWeights: expandTypeWeights(centerWeights("emocional")) },
      { text: "No haber pensado o planeado mejor", typeWeights: expandTypeWeights(centerWeights("mental")) },
    ],
  },
];

// ---------------------------------------------------------------------------
// BLOQUE 1 — DIMENSIONES POR TIPO (45 ítems: 5 dimensiones × 9 tipos)
// Formato Likert-6, generado con buildLikertTypeOptions. Cada texto está escrito
// de forma indirecta (situación + qué se protege/teme/necesita), nunca como
// rasgo autodescriptivo.
// ---------------------------------------------------------------------------
type DimSpec = {
  code: string;
  dimension: string;
  text: string;
  positive: Partial<Record<TypeId, number>>;
  negative?: Partial<Record<TypeId, number>>;
  mirrorGroup?: string;
};

const dimSpecs: DimSpec[] = [
  // ---- MIEDO BÁSICO ----
  { code: "T1-FEAR", dimension: "miedo", text: "Cuando cometo un error que otros pueden ver, lo que más me inquieta no es el error en sí, sino la sensación de haber actuado de forma incorrecta o incompleta.", positive: { 1: 0.75, 6: 0.15 } },
  { code: "T2-FEAR", dimension: "miedo", text: "Me inquieta más pensar que alguien podría dejar de necesitarme que pensar que podría fallarle.", positive: { 2: 0.75, 9: 0.1 } },
  { code: "T3-FEAR", dimension: "miedo", text: "Si dejara de lograr cosas visibles por un tiempo largo, sentiría que estoy perdiendo algo esencial de quién soy.", positive: { 3: 0.75, 7: 0.1 } },
  { code: "T4-FEAR", dimension: "miedo", text: "Me preocupa más sentir que soy 'como cualquiera' que sentir que algo salió mal.", positive: { 4: 0.75 } },
  { code: "T5-FEAR", dimension: "miedo", text: "Cuando alguien pide más de mi tiempo o energía de lo que anticipé, mi primera sensación es de invasión, no de generosidad frustrada.", positive: { 5: 0.75 } },
  { code: "T6-FEAR", dimension: "miedo", text: "Antes de confiar en un plan, necesito imaginar qué podría salir mal, incluso si todo indica que va bien.", positive: { 6: 0.75, 1: 0.1 } },
  { code: "T7-FEAR", dimension: "miedo", text: "La idea de quedarme atrapado/a en una sola opción, sin salida, me genera más ansiedad que la mayoría de los problemas concretos.", positive: { 7: 0.75 } },
  { code: "T8-FEAR", dimension: "miedo", text: "Prefiero que me perciban como duro/a antes que dar a alguien la oportunidad de controlarme.", positive: { 8: 0.75 } },
  { code: "T9-FEAR", dimension: "miedo", text: "Con tal de evitar una ruptura o un conflicto abierto, puedo terminar cediendo en cosas que sí me importaban.", positive: { 9: 0.75, 2: 0.1 } },

  // ---- DESEO / MOTIVACIÓN ----
  { code: "T1-DES", dimension: "deseo", text: "Sentir que hice algo 'de la forma correcta' me da más tranquilidad que sentir que lo disfruté.", positive: { 1: 0.7 }, negative: { 7: 0.2 } },
  { code: "T2-DES", dimension: "deseo", text: "Sé que alguien me valora de verdad cuando busca mi ayuda o mi consejo antes que el de otros.", positive: { 2: 0.7 } },
  { code: "T3-DES", dimension: "deseo", text: "Cuando comparto un logro, en el fondo me importa bastante cómo se ve ante los demás, no solo el logro en sí.", positive: { 3: 0.7 } },
  { code: "T4-DES", dimension: "deseo", text: "Me atraen más las experiencias, personas o lugares que tienen algo melancólico o fuera de lo común que los que son simplemente agradables.", positive: { 4: 0.7 } },
  { code: "T5-DES", dimension: "deseo", text: "Sentirme competente en un tema me da más seguridad que sentirme acompañado/a en él.", positive: { 5: 0.7 } },
  { code: "T6-DES", dimension: "deseo", text: "Necesito saber con quién puedo contar de verdad antes de sentirme tranquilo/a en un proyecto nuevo.", positive: { 6: 0.7 } },
  { code: "T7-DES", dimension: "deseo", text: "Cuando algo empieza a sentirse repetitivo o limitante, busco activamente algo nuevo que me devuelva el entusiasmo.", positive: { 7: 0.7 } },
  { code: "T8-DES", dimension: "deseo", text: "Prefiero decidir yo mismo/a las reglas del juego antes que seguir las que otro impuso, aunque sean razonables.", positive: { 8: 0.7 } },
  { code: "T9-DES", dimension: "deseo", text: "La sensación de estar en paz, sin fricciones pendientes, es de las cosas que más valoro en un día.", positive: { 9: 0.7 } },

  // ---- MECANISMO DE DEFENSA ----
  { code: "T1-DEF", dimension: "defensa", text: "Cuando siento un impulso de enojo, tiendo a convertirlo rápidamente en una crítica 'razonable' o 'justa' en lugar de expresarlo como enojo.", positive: { 1: 0.7 } },
  { code: "T2-DEF", dimension: "defensa", text: "Me cuesta identificar qué necesito yo en una relación; suelo tener más claro qué necesita el otro.", positive: { 2: 0.7 } },
  { code: "T3-DEF", dimension: "defensa", text: "A veces noto que estoy actuando el papel de 'persona exitosa' más que sintiendo lo que realmente hay debajo.", positive: { 3: 0.7 } },
  { code: "T4-DEF", dimension: "defensa", text: "Cuando algo me duele, tiendo a quedarme más tiempo del necesario reviviendo y profundizando esa emoción.", positive: { 4: 0.7 } },
  { code: "T5-DEF", dimension: "defensa", text: "Frente a una emoción intensa, mi reacción automática es dar un paso atrás y observarla desde la distancia antes de sentirla del todo.", positive: { 5: 0.7 } },
  { code: "T6-DEF", dimension: "defensa", text: "Cuando algo no cuadra, tiendo a sospechar de las intenciones del otro antes de considerar otras explicaciones.", positive: { 6: 0.7 } },
  { code: "T7-DEF", dimension: "defensa", text: "Cuando algo doloroso pasa, encuentro con facilidad el lado positivo o la lección, casi sin pasar por el dolor mismo.", positive: { 7: 0.7 } },
  { code: "T8-DEF", dimension: "defensa", text: "Me cuesta reconocer, incluso ante mí mismo/a, los momentos en que me siento vulnerable o asustado/a.", positive: { 8: 0.7 } },
  { code: "T9-DEF", dimension: "defensa", text: "Cuando algo me molesta, es común que 'se me olvide' o le reste importancia antes de procesarlo del todo.", positive: { 9: 0.7 } },

  // ---- ESTRATEGIA DE CONFLICTO / ESTRÉS-SEGURIDAD ----
  { code: "T1-CONF", dimension: "conflicto", text: "En un desacuerdo, tiendo a sostener mi postura porque siento que tengo la razón, más que a buscar ceder por armonía.", positive: { 1: 0.65, 8: 0.15 }, negative: { 9: 0.15, 2: 0.1 } },
  { code: "T2-CONF", dimension: "conflicto", text: "En un desacuerdo, priorizo mantener el vínculo por encima de sostener mi punto de vista.", positive: { 2: 0.6, 9: 0.15, 6: 0.1 } },
  { code: "T3-CONF", dimension: "conflicto", text: "En un desacuerdo, me enfoco en resolverlo rápido y eficientemente, no tanto en explorar el trasfondo emocional.", positive: { 3: 0.65, 8: 0.1 } },
  { code: "T4-CONF", dimension: "conflicto", text: "En un desacuerdo, tiendo a retirarme emocionalmente y necesito procesar a solas lo que siento antes de poder hablarlo.", positive: { 4: 0.6, 5: 0.15 } },
  { code: "T5-CONF", dimension: "conflicto", text: "En un desacuerdo, mi tendencia es retirarme a pensar antes de responder, aunque eso incomode al otro.", positive: { 5: 0.65, 9: 0.15 } },
  { code: "T7-CONF", dimension: "conflicto", text: "En un desacuerdo, tiendo a aligerar la tensión con humor o a cambiar de tema antes que quedarme instalado/a en el malestar.", positive: { 7: 0.65, 9: 0.1 } },
  { code: "T8-CONF", dimension: "conflicto", text: "En un desacuerdo, prefiero confrontar directamente el tema aunque se ponga tenso, antes que dejarlo sin resolver.", positive: { 8: 0.7, 1: 0.1 } },
  { code: "T9-CONF", dimension: "conflicto", text: "En un desacuerdo, mi impulso más fuerte es bajar la tensión, aunque eso signifique no decir todo lo que pienso.", positive: { 9: 0.7, 2: 0.1 } },

  // ---- ESTRÉS vs SEGURIDAD (pares espejo explícitos) ----
  { code: "T1-STR", dimension: "estres_seguridad", text: "En un mal momento de mi vida, noto que me vuelvo más rígido/a, crítico/a conmigo y con los demás.", positive: { 1: 0.65 }, mirrorGroup: "M-T1" },
  { code: "T1-SEC", dimension: "estres_seguridad", text: "En un buen momento de mi vida, me permito ser más espontáneo/a y flexible con mis propios estándares.", positive: { 1: 0.6, 7: 0.1 }, mirrorGroup: "M-T1" },
  { code: "T6-STR", dimension: "estres_seguridad", text: "En un mal momento de mi vida, noto que me vuelvo más competitivo/a y ansioso/a por demostrar que puedo solo/a.", positive: { 6: 0.6, 3: 0.1 }, mirrorGroup: "M-T6" },
  { code: "T6-SEC", dimension: "estres_seguridad", text: "En un buen momento de mi vida, me relajo, confío más fácilmente y bajo la guardia.", positive: { 6: 0.6, 9: 0.1 }, mirrorGroup: "M-T6" },
  { code: "T3-STR", dimension: "estres_seguridad", text: "En un mal momento de mi vida, sigo produciendo hacia afuera aunque por dentro me sienta desconectado/a o apático/a.", positive: { 3: 0.65 }, mirrorGroup: "M-T3" },
  { code: "T3-SEC", dimension: "estres_seguridad", text: "En un buen momento de mi vida, me permito comprometerme genuinamente con personas y proyectos, sin calcular tanto la imagen.", positive: { 3: 0.55, 6: 0.1 }, mirrorGroup: "M-T3" },
  { code: "T4-STR", dimension: "estres_seguridad", text: "En un mal momento de mi vida, busco aprobación de forma dependiente y me cuesta poner límites a lo que doy emocionalmente.", positive: { 4: 0.55, 2: 0.15 }, mirrorGroup: "M-T4" },
  { code: "T4-SEC", dimension: "estres_seguridad", text: "En un buen momento de mi vida, me vuelvo más disciplinado/a, objetivo/a y capaz de sostener una rutina sin sentirla como una traición a mí mismo/a.", positive: { 4: 0.55, 1: 0.15 }, mirrorGroup: "M-T4" },
  { code: "T7-STR", dimension: "estres_seguridad", text: "En un mal momento de mi vida, me vuelvo más crítico/a y exigente conmigo y con los demás de lo que suelo ser.", positive: { 7: 0.55, 1: 0.15 }, mirrorGroup: "M-T7" },
  { code: "T7-SEC", dimension: "estres_seguridad", text: "En un buen momento de mi vida, logro profundizar y enfocarme en un solo tema sin sentir que me estoy perdiendo algo mejor.", positive: { 7: 0.55, 5: 0.15 }, mirrorGroup: "M-T7" },
];

// Construye las preguntas de dimensión de tipo a partir de las specs, y añade
// el flag scaleType/likert. Los mirrorGroup ya vienen incluidos si aplica.
const typeBlock: QuestionSeed[] = dimSpecs.map((spec) => ({
  code: spec.code,
  block: "type",
  dimension: spec.dimension,
  text: spec.text,
  scaleType: "likert6",
  mirrorGroup: spec.mirrorGroup,
  options: buildLikertTypeOptions(spec.positive, spec.negative).map((o) => ({
    text: o.text,
    typeWeights: o.typeWeights,
  })),
}));

// ---------------------------------------------------------------------------
// BLOQUE 2 — ELECCIÓN FORZADA (neutraliza deseabilidad social)
// Cada ítem enfrenta dos virtudes/valores igualmente deseables, cada uno
// asociado a un tipo distinto, para forzar una priorización real.
// ---------------------------------------------------------------------------
const forcedChoiceBlock: QuestionSeed[] = [
  {
    code: "FC-01", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Si solo pudiera quedarme con una de estas dos cualidades en mí mismo/a, elegiría...",
    options: buildForcedChoiceTypeOptions([
      { text: "Ser siempre justo/a y correcto/a", type: 1 },
      { text: "Ser siempre leal a quienes confían en mí", type: 6 },
    ]),
  },
  {
    code: "FC-02", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Preferiría que me recordaran como alguien...",
    options: buildForcedChoiceTypeOptions([
      { text: "Que logró grandes cosas", type: 3 },
      { text: "Que fue profundamente auténtico/a consigo mismo/a", type: 4 },
    ]),
  },
  {
    code: "FC-03", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "En una crisis, preferiría ser la persona que...",
    options: buildForcedChoiceTypeOptions([
      { text: "Toma el control y decide rápido", type: 8 },
      { text: "Mantiene la calma y evita que todo se fragmente", type: 9 },
    ]),
  },
  {
    code: "FC-04", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Me sentiría más orgulloso/a de mí mismo/a si...",
    options: buildForcedChoiceTypeOptions([
      { text: "Ayudé a alguien de forma decisiva cuando más lo necesitaba", type: 2 },
      { text: "Entendí algo complejo que casi nadie más entiende", type: 5 },
    ]),
  },
  {
    code: "FC-05", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Si tuviera que elegir cómo vivir el próximo año, elegiría un año con...",
    options: buildForcedChoiceTypeOptions([
      { text: "Muchas experiencias nuevas y estimulantes", type: 7 },
      { text: "Rutinas estables y previsibles", type: 9 },
    ]),
  },
  {
    code: "FC-06", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Me resultaría más difícil vivir sin...",
    options: buildForcedChoiceTypeOptions([
      { text: "Sentir que las cosas se hacen bien", type: 1 },
      { text: "Sentir que soy indispensable para alguien", type: 2 },
    ]),
  },
  {
    code: "FC-07", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Preferiría que me describieran como alguien...",
    options: buildForcedChoiceTypeOptions([
      { text: "Fuerte e imposible de doblegar", type: 8 },
      { text: "Brillante y con ideas propias", type: 5 },
    ]),
  },
  {
    code: "FC-08", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Si tuviera que renunciar a una de estas dos cosas, sería más fácil renunciar a...",
    options: buildForcedChoiceTypeOptions([
      { text: "Mi tiempo y espacio a solas", type: 5 },
      { text: "Mi rol de guía o autoridad confiable para otros", type: 6 },
    ]),
  },
  {
    code: "FC-09", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "En el fondo, admiro más a alguien que...",
    options: buildForcedChoiceTypeOptions([
      { text: "Logra resultados extraordinarios de forma consistente", type: 3 },
      { text: "Se mantiene fiel a sí mismo/a pase lo que pase", type: 4 },
    ]),
  },
  {
    code: "FC-10", block: "type", dimension: "priorizacion_valores", scaleType: "forced_choice",
    text: "Me sentiría más cómodo/a en un rol que...",
    options: buildForcedChoiceTypeOptions([
      { text: "Mantiene la armonía del grupo", type: 9 },
      { text: "Marca el rumbo y toma decisiones difíciles", type: 8 },
    ]),
  },
];

// ---------------------------------------------------------------------------
// BLOQUE 3 — SUBTIPO INSTINTIVO (16 ítems: 8 ejes × 2)
// v1: no condicionado al tipo principal (ver README, sección "roadmap v2").
// ---------------------------------------------------------------------------
type InstinctAxisSpec = {
  code: string;
  axis: string;
  text: string;
  positive: Partial<Record<Instinct, number>>;
};

const instinctAxes: InstinctAxisSpec[] = [
  { code: "S-ENE-01", axis: "energia", text: "Cuando pienso en dónde se me va la mayor parte de mi energía diaria, es en...", positive: { SP: 0.65 } },
  { code: "S-ENE-02", axis: "energia", text: "Lo que más rápido nota la gente en mí en un grupo nuevo es mi interés en entender el 'mapa social' del lugar (quién es quién).", positive: { SO: 0.65 } },
  { code: "S-SUP-01", axis: "supervivencia", text: "Cuando algo amenaza mi estabilidad, lo primero que reviso es si tengo cubiertas mis necesidades básicas (dinero, salud, espacio).", positive: { SP: 0.65 } },
  { code: "S-SUP-02", axis: "supervivencia", text: "Cuando algo amenaza mi estabilidad, lo primero que reviso es si sigo teniendo un lugar dentro de mi grupo o comunidad.", positive: { SO: 0.6 } },
  { code: "S-INT-01", axis: "intimidad", text: "Lo que más ansiedad me genera perder no es el estatus ni los recursos, sino la conexión intensa con una persona específica.", positive: { SX: 0.7 } },
  { code: "S-INT-02", axis: "intimidad", text: "Prefiero pocas relaciones muy intensas antes que muchas relaciones moderadas.", positive: { SX: 0.6 } },
  { code: "S-PER-01", axis: "pertenencia", text: "Sentirme parte activa de un grupo o comunidad me da una sensación de seguridad que pocas otras cosas dan.", positive: { SO: 0.65 } },
  { code: "S-PER-02", axis: "pertenencia", text: "Prefiero mantener mi independencia incluso si eso significa quedar un poco al margen del grupo.", positive: { SP: 0.55 } },
  { code: "S-REC-01", axis: "recursos", text: "Antes de comprometerme con algo, reviso instintivamente cuánto tiempo, dinero o energía propia me va a costar.", positive: { SP: 0.65 } },
  { code: "S-REC-02", axis: "recursos", text: "No suelo pensar mucho en el costo personal de algo si siento una conexión fuerte con la persona o la causa.", positive: { SX: 0.55 } },
  { code: "S-VIN-01", axis: "vinculos", text: "Cuando conozco a alguien que me atrae (en cualquier sentido, no solo romántico), busco crear una conexión intensa rápido.", positive: { SX: 0.65 } },
  { code: "S-VIN-02", axis: "vinculos", text: "Prefiero vínculos que se construyen despacio dentro de un grupo más amplio, antes que conexiones intensas uno a uno.", positive: { SO: 0.55 } },
  { code: "S-COMP-01", axis: "competencia", text: "Me importa bastante cómo me percibe el grupo en términos de estatus, reconocimiento o rol dentro de un sistema.", positive: { SO: 0.6 } },
  { code: "S-COMP-02", axis: "competencia", text: "Compito más por ser la persona más significativa para alguien específico que por tener un rol reconocido en un grupo grande.", positive: { SX: 0.6 } },
  { code: "S-PROT-01", axis: "proteccion", text: "Cuando algo me estresa, mi primer instinto es asegurar mi entorno físico inmediato (orden, comida, descanso, dinero).", positive: { SP: 0.65 } },
  { code: "S-PROT-02", axis: "proteccion", text: "Cuando algo me estresa, mi primer instinto es buscar a esa persona clave que me da estabilidad emocional.", positive: { SX: 0.55 } },
];

const subtypeBlock: QuestionSeed[] = instinctAxes.map((spec) => ({
  code: spec.code,
  block: "subtype",
  dimension: spec.axis,
  text: spec.text,
  scaleType: "likert6",
  options: buildLikertInstinctOptions(spec.positive).map((o) => ({
    text: o.text,
    typeWeights: o.typeWeights,
    instinctWeights: o.instinctWeights,
  })),
}));

export const QUESTION_BANK: QuestionSeed[] = [
  ...centerBlock,
  ...typeBlock,
  ...forcedChoiceBlock,
  ...subtypeBlock,
];
