"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { TOWNS, type CareSetting, type IntakeNeed, type IntakeStage } from "@/lib/module-1/types";

const stages: Array<{ value: IntakeStage; label: string; hint: string }> = [
  {
    value: "murio",
    label: "La persona ya murió",
    hint: "Necesitamos orientación inmediata, gestiones o apoyo para la familia.",
  },
  {
    value: "final_de_vida",
    label: "Está en proceso de final de vida",
    hint: "Estamos cuidando ahora mismo o evaluando opciones de cuidado.",
  },
  {
    value: "planificando",
    label: "Estamos planificando con anticipación",
    hint: "Queremos entender opciones, documentos y próximos pasos.",
  },
];

const careSettings: Array<{ value: CareSetting; label: string }> = [
  { value: "hogar", label: "En el hogar" },
  { value: "hospital", label: "En hospital" },
  { value: "hospicio", label: "Buscando hospicio" },
  { value: "otro", label: "Otro escenario" },
];

const needs: Array<{ value: IntakeNeed; label: string; detail: string }> = [
  {
    value: "hospicio",
    label: "Hospicio",
    detail: "Identificar opciones cercanas y saber qué preguntar.",
  },
  {
    value: "cuidado_en_casa",
    label: "Cuidado en casa",
    detail: "Apoyo práctico para cuidar en el hogar.",
  },
  {
    value: "documentos",
    label: "Documentos y gestiones",
    detail: "Orientación sobre trámites y organización.",
  },
  {
    value: "funeraria_memorial",
    label: "Orientación funeraria o memorial",
    detail: "Próximos pasos después de una muerte o planificación.",
  },
  {
    value: "acompanamiento",
    label: "Acompañamiento emocional o doula",
    detail: "Apoyo humano y contención en este proceso.",
  },
  {
    value: "apoyo_familiar",
    label: "Apoyo para la familia y cuidadoras",
    detail: "Coordinar ayuda y reducir carga práctica.",
  },
];

export function IntakeForm() {
  const router = useRouter();
  const defaultTown = useMemo(() => TOWNS[0], []);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="rounded-[2rem] border border-white/50 bg-white/85 p-7 shadow-[0_24px_80px_rgba(71,60,53,0.08)] backdrop-blur md:p-8"
        action="/resultados"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const query = new URLSearchParams(
            Object.fromEntries(formData.entries()) as Record<string, string>,
          );
          router.push(`/resultados?${query.toString()}`);
        }}
      >
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Módulo 1
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--ink)]">
            Empecemos por entender tu situación.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Contesta estas preguntas para que el sistema pueda mostrarte pasos
            útiles y recursos más cercanos a tu realidad en Puerto Rico.
          </p>
        </div>

        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--ink)]">
              ¿En qué momento están?
            </legend>
            <div className="grid gap-3">
              {stages.map((stage) => (
                <label
                  key={stage.value}
                  className="flex cursor-pointer gap-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--line-strong)] hover:bg-white"
                >
                  <input
                    className="mt-1 h-4 w-4 accent-[var(--accent-strong)]"
                    type="radio"
                    name="stage"
                    value={stage.value}
                    defaultChecked={stage.value === "final_de_vida"}
                  />
                  <span>
                    <span className="block font-semibold text-[var(--ink)]">
                      {stage.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                      {stage.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">
                ¿Dónde ocurre o ocurrirá el cuidado?
              </span>
              <select
                name="care_setting"
                defaultValue="hogar"
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none ring-0 transition focus:border-[var(--accent-strong)]"
              >
                {careSettings.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">
                Pueblo principal
              </span>
              <select
                name="town"
                defaultValue={defaultTown.slug}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none ring-0 transition focus:border-[var(--accent-strong)]"
              >
                {TOWNS.map((town) => (
                  <option key={town.slug} value={town.slug}>
                    {town.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-[var(--ink)]">
              ¿Qué necesitas ahora mismo?
            </legend>
            <div className="grid gap-3 md:grid-cols-2">
              {needs.map((need) => (
                <label
                  key={need.value}
                  className="flex cursor-pointer gap-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--line-strong)] hover:bg-white"
                >
                  <input
                    className="mt-1 h-4 w-4 accent-[var(--accent-strong)]"
                    type="radio"
                    name="need"
                    value={need.value}
                    defaultChecked={need.value === "hospicio"}
                  />
                  <span>
                    <span className="block font-semibold text-[var(--ink)]">
                      {need.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                      {need.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--ink)]">
              Contexto adicional
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Ejemplo: Estamos buscando hospicio para mi mamá en el área oeste y no sabemos qué documentos pedir."
              className="w-full rounded-3xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-7 text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)]"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            La próxima pantalla te mostrará una orientación inicial con pasos
            útiles y recursos priorizados según tu situación.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Ver orientación inicial
          </button>
        </div>
      </form>

      <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 md:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Lo que hará este flujo
        </p>
        <div className="mt-5 space-y-5">
          <div className="rounded-3xl bg-[var(--accent-soft)] p-4">
            <p className="font-semibold text-[var(--ink)]">
              Ubicar el tipo de momento
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
              No es lo mismo una muerte ya ocurrida que una búsqueda de hospicio
              o una planificación anticipada.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4">
            <p className="font-semibold text-[var(--ink)]">
              Cruce entre necesidad y territorio
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">
              El pueblo y el escenario de cuidado ayudan a mostrar opciones más
              cercanas y más útiles para Puerto Rico.
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--success-soft)] p-4">
            <p className="font-semibold text-[var(--success-strong)]">
              Camino hacia AMORir
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--success-strong)]">
              El resultado no termina en el directorio. También debe abrir una
              puerta clara a acompañamiento humano cuando haga falta.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
