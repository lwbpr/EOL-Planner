import { getCategoryLabel } from "@/lib/module-1/resource-directory";
import { TOWNS, type IntakePayload, type ResourceCategory, type ResourceItem, type TownSlug } from "@/lib/module-1/types";

type ResourceDirectory = ResourceItem[];

const NEED_LABELS: Record<IntakePayload["need"], string> = {
  hospicio: "hospicio",
  cuidado_en_casa: "cuidado en casa",
  documentos: "documentos y gestiones",
  funeraria_memorial: "orientación funeraria o memorial",
  acompanamiento: "acompañamiento emocional o doula",
  apoyo_familiar: "apoyo para la familia y cuidadoras",
};

const STAGE_LABELS: Record<IntakePayload["stage"], string> = {
  murio: "la persona ya murió",
  final_de_vida: "la persona está en proceso de final de vida",
  planificando: "están planificando con anticipación",
};

const NEED_CATEGORY_PRIORITY: Record<IntakePayload["need"], ResourceCategory[]> = {
  hospicio: ["hospicio", "doula", "servicio_funebre"],
  cuidado_en_casa: ["hospicio", "doula", "servicio_funebre"],
  documentos: ["servicio_funebre", "doula", "hospicio"],
  funeraria_memorial: ["servicio_funebre", "doula", "hospicio"],
  acompanamiento: ["doula", "hospicio", "servicio_funebre"],
  apoyo_familiar: ["doula", "hospicio", "servicio_funebre"],
};

function getTownRecord(town: TownSlug) {
  return TOWNS.find((item) => item.slug === town);
}

export function getTownName(town: TownSlug) {
  return getTownRecord(town)?.name ?? town;
}

export function buildIntro(payload: IntakePayload) {
  return `Según tus respuestas, parece que ${STAGE_LABELS[payload.stage]} y que la necesidad principal ahora mismo es ${NEED_LABELS[payload.need]} en ${getTownName(payload.town)}.`;
}

function getVerificationScore(value?: string) {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("exacta") || normalized.includes("alto")) return 2;
  if (normalized.includes("medio")) return 1;
  return 0;
}

function scoreCategory(category: ResourceCategory, need: IntakePayload["need"]) {
  const priority = NEED_CATEGORY_PRIORITY[need];
  const index = priority.indexOf(category);
  if (index === -1) return 0;
  return Math.max(0, 5 - index * 2);
}

function scoreResource(resource: ResourceItem, payload: IntakePayload) {
  let score = 0;

  if (resource.townSlug && resource.townSlug === payload.town) score += 8;

  const townRegion = getTownRecord(payload.town)?.region;
  if (townRegion && (resource.region === townRegion || resource.regions.includes(townRegion))) {
    score += 3;
  }

  if (resource.needs.includes(payload.need)) score += 6;
  if (resource.stages.includes(payload.stage)) score += 3;
  if (resource.careSettings.includes(payload.care_setting)) score += 2;

  score += scoreCategory(resource.category, payload.need);
  score += getVerificationScore(resource.verification);

  if (payload.stage === "murio" && resource.category === "servicio_funebre") score += 2;
  if (payload.stage === "final_de_vida" && resource.category === "hospicio") score += 2;
  if (payload.need === "acompanamiento" && resource.category === "doula") score += 2;

  return score;
}

export function recommendResources(resources: ResourceDirectory, payload: IntakePayload) {
  return resources
    .map((resource) => ({
      resource,
      score: scoreResource(resource, payload),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.resource.name.localeCompare(right.resource.name, "es");
    })
    .slice(0, 6);
}

export function buildNextSteps(payload: IntakePayload) {
  const commonSteps = [
    "Confirma quién será la persona responsable de llamadas, documentos o coordinación para evitar duplicidad.",
    "Prioriza primero los recursos del mismo pueblo o región antes de abrir demasiadas opciones a la vez.",
    "Si la situación sigue siendo confusa, abre una ruta de acompañamiento humano con AMORir.",
  ];

  if (payload.need === "hospicio") {
    return [
      "Haz una lista corta de hospicios y llama primero a los que cubren tu municipio o pueblos cercanos.",
      "Pregunta por elegibilidad, servicios en el hogar, cobertura geográfica y tiempo estimado de admisión.",
      ...commonSteps,
    ];
  }

  if (payload.need === "funeraria_memorial") {
    return [
      "Compara no solo disponibilidad, sino también si ofrecen cremación, traslados, prearreglos y apoyo con gestiones.",
      "Confirma qué documentación exigen y qué partes del proceso pueden asumir por la familia.",
      ...commonSteps,
    ];
  }

  if (payload.need === "acompanamiento") {
    return [
      `Empieza por recursos de ${getCategoryLabel("doula").toLowerCase()} cercanos a ${getTownName(payload.town)}.`,
      "Si necesitas contención inmediata, prioriza personas u organizaciones con teléfono o redes activas.",
      ...commonSteps,
    ];
  }

  if (payload.need === "documentos") {
    return [
      "Aclara primero si estás resolviendo planificación anticipada o gestiones después de una muerte.",
      "Escoge un solo recurso de orientación para ordenar la secuencia antes de hacer trámites dispersos.",
      ...commonSteps,
    ];
  }

  if (payload.need === "apoyo_familiar") {
    return [
      "Identifica qué carga práctica está cayendo sobre una sola persona y qué se puede redistribuir.",
      "Busca apoyo que combine contención, coordinación y claridad logística para la familia.",
      ...commonSteps,
    ];
  }

  return commonSteps;
}
