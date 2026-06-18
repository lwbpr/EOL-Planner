import { TOWNS, type CareSetting, type IntakeNeed, type IntakePayload, type IntakeStage, type TownSlug } from "@/lib/module-1/types";

const VALID_STAGES = new Set<IntakeStage>(["murio", "final_de_vida", "planificando"]);
const VALID_CARE_SETTINGS = new Set<CareSetting>(["hogar", "hospital", "hospicio", "otro"]);
const VALID_NEEDS = new Set<IntakeNeed>([
  "hospicio",
  "cuidado_en_casa",
  "documentos",
  "funeraria_memorial",
  "acompanamiento",
  "apoyo_familiar",
]);

type RawIntakeValue = string | string[] | undefined;
export type RawIntakeInput = Record<string, RawIntakeValue>;

function getStringValue(value: RawIntakeValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getArrayValue(value: RawIntakeValue) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

export function isTownSlug(value: string | undefined): value is TownSlug {
  return TOWNS.some((item) => item.slug === value);
}

export function normalizeIntakePayload(params: RawIntakeInput): IntakePayload {
  const stage = getStringValue(params.stage);
  const careSetting = getStringValue(params.care_setting);
  const town = getStringValue(params.town);
  const rawNeeds = getArrayValue(params.need);
  const fallbackNeeds = rawNeeds.length ? rawNeeds : getArrayValue(params.needs);
  const needs = fallbackNeeds.filter((value): value is IntakeNeed => VALID_NEEDS.has(value as IntakeNeed));
  const notes = getStringValue(params.notes)?.trim();

  return {
    stage: VALID_STAGES.has(stage as IntakeStage) ? (stage as IntakeStage) : "final_de_vida",
    care_setting: VALID_CARE_SETTINGS.has(careSetting as CareSetting)
      ? (careSetting as CareSetting)
      : "hogar",
    town: isTownSlug(town) ? town : TOWNS[0].slug,
    needs: needs.length ? needs : ["hospicio"],
    notes: notes || undefined,
  };
}

export function intakePayloadToQuery(payload: IntakePayload) {
  const query = new URLSearchParams();
  query.set("stage", payload.stage);
  query.set("care_setting", payload.care_setting);
  query.set("town", payload.town);

  for (const need of payload.needs) {
    query.append("need", need);
  }

  if (payload.notes) {
    query.set("notes", payload.notes);
  }

  return query.toString();
}
