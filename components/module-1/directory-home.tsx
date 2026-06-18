import Link from "next/link";
import { AmorirSupportCard } from "@/components/module-1/amorir-support-card";
import { DirectoryBrowser } from "@/components/module-1/directory-browser";
import { getDirectoryCounts, getResourceDirectory } from "@/lib/module-1/resource-directory";

type DirectoryHomeProps = {
  backLink?: {
    href: string;
    label: string;
  };
};

export async function DirectoryHome({ backLink }: DirectoryHomeProps) {
  const directoryCounts = await getDirectoryCounts();
  const resourceDirectory = await getResourceDirectory();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Directorio de recursos
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
              Recursos de final de vida en Puerto Rico
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
              Este directorio reúne las tres bases compartidas para crear una
              primera vista unificada de doulas, hospicios y servicios fúnebres
              en Puerto Rico.
            </p>
          </div>
          {backLink ? (
            <Link
              href={backLink.href}
              className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
            >
              {backLink.label}
            </Link>
          ) : null}
        </div>
      </section>

      <DirectoryBrowser
        directoryCounts={directoryCounts}
        resourceDirectory={resourceDirectory}
      />

      <AmorirSupportCard />
    </main>
  );
}
