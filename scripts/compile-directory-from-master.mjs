#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const MASTER_SHEET_ID = "1h8z31za5u11LI_zmg2lhyU1AT3r6zlkuOQs55Y-XNqU";
const MASTER_TAB = "AMORir EOL Directory Master v0";
const MASTER_RANGE = `'${MASTER_TAB}'!A1:CN1000`;

const PUBLIC_STATUSES = new Set(["publicar"]);
const VALID_STATUSES = new Set(["publicar", "revisar", "ocultar"]);
const CURRENT_CATEGORIES = new Set([
  "doula",
  "apoyo_complementario",
  "hospicio",
  "servicio_funebre",
]);
const FUTURE_CATEGORIES = new Set(["cuidado_personas_mayores"]);
const SOURCE_URL_HOSTS = [
  "nationalhospicelocator.com",
  "superpagespr.com",
  "oppea.pr.gov/directorio-de-servicios-copy",
];
const SOURCE_CODES_BY_CATEGORY = {
  doula: "doulas_live",
  hospicio: "hospicios_pr",
  servicio_funebre: "servicios_funebres_pr",
  apoyo_complementario: "older_adults_verified_directory",
};

function parseArgs(argv) {
  const args = {
    input: "",
    out: "",
    dryRun: false,
    includeReview: false,
    includeHidden: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") args.input = argv[++index] || "";
    else if (arg === "--out") args.out = argv[++index] || "";
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--include-review") args.includeReview = true;
    else if (arg === "--include-hidden") args.includeHidden = true;
    else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Compile AMORir EOL Directory Master into platform JSON.

Usage:
  node scripts/compile-directory-from-master.mjs --dry-run
  node scripts/compile-directory-from-master.mjs --out data/module-1/resource-directory.compiled.json

Options:
  --input <path>       Read a saved gog JSON response instead of live Google Sheets.
  --out <path>         Write compiled ResourceItem[] JSON to this path.
  --dry-run            Validate and print summary only.
  --include-review     Include rows marked revisar. Default: excluded.
  --include-hidden     Include rows marked ocultar. Default: excluded.
`);
}

function fetchMasterValues(inputPath) {
  if (inputPath) {
    const payload = JSON.parse(readFileSync(resolve(inputPath), "utf8"));
    return payload.values || payload;
  }

  const output = execFileSync(
    "gog",
    [
      "sheets",
      "get",
      MASTER_SHEET_ID,
      MASTER_RANGE,
      "--json",
      "--no-input",
    ],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 },
  );
  return JSON.parse(output).values || [];
}

function rowsFromValues(values) {
  const headers = values[0] || [];
  return values
    .slice(1)
    .filter((row) => row.some((cell) => clean(cell)))
    .map((row, index) => {
      const record = { _sheetRow: index + 2 };
      headers.forEach((header, columnIndex) => {
        if (header) record[header] = clean(row[columnIndex]);
      });
      return record;
    });
}

function clean(value) {
  return String(value ?? "").trim();
}

function splitList(value) {
  return clean(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function optional(value) {
  const cleaned = clean(value);
  return cleaned || undefined;
}

function slugify(value) {
  return clean(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isLikelySourceUrl(url) {
  const lower = clean(url).toLowerCase();
  return SOURCE_URL_HOSTS.some((host) => lower.includes(host));
}

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  );
}

function contactDetails(value) {
  const cleaned = clean(value);
  if (!cleaned) return undefined;

  if (cleaned.startsWith("{")) {
    try {
      const parsed = JSON.parse(cleaned);
      return compactObject({
        value: clean(parsed.value),
        emails: Array.isArray(parsed.emails) ? parsed.emails.map(clean).filter(Boolean) : [],
        phones: Array.isArray(parsed.phones) ? parsed.phones.map(clean).filter(Boolean) : [],
      });
    } catch {
      // Fall through and parse as a plain contact string.
    }
  }

  const emails = cleaned.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  const phones = cleaned.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || [];

  return compactObject({
    value: cleaned,
    emails,
    phones,
  });
}

function detailObject(row) {
  const detailFields = {
    doula_training: "training",
    doula_credentials: "credentials",
    doula_role: "role",
    doula_topics: "topics",
    doula_about: "about",
    doula_submitted_at: "submittedAt",
    doula_consent_public_listing: "consentPublicListing",
    hospice_quality_score: "qualityScore",
    hospice_quality_score_calculation: "qualityScoreCalculation",
    hospice_ownership: "ownership",
    hospice_medicare_certified: "medicareCertified",
    hospice_year_medicare_certification: "yearMedicareCertification",
    hospice_number_served_daily: "numberServedDaily",
    hospice_ceo_administrator: "ceoAdministrator",
    hospice_capacity_notes: "capacityNotes",
    hospice_inpatient_facility: "hospiceInpatientFacility",
    hospice_quality_program_participant: "qualityProgramParticipant",
    hospice_circle_of_life_award: "circleOfLifeAward",
    hospice_pediatric_services: "pediatricServices",
    hospice_veteran_programs: "veteranPrograms",
    hospice_faith_based: "faithBased",
    hospice_community_bereavement: "communityBereavement",
    hospice_home_patients_75_plus: "homePatients75Plus",
    hospice_certified_mds_75_plus: "certifiedMDs75Plus",
    hospice_certified_rns_75_plus: "certifiedRNs75Plus",
    hospice_certified_rn_aides_75_plus: "certifiedRNAides75Plus",
    hospice_urban_or_rural: "urbanOrRural",
    hospice_prison_hospice: "prisonHospice",
    hospice_facility_type: "facilityType",
    hospice_accredited_joint_commission: "accreditedJointCommission",
    hospice_accredited_chap: "accreditedCHAP",
    hospice_accredited_achc: "accreditedACHC",
    hospice_accredited_other: "accreditedOtherOrg",
    hospice_member_prhpca: "memberPRHPCA",
    hospice_member_nhpco: "memberNHPCO",
    hospice_member_nahc: "memberNAHC",
    hospice_member_vnaa: "memberVNAA",
    hospice_detail_source: "detailSource",
    apoyo_subcategory: "subcategory",
    apoyo_current_source_notes: "currentSourceNotes",
    funebre_tipo_principal: "tipoPrincipal",
    funebre_cremacion: "cremacion",
    funebre_velatorio_capillas: "velatorioCapillas",
    funebre_pre_arreglos: "preArreglos",
    funebre_traslados: "traslados",
    funebre_horario: "horario",
    funebre_abierto_24_7: "abierto247",
    funebre_formas_pago: "formasPago",
    funebre_redes_sociales: "redesSociales",
    funebre_fuente_principal: "fuentePrincipal",
    funebre_url_fuente: "urlFuente",
    funebre_fuente_secundaria: "fuenteSecundaria",
    funebre_url_fuente_secundaria: "urlFuenteSecundaria",
    funebre_nivel_detalle: "nivelDetalle",
    funebre_notas: "notas",
    phone_secondary: "phoneSecondary",
  };

  const details = {};
  for (const [sourceField, detailField] of Object.entries(detailFields)) {
    const value = optional(row[sourceField]);
    if (!value) continue;
    details[detailField] =
      sourceField.endsWith("_topics") ||
      sourceField === "funebre_formas_pago" ||
      sourceField === "funebre_redes_sociales"
      ? splitList(value)
      : value;
  }

  if (row.hospice_ceo_administrator_contact) {
    details.ceoAdministratorContact = contactDetails(row.hospice_ceo_administrator_contact);
  }
  if (row.category === "servicio_funebre" && row.coverage) {
    details.cobertura = row.coverage;
  }

  return compactObject(details);
}

function compileResource(row) {
  const details = detailObject(row);
  const sourceUrls = splitList(row.source_urls);

  if (row.public_notes) {
    details.publicNotes = row.public_notes;
  }
  if (row.category === "apoyo_complementario" && row.last_verified) {
    details.verifiedAsOf = row.last_verified;
  }

  return compactObject({
    id: row.id || `${row.category}-${slugify(row.name)}`,
    category: row.category,
    source: SOURCE_CODES_BY_CATEGORY[row.category] || row.source_sheet,
    name: row.name,
    town: optional(row.town),
    townSlug: optional(row.town_slug),
    region: optional(row.region),
    regions: splitList(row.regions),
    phone: optional(row.phone),
    email: optional(row.email),
    website: optional(row.website),
    socials: splitList(row.socials),
    address: optional(row.address),
    organization: optional(row.organization),
    description: optional(row.description),
    summary: row.summary || row.description || "",
    services: splitList(row.services),
    needs: splitList(row.needs),
    stages: splitList(row.stages),
    careSettings: splitList(row.care_settings),
    sourceLabel: row.source_label || row.source_sheet || "",
    sourceUrls,
    coverage: optional(row.coverage),
    verification: optional(row.verification),
    details,
  });
}

function validateRows(rows) {
  const seenIds = new Map();
  const warnings = [];
  const errors = [];

  for (const row of rows) {
    if (!row.id) errors.push(`Row ${row._sheetRow}: missing id`);
    if (!row.name) errors.push(`Row ${row._sheetRow}: missing name`);
    if (!row.category) errors.push(`Row ${row._sheetRow}: missing category`);
    if (!row.publication_status) errors.push(`Row ${row._sheetRow}: missing publication_status`);
    if (row.publication_status && !VALID_STATUSES.has(row.publication_status)) {
      errors.push(`Row ${row._sheetRow}: invalid publication_status "${row.publication_status}"`);
    }
    if (
      row.category &&
      !CURRENT_CATEGORIES.has(row.category) &&
      !FUTURE_CATEGORIES.has(row.category)
    ) {
      errors.push(`Row ${row._sheetRow}: unknown category "${row.category}"`);
    }
    if (row.category && FUTURE_CATEGORIES.has(row.category)) {
      warnings.push(`Row ${row._sheetRow}: future category "${row.category}" is reserved but not platform-integrated yet`);
    }
    if (row.website && isLikelySourceUrl(row.website)) {
      warnings.push(`Row ${row._sheetRow}: website appears to be a source URL, not a provider website (${row.name})`);
    }
    if (row.socials && !splitList(row.socials).every((social) => /^(https?:\/\/|www\.|@)/i.test(social))) {
      warnings.push(`Row ${row._sheetRow}: socials should contain only public URLs or verifiable handles (${row.name})`);
    }
    if (row.internal_notes && row.publication_status === "publicar") {
      warnings.push(`Row ${row._sheetRow}: internal_notes present and will be excluded from public JSON (${row.name})`);
    }
    if (seenIds.has(row.id)) {
      errors.push(`Rows ${seenIds.get(row.id)} and ${row._sheetRow}: duplicate id "${row.id}"`);
    } else if (row.id) {
      seenIds.set(row.id, row._sheetRow);
    }
  }

  return { errors, warnings };
}

function shouldInclude(row, args) {
  if (PUBLIC_STATUSES.has(row.publication_status)) return true;
  if (args.includeReview && row.publication_status === "revisar") return true;
  if (args.includeHidden && row.publication_status === "ocultar") return true;
  return false;
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = row[key] || "(blank)";
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = rowsFromValues(fetchMasterValues(args.input));
  const validation = validateRows(rows);
  const includedRows = rows.filter((row) => shouldInclude(row, args));
  const resources = includedRows.map(compileResource);

  const summary = {
    masterRows: rows.length,
    compiledRows: resources.length,
    masterByStatus: countBy(rows, "publication_status"),
    compiledByCategory: countBy(resources, "category"),
    warnings: validation.warnings,
    errors: validation.errors,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (validation.errors.length > 0) {
    process.exitCode = 1;
    return;
  }

  if (args.out && !args.dryRun) {
    const outputPath = resolve(args.out);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(resources, null, 2)}\n`);
  }
}

main();
