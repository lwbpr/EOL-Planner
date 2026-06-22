import { parse } from "csv-parse/sync";
import { TOWNS, type IntakeNeed, type ResourceItem, type TownOption } from "@/lib/module-1/types";

export const LIVE_DOULAS_CACHE_TAG = "doulas-live";
export const LIVE_DOULAS_SHEET_ID = "1jXwASHntkCTkeLDVC8TSSC8xYd9wm_EhC-vLIcExenc";
export const LIVE_DOULAS_SHEET_GID = "590595399";
export const LIVE_DOULAS_EXPORT_URL =
  `https://docs.google.com/spreadsheets/d/${LIVE_DOULAS_SHEET_ID}/export?format=csv&gid=${LIVE_DOULAS_SHEET_GID}`;

const LIVE_DOULAS_SOURCE_URL =
  `https://docs.google.com/spreadsheets/d/${LIVE_DOULAS_SHEET_ID}/edit#gid=${LIVE_DOULAS_SHEET_GID}`;

type SheetRow = {
  Nombre?: string;
  "Apellido(s)"?: string;
  "Numero de telefono"?: string;
  "Número de teléfono"?: string;
  "Correo electrónico"?: string;
  "*Pueblo de Residencia*"?: string;
  "Organización/Proyecto"?: string;
  "*Página web*"?: string;
  "Redes sociales:*"?: string;
  "*Regiones* "?: string;
  Formación?: string;
  Credenciales?: string;
  Rol?: string;
  "*Temas/Áreas"?: string;
  "*Sobre ti*"?: string;
  "Submitted At"?: string;
  Token?: string;
};

const REGION_MAP: Record<string, string> = {
  "area metro": "metro",
  "area este": "este",
  "area norte": "norte",
  "area oeste": "oeste",
  "area sur": "sur",
  "area centro": "central",
  "area central": "central",
  "servicio online": "online",
  online: "online",
  metro: "metro",
  este: "este",
  norte: "norte",
  oeste: "oeste",
  sur: "sur",
  central: "central",
};

const DEFAULT_NEEDS: IntakeNeed[] = ["acompanamiento", "apoyo_familiar"];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function slugify(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function cleanValue(value?: string) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function splitList(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function splitSocials(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(/[\n,;]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeUrl(value?: string) {
  const cleaned = cleanValue(value);
  if (!cleaned) return undefined;
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  return `https://${cleaned}`;
}

function findTown(rawTown?: string): TownOption | undefined {
  const cleaned = cleanValue(rawTown);
  if (!cleaned) return undefined;

  const normalized = normalizeText(cleaned);
  return TOWNS.find(
    (town) => normalizeText(town.name) === normalized || normalizeText(town.slug) === normalized,
  );
}

function parseRegions(rawRegions?: string, town?: TownOption) {
  const parsed = splitList(rawRegions)
    .map((item) => REGION_MAP[normalizeText(item)])
    .filter((item): item is string => Boolean(item) && item !== "tbd");

  if (town?.region) parsed.unshift(town.region);

  return Array.from(new Set(parsed));
}

function deriveNeeds(role?: string, topics?: string[], about?: string) {
  const haystack = normalizeText([role, ...(topics ?? []), about].filter(Boolean).join(" "));
  const needs = new Set<IntakeNeed>(DEFAULT_NEEDS);

  if (
    haystack.includes("preparacion") ||
    haystack.includes("logistica") ||
    haystack.includes("coordinacion") ||
    haystack.includes("document")
  ) {
    needs.add("documentos");
  }

  if (
    haystack.includes("cuidado") ||
    haystack.includes("paliativo") ||
    haystack.includes("hogar") ||
    haystack.includes("acompanamiento directo")
  ) {
    needs.add("cuidado_en_casa");
  }

  if (
    haystack.includes("funebr") ||
    haystack.includes("entierro") ||
    haystack.includes("cremacion") ||
    haystack.includes("disposicion de cuerpo") ||
    haystack.includes("memorial")
  ) {
    needs.add("funeraria_memorial");
  }

  return Array.from(needs);
}

function getPhone(row: SheetRow) {
  return cleanValue(row["Número de teléfono"] ?? row["Numero de telefono"]);
}

function buildDoulaResource(row: SheetRow): ResourceItem | null {
  const firstName = cleanValue(row.Nombre);
  const lastName = cleanValue(row["Apellido(s)"]);
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!name) return null;

  const town = findTown(row["*Pueblo de Residencia*"]);
  const organization = cleanValue(row["Organización/Proyecto"]);
  const website = normalizeUrl(row["*Página web*"]);
  const socials = splitSocials(row["Redes sociales:*"]).map((item) => normalizeUrl(item) ?? item);
  const training = cleanValue(row.Formación);
  const credentials = cleanValue(row.Credenciales);
  const role = cleanValue(row.Rol) ?? "Doula de Final de Vida";
  const topics = splitList(row["*Temas/Áreas"]);
  const about = cleanValue(row["*Sobre ti*"]);
  const submittedAt = cleanValue(row["Submitted At"]);
  const token = cleanValue(row.Token);
  const regions = parseRegions(row["*Regiones* "], town);
  const trainingAndCredentials = Array.from(
    new Set([training, credentials].filter((value): value is string => Boolean(value))),
  );

  return {
    id: `doulas_live-${slugify(name)}`,
    category: "doula",
    source: "doulas_live",
    name,
    town: town?.name ?? cleanValue(row["*Pueblo de Residencia*"]),
    townSlug: town?.slug,
    region: town?.region,
    regions,
    phone: getPhone(row),
    email: cleanValue(row["Correo electrónico"]),
    website,
    socials,
    organization,
    description: about,
    summary: role,
    services: Array.from(new Set([...topics, ...splitList(role)])),
    needs: deriveNeeds(role, topics, about),
    stages: ["murio", "final_de_vida", "planificando"],
    careSettings: ["hogar", "hospital", "hospicio", "otro"],
    sourceLabel: "Directorio de Doulas de Final de Vida de Puerto Rico_LIVE",
    sourceUrls: [LIVE_DOULAS_SOURCE_URL],
    details: {
      training,
      credentials,
      trainingCredentials: trainingAndCredentials,
      role,
      topics,
      about,
      submittedAt,
      token,
    },
  };
}

export async function getLiveDoulaResources(options?: { forceFresh?: boolean }) {
  try {
    const response = await fetch(LIVE_DOULAS_EXPORT_URL, {
      cache: options?.forceFresh ? "no-store" : "force-cache",
      next: options?.forceFresh
        ? undefined
        : {
            revalidate: 60 * 60 * 24,
            tags: [LIVE_DOULAS_CACHE_TAG],
          },
    });

    if (!response.ok) {
      throw new Error(`No se pudo leer la hoja viva de doulas (${response.status}).`);
    }

    const csv = await response.text();
    const rows = parse(csv, {
      columns: true,
      bom: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }) as SheetRow[];

    const resources = new Map<string, ResourceItem>();
    for (const row of rows) {
      const resource = buildDoulaResource(row);
      if (resource) resources.set(resource.id, resource);
    }

    return Array.from(resources.values()).sort((left, right) =>
      left.name.localeCompare(right.name, "es"),
    );
  } catch {
    return null;
  }
}
