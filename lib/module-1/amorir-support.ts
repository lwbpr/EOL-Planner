import { getTownName } from "@/lib/module-1/recommend";
import type { IntakePayload } from "@/lib/module-1/types";

export const AMORIR_SUPPORT = {
  email: "info@amorir.org",
  instagram: "https://www.instagram.com/amorirpr",
  website: "https://amorir.org",
} as const;

const STAGE_LABELS: Record<IntakePayload["stage"], string> = {
  murio: "la persona ya murio",
  final_de_vida: "estan acompanando a una persona en proceso final de vida",
  planificando: "estan planificando con anticipacion",
};

const NEED_LABELS: Record<IntakePayload["needs"][number], string> = {
  hospicio: "hospicio",
  cuidado_en_casa: "cuidado en casa",
  documentos: "documentos y gestiones",
  funeraria_memorial: "orientacion funeraria o memorial",
  acompanamiento: "acompanamiento emocional o doula",
  apoyo_familiar: "apoyo para la familia y cuidadoras",
};

function formatNeedList(needs: IntakePayload["needs"]) {
  const labels = needs.map((need) => NEED_LABELS[need]);

  if (labels.length <= 1) return labels[0] ?? NEED_LABELS.hospicio;
  if (labels.length === 2) return `${labels[0]} y ${labels[1]}`;

  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}`;
}

export function buildSupportTitle(payload?: IntakePayload) {
  if (!payload) return "Tambien pueden hablar con una persona de AMORir";

  switch (payload.stage) {
    case "murio":
      return "No tienen que cargar este momento a solas";
    case "planificando":
      return "Planificar con tiempo tambien merece acompanamiento";
    default:
      return "Si el proceso se siente confuso, AMORir puede ayudar";
  }
}

export function buildSupportMessage(payload?: IntakePayload) {
  if (!payload) {
    return "Si necesitan orientacion humana para entender opciones, ordenar pasos o pedir acompanamiento, AMORir puede servir como punto de entrada mas calido que un directorio.";
  }

  const needList = formatNeedList(payload.needs);
  const town = getTownName(payload.town);

  switch (payload.stage) {
    case "murio":
      return `Si la muerte ya ocurrio y necesitan apoyo con ${needList} en ${town}, AMORir puede ayudarles a ordenar el momento, aclarar prioridades y decidir a quien llamar primero.`;
    case "planificando":
      return `Si estan planificando con anticipacion en ${town}, AMORir puede ayudarles a convertir conversaciones sobre ${needList} en pasos concretos, con mas calma y menos improvisacion.`;
    default:
      return `Si ahora mismo estan acompanando a una persona en proceso final de vida en ${town}, AMORir puede ayudarles a organizar decisiones sobre ${needList} sin perder de vista la dignidad, la familia y el cuidado.`;
  }
}

export function buildSupportChecklist(payload?: IntakePayload) {
  if (!payload) {
    return [
      "Explicar brevemente la situacion y el pueblo donde necesitan apoyo.",
      "Aclarar si buscan orientacion inmediata, acompanamiento o una referencia.",
      "Abrir una conversacion humana antes de perderse entre demasiadas opciones.",
    ];
  }

  if (payload.stage === "murio") {
    return [
      "Decir quien murio, en que pueblo estan y que gestion urge primero.",
      "Aclarar si necesitan orientacion funeraria, documentos o apoyo para la familia.",
      "Pedir una llamada o una primera orientacion por correo para ordenar proximos pasos.",
    ];
  }

  if (payload.stage === "planificando") {
    return [
      "Compartir que desean dejar mas claro o preparado.",
      "Nombrar si la prioridad es documentos, cuidado, hospicio o acompanamiento.",
      "Usar AMORir como espacio de orientacion antes de activar mas tramites o servicios.",
    ];
  }

  return [
    "Compartir el pueblo, el escenario de cuidado y la necesidad principal.",
    "Aclarar si necesitan ayuda para decidir, coordinar o contener a la familia.",
    "Pedir una orientacion humana si el directorio por si solo no basta.",
  ];
}

export function buildSupportMailto(payload?: IntakePayload) {
  const subject = payload
    ? `Coordinador de Final de Vida - ${getTownName(payload.town)}`
    : "Coordinador de Final de Vida";

  const body = payload
    ? [
        "Hola AMORir,",
        "",
        "Necesitamos orientacion a traves del Coordinador de Final de Vida.",
        `Pueblo: ${getTownName(payload.town)}`,
        `Momento: ${STAGE_LABELS[payload.stage]}`,
        `Necesidades: ${formatNeedList(payload.needs)}`,
        payload.notes ? `Contexto adicional: ${payload.notes}` : "Contexto adicional:",
        "",
        "Gracias.",
      ].join("\n")
    : [
        "Hola AMORir,",
        "",
        "Necesito orientacion a traves del Coordinador de Final de Vida.",
        "Pueblo:",
        "Momento:",
        "Necesidad principal:",
        "",
        "Gracias.",
      ].join("\n");

  return `mailto:${AMORIR_SUPPORT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
