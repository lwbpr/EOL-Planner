import fallbackDirectory from "@/data/module-1/resource-directory.json";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ResourceCategory, ResourceItem } from "@/lib/module-1/types";

export const FALLBACK_RESOURCE_DIRECTORY = fallbackDirectory as ResourceItem[];

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  doula: "Doulas de Final de Vida",
  apoyo_complementario: "Otros apoyos complementarios",
  hospicio: "Hospicios y Cuidados Paliativos",
  servicio_funebre: "Servicios Fúnebres",
};

export function getCategoryLabel(category: ResourceCategory) {
  return CATEGORY_LABELS[category];
}

type DirectoryCounts = {
  total: number;
  byCategory: Record<ResourceCategory, number>;
};

function buildCounts(resources: ResourceItem[]): DirectoryCounts {
  return resources.reduce<DirectoryCounts>(
    (accumulator, resource) => {
      accumulator.total += 1;
      accumulator.byCategory[resource.category] += 1;
      return accumulator;
    },
    {
      total: 0,
      byCategory: {
        doula: 0,
        apoyo_complementario: 0,
        hospicio: 0,
        servicio_funebre: 0,
      },
    },
  );
}

export const FALLBACK_DIRECTORY_COUNTS = buildCounts(FALLBACK_RESOURCE_DIRECTORY);

const TOWN_ALIASES: Record<string, { town: string; townSlug: string; region: string }> = {
  "hato-rey": {
    town: "San Juan",
    townSlug: "san-juan",
    region: "metro",
  },
  "rio-piedras": {
    town: "San Juan",
    townSlug: "san-juan",
    region: "metro",
  },
};

function canonicalizeTown(resource: ResourceItem): ResourceItem {
  const alias =
    (resource.townSlug && TOWN_ALIASES[resource.townSlug]) ||
    (resource.town && TOWN_ALIASES[resource.town.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "-")]);

  if (!alias) return resource;

  return {
    ...resource,
    town: alias.town,
    townSlug: alias.townSlug,
    region: alias.region,
    regions: resource.regions.includes(alias.region)
      ? resource.regions
      : [alias.region, ...resource.regions],
  };
}

function normalizeSupabaseResource(record: Record<string, unknown>): ResourceItem {
  return {
    id: String(record.id),
    category: record.category as ResourceCategory,
    source: String(record.source ?? ""),
    name: String(record.name ?? ""),
    town: (record.town as string | null) ?? undefined,
    townSlug: (record.town_slug as string | null) ?? undefined,
    region: (record.region as string | null) ?? undefined,
    regions: Array.isArray(record.regions) ? (record.regions as string[]) : [],
    phone: (record.phone as string | null) ?? undefined,
    email: (record.email as string | null) ?? undefined,
    website: (record.website as string | null) ?? undefined,
    socials: Array.isArray(record.socials) ? (record.socials as string[]) : [],
    address: (record.address as string | null) ?? undefined,
    organization: (record.organization as string | null) ?? undefined,
    description: (record.description as string | null) ?? undefined,
    summary: String(record.summary ?? ""),
    services: Array.isArray(record.services) ? (record.services as string[]) : [],
    needs: Array.isArray(record.needs) ? (record.needs as ResourceItem["needs"]) : [],
    stages: Array.isArray(record.stages) ? (record.stages as ResourceItem["stages"]) : [],
    careSettings: Array.isArray(record.care_settings)
      ? (record.care_settings as ResourceItem["careSettings"])
      : [],
    sourceLabel: String(record.source_label ?? ""),
    sourceUrls: Array.isArray(record.source_urls) ? (record.source_urls as string[]) : [],
    coverage: (record.coverage as string | null) ?? undefined,
    verification: (record.verification as string | null) ?? undefined,
    details:
      record.details && typeof record.details === "object"
        ? (record.details as ResourceItem["details"])
        : undefined,
  };
}

export async function getResourceDirectory() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return FALLBACK_RESOURCE_DIRECTORY.map((resource) => canonicalizeTown(resource));
  }

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("category", { ascending: true })
    .order("town", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data || data.length === 0) {
    return FALLBACK_RESOURCE_DIRECTORY.map((resource) => canonicalizeTown(resource));
  }

  return data.map((record) => canonicalizeTown(normalizeSupabaseResource(record)));
}

export async function getDirectoryCounts() {
  return buildCounts(await getResourceDirectory());
}
