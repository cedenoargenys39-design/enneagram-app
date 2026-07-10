// Metadata psicológica de cada tipo, siguiendo la síntesis definida en la arquitectura:
// Riso-Hudson (miedo/deseo/fijación/pasión/virtud/integración-desintegración)
// + Naranjo (mecanismo de defensa)

export type TypeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Center = "instintivo" | "emocional" | "mental";
export type Instinct = "SP" | "SO" | "SX";
export type ConflictStance = "agresivo" | "complaciente" | "retirado";

export interface TypeMetadata {
  id: TypeId;
  name: string;
  center: Center;
  basicFear: string;
  basicDesire: string;
  unconsciousMotivation: string;
  fixation: string;
  passion: string;
  virtue: string;
  defenseMechanism: string;
  conflictStance: ConflictStance;
  protects: string;
  needsToFeelSafe: string;
  stressPoint: TypeId; // línea de desintegración
  securityPoint: TypeId; // línea de integración
  underStress: string;
  inSecurity: string;
  wings: [TypeId, TypeId];
  strengths: string[];
  blindSpots: string[];
  commonlyConfusedWith: TypeId[];
}

export const ENNEAGRAM_TYPES: Record<TypeId, TypeMetadata> = {
  1: {
    id: 1,
    name: "El Reformador",
    center: "instintivo",
    basicFear: "Ser corrupto, defectuoso o equivocado",
    basicDesire: "Tener razón, ser bueno, tener integridad",
    unconsciousMotivation: "Buscar mantenerse consistente con sus propios ideales para justificar su valor",
    fixation: "Resentimiento / perfeccionismo",
    passion: "Ira (reprimida como resentimiento)",
    virtue: "Serenidad",
    defenseMechanism: "Formación reactiva (convertir el impulso en su opuesto socialmente aceptable)",
    conflictStance: "agresivo",
    protects: "La imagen de ser una persona correcta, racional y buena",
    needsToFeelSafe: "Sentir que las cosas se hacen 'como se debe'",
    stressPoint: 4,
    securityPoint: 7,
    underStress: "Se vuelve más crítico, rígido, y puede caer en episodios de desánimo o autocompasión (línea al 4)",
    inSecurity: "Se permite espontaneidad, disfrute y flexibilidad (línea al 7)",
    wings: [9, 2],
    strengths: ["Ética sólida", "Atención al detalle", "Sentido de responsabilidad"],
    blindSpots: ["Rigidez", "Autocrítica excesiva proyectada en otros", "Dificultad para relajar estándares"],
    commonlyConfusedWith: [6, 8],
  },
  2: {
    id: 2,
    name: "El Ayudador",
    center: "emocional",
    basicFear: "Ser indigno de amor si no es necesitado por otros",
    basicDesire: "Sentirse amado",
    unconsciousMotivation: "Ganar valor propio a través de ser indispensable para los demás",
    fixation: "Adulación / autoengaño sobre las propias necesidades",
    passion: "Orgullo (negar las propias necesidades para sentirse por encima al dar)",
    virtue: "Humildad",
    defenseMechanism: "Represión (de las propias necesidades y agresión)",
    conflictStance: "complaciente",
    protects: "La imagen de ser una persona generosa y amorosa",
    needsToFeelSafe: "Sentir que es querido y que su ayuda es valorada",
    stressPoint: 8,
    securityPoint: 4,
    underStress: "Se vuelve dominante, exige reconocimiento por lo que ha dado (línea al 8)",
    inSecurity: "Reconoce y expresa sus propias necesidades sin culpa (línea al 4)",
    wings: [1, 3],
    strengths: ["Empatía", "Generosidad genuina", "Calidez relacional"],
    blindSpots: ["Dificultad para pedir ayuda", "Ayudar como forma de control", "Resentimiento no expresado"],
    commonlyConfusedWith: [9, 6],
  },
  3: {
    id: 3,
    name: "El Triunfador",
    center: "emocional",
    basicFear: "Ser inútil o no tener valor fuera de sus logros",
    basicDesire: "Sentirse valioso",
    unconsciousMotivation: "Obtener aprobación mostrando una imagen exitosa",
    fixation: "Vanidad / identificación con la imagen",
    passion: "Vanidad (identificarse con la imagen que proyecta más que con lo que siente)",
    virtue: "Autenticidad / veracidad",
    defenseMechanism: "Identificación (con el rol o imagen exitosa)",
    conflictStance: "agresivo",
    protects: "La imagen de ser exitoso, eficiente y admirable",
    needsToFeelSafe: "Sentir que está logrando algo reconocible",
    stressPoint: 9,
    securityPoint: 6,
    underStress: "Se desconecta, procrastina, se vuelve apático por dentro mientras sigue actuando (línea al 9)",
    inSecurity: "Se vuelve leal, colaborativo, capaz de comprometerse genuinamente (línea al 6)",
    wings: [2, 4],
    strengths: ["Eficiencia", "Adaptabilidad", "Capacidad de motivar a otros"],
    blindSpots: ["Desconexión de las propias emociones", "Priorizar imagen sobre contenido", "Competitividad excesiva"],
    commonlyConfusedWith: [7, 8],
  },
  4: {
    id: 4,
    name: "El Individualista",
    center: "emocional",
    basicFear: "No tener identidad propia ni significado personal",
    basicDesire: "Encontrar y expresar su verdadera identidad",
    unconsciousMotivation: "Confirmar, a través de la intensidad emocional, que es único y significativo",
    fixation: "Melancolía / comparación",
    passion: "Envidia (sentir que a otros les falta menos que a uno mismo)",
    virtue: "Ecuanimidad",
    defenseMechanism: "Introyección (absorber y amplificar internamente el dolor)",
    conflictStance: "retirado",
    protects: "La imagen de ser una persona profunda, única y especial",
    needsToFeelSafe: "Sentir que su experiencia interior es vista y comprendida",
    stressPoint: 2,
    securityPoint: 1,
    underStress: "Busca aprobación de forma dependiente, se vuelve intrusivo emocionalmente (línea al 2)",
    inSecurity: "Se vuelve más disciplinado, objetivo y orientado a la acción (línea al 1)",
    wings: [3, 5],
    strengths: ["Profundidad emocional", "Creatividad", "Autenticidad"],
    blindSpots: ["Idealizar lo ausente", "Identidad basada en el sufrimiento", "Dificultad para sostener rutina"],
    commonlyConfusedWith: [9, 5],
  },
  5: {
    id: 5,
    name: "El Investigador",
    center: "mental",
    basicFear: "Ser invadido, incompetente o sin recursos internos",
    basicDesire: "Ser capaz y competente",
    unconsciousMotivation: "Conservar energía y privacidad para sentirse seguro frente al mundo",
    fixation: "Avaricia (de tiempo, energía y espacio, no solo de dinero)",
    passion: "Avaricia (retener recursos internos)",
    virtue: "No apego",
    defenseMechanism: "Aislamiento (separar el pensamiento del sentimiento)",
    conflictStance: "retirado",
    protects: "Su espacio interno, privacidad y autosuficiencia",
    needsToFeelSafe: "Tener control sobre su tiempo, espacio y energía",
    stressPoint: 7,
    securityPoint: 8,
    underStress: "Se dispersa, se vuelve hiperactivo mentalmente sin concretar (línea al 7)",
    inSecurity: "Se vuelve más decidido, seguro y capaz de actuar en el mundo (línea al 8)",
    wings: [4, 6],
    strengths: ["Pensamiento analítico", "Independencia", "Objetividad"],
    blindSpots: ["Aislamiento excesivo", "Desconexión emocional", "Acumular conocimiento sin actuar"],
    commonlyConfusedWith: [4, 9],
  },
  6: {
    id: 6,
    name: "El Leal",
    center: "mental",
    basicFear: "Quedarse sin apoyo o guía frente al peligro",
    basicDesire: "Tener seguridad y apoyo",
    unconsciousMotivation: "Anticipar el peligro para poder controlarlo o evitarlo",
    fixation: "Duda / cuestionamiento constante",
    passion: "Miedo (ansiedad anticipatoria)",
    virtue: "Coraje",
    defenseMechanism: "Proyección (atribuir a otros las propias dudas o impulsos)",
    conflictStance: "complaciente",
    protects: "Su necesidad de seguridad y de un sistema de apoyo confiable",
    needsToFeelSafe: "Tener certezas, aliados o una autoridad confiable",
    stressPoint: 3,
    securityPoint: 9,
    underStress: "Se vuelve competitivo y ansioso por demostrar capacidad (línea al 3)",
    inSecurity: "Se relaja, confía y se vuelve más receptivo (línea al 9)",
    wings: [5, 7],
    strengths: ["Lealtad", "Capacidad de anticipar problemas", "Compromiso"],
    blindSpots: ["Indecisión", "Desconfianza proyectada", "Dificultad para actuar sin garantías"],
    commonlyConfusedWith: [1, 2],
  },
  7: {
    id: 7,
    name: "El Entusiasta",
    center: "mental",
    basicFear: "Quedar atrapado en el dolor o la privación",
    basicDesire: "Estar satisfecho y contento",
    unconsciousMotivation: "Mantenerse en movimiento hacia lo nuevo para evitar sentir dolor o límite",
    fixation: "Planificación / anticipación de opciones",
    passion: "Gula (de experiencias, estímulos y opciones)",
    virtue: "Sobriedad",
    defenseMechanism: "Racionalización (reencuadrar lo negativo como positivo)",
    conflictStance: "agresivo",
    protects: "Su libertad de opciones y su estado de ánimo positivo",
    needsToFeelSafe: "Sentir que tiene opciones abiertas y no está atrapado",
    stressPoint: 1,
    securityPoint: 5,
    underStress: "Se vuelve crítico, rígido y perfeccionista hacia sí y otros (línea al 1)",
    inSecurity: "Profundiza, se enfoca y tolera mejor la introspección (línea al 5)",
    wings: [6, 8],
    strengths: ["Optimismo", "Versatilidad", "Capacidad de generar entusiasmo"],
    blindSpots: ["Evitación del dolor propio", "Dispersión", "Dificultad para comprometerse a largo plazo"],
    commonlyConfusedWith: [3, 8],
  },
  8: {
    id: 8,
    name: "El Desafiador",
    center: "instintivo",
    basicFear: "Ser controlado o vulnerable ante otros",
    basicDesire: "Protegerse y decidir su propio destino",
    unconsciousMotivation: "Mostrar fuerza para evitar mostrar vulnerabilidad",
    fixation: "Venganza / negación de la propia vulnerabilidad",
    passion: "Lujuria (intensidad y exceso como forma de sentirse vivo y en control)",
    virtue: "Inocencia",
    defenseMechanism: "Negación (de la propia vulnerabilidad y miedo)",
    conflictStance: "agresivo",
    protects: "Su autonomía y su percepción de fuerza",
    needsToFeelSafe: "Sentir que tiene control sobre su entorno inmediato",
    stressPoint: 5,
    securityPoint: 2,
    underStress: "Se retira, se aísla y desconfía de todos (línea al 5)",
    inSecurity: "Se abre emocionalmente y se vuelve genuinamente protector y generoso (línea al 2)",
    wings: [7, 9],
    strengths: ["Decisión", "Capacidad de proteger a otros", "Honestidad directa"],
    blindSpots: ["Dificultad para mostrar vulnerabilidad", "Intensidad que puede intimidar", "Control excesivo"],
    commonlyConfusedWith: [3, 1],
  },
  9: {
    id: 9,
    name: "El Pacificador",
    center: "instintivo",
    basicFear: "Pérdida de conexión, fragmentación o conflicto",
    basicDesire: "Tener paz interior y armonía",
    unconsciousMotivation: "Fusionarse con los demás o con la rutina para evitar el conflicto propio y ajeno",
    fixation: "Indolencia (respecto a la propia agenda y prioridades)",
    passion: "Pereza (de la propia presencia y prioridades, no necesariamente física)",
    virtue: "Acción / compromiso genuino",
    defenseMechanism: "Narcotización (autoanestesia a través de rutinas o distracciones)",
    conflictStance: "complaciente",
    protects: "La armonía externa e interna, evitando el conflicto",
    needsToFeelSafe: "Sentir que no hay tensión ni conflicto activo a su alrededor",
    stressPoint: 6,
    securityPoint: 3,
    underStress: "Se vuelve ansioso, indeciso y busca garantías externas (línea al 6)",
    inSecurity: "Se vuelve más enfocado, activo y capaz de priorizarse (línea al 3)",
    wings: [8, 1],
    strengths: ["Capacidad de mediar", "Aceptación", "Estabilidad"],
    blindSpots: ["Evitación del conflicto propio", "Postergación", "Fusión con la agenda de otros"],
    commonlyConfusedWith: [4, 5],
  },
};

export const INSTINCT_LABELS: Record<Instinct, string> = {
  SP: "Autopreservación",
  SO: "Social",
  SX: "Sexual / Uno a uno",
};

export const INSTINCT_DESCRIPTIONS: Record<Instinct, string> = {
  SP: "Prioriza energéticamente la seguridad material, el bienestar físico, el tiempo y los recursos propios.",
  SO: "Prioriza energéticamente la pertenencia a un grupo, el estatus dentro de un sistema y la contribución colectiva.",
  SX: "Prioriza energéticamente la intensidad y la conexión uno a uno, buscando química, atracción o fusión con alguien específico.",
};
