import towns from "@/data/module-1/towns.json";

export type TownSlug = string;
export type RegionSlug = string;

export type TownOption = {
  slug: TownSlug;
  name: string;
  region: RegionSlug;
};

export const TOWNS = towns as TownOption[];

export type IntakeStage = "murio" | "final_de_vida" | "planificando";
export type CareSetting = "hogar" | "hospital" | "hospicio" | "otro";
export type IntakeNeed =
  | "hospicio"
  | "cuidado_en_casa"
  | "documentos"
  | "funeraria_memorial"
  | "acompanamiento"
  | "apoyo_familiar";

export type ResourceCategory =
  | "doula"
  | "apoyo_complementario"
  | "hospicio"
  | "servicio_funebre";

export type ResourceDetails = Record<
  string,
  string | string[] | number | boolean | null | undefined
>;

export type ResourceItem = {
  id: string;
  category: ResourceCategory;
  source: string;
  name: string;
  town?: string;
  townSlug?: TownSlug | null;
  region?: RegionSlug | null;
  regions: RegionSlug[];
  phone?: string;
  email?: string;
  website?: string;
  socials?: string[];
  address?: string;
  organization?: string;
  description?: string;
  summary: string;
  services: string[];
  needs: IntakeNeed[];
  stages: IntakeStage[];
  careSettings: CareSetting[];
  sourceLabel: string;
  sourceUrls?: string[];
  coverage?: string;
  verification?: string;
  details?: ResourceDetails;
};

export type IntakePayload = {
  stage: IntakeStage;
  care_setting: CareSetting;
  town: TownSlug;
  need: IntakeNeed;
  notes?: string;
};
