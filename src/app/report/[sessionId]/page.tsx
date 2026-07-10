"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import ProbabilityBar from "@/components/ProbabilityBar";
import { FullReport } from "@/lib/engine/report-generator";

export default function ReportPage() {
  const params = useParams<{ sessionId: string }>();
  const [report, setReport] = useState<FullReport | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/report/${params.sessionId}`);
      const data = await res.json();
      setReport(data);
    }
    load();
  }, [params.sessionId]);

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">Generando tu informe...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wide text-accent">
          Tu informe de Eneagrama
        </span>
        <ThemeToggle />
      </div>

      <h1 className="mb-2 text-4xl font-semibold text-text">
        Tipo {report.typeResult} — {report.typeName}
      </h1>
      <p className="mb-1 text-text-muted">
        Ala probable: {report.wing?.wing} (confianza {report.wing?.confidence})
        {report.instinctLabel ? ` · Subtipo: ${report.instinctLabel}` : ""}
      </p>
      <p className="mb-8 text-sm text-text-muted">
        Confianza del resultado:{" "}
        <span className="font-medium text-text">
          {report.confidenceLabel} ({Math.round(report.confidence * 100)}%)
        </span>
      </p>

      <Section title="Resumen">
        <p className="leading-relaxed text-text">{report.summary}</p>
      </Section>

      {report.inconsistencyNotes.length > 0 && (
        <Section title="Notas sobre consistencia">
          {report.inconsistencyNotes.map((n, i) => (
            <p key={i} className="mb-2 text-sm leading-relaxed text-text-muted">
              {n}
            </p>
          ))}
        </Section>
      )}

      <Section title="Fundamentos psicológicos">
        <Field label="Miedo central" value={report.basicFear} />
        <Field label="Deseo central" value={report.basicDesire} />
        <Field label="Motivación inconsciente" value={report.motivation} />
        <Field label="Fijación" value={report.fixation} />
        <Field label="Pasión" value={report.passion} />
        <Field label="Virtud" value={report.virtue} />
        <Field label="Mecanismo de defensa" value={report.defenseMechanism} />
      </Section>

      <Section title="Bajo estrés y en seguridad">
        <Field label="Bajo estrés" value={report.underStress} />
        <Field label="En seguridad" value={report.inSecurity} />
      </Section>

      <Section title="Fortalezas y puntos ciegos">
        <ListField label="Fortalezas" items={report.strengths} />
        <ListField label="Puntos ciegos" items={report.blindSpots} />
      </Section>

      <Section title="Ranking completo de los 9 tipos">
        <div className="flex flex-col gap-3">
          {report.typeRanking.map((r) => (
            <ProbabilityBar
              key={r.type}
              label={`Tipo ${r.type} — ${r.name}`}
              probability={r.probability}
              highlight={r.type === report.typeResult}
            />
          ))}
        </div>
      </Section>

      {report.instinctRanking && (
        <Section title="Ranking de los 3 instintos">
          <div className="flex flex-col gap-3">
            {report.instinctRanking.map((r) => (
              <ProbabilityBar
                key={r.instinct}
                label={r.label}
                probability={r.probability}
                highlight={r.instinct === report.instinctResult}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="¿Por qué no otros tipos?">
        <div className="flex flex-col gap-4">
          {report.possibleConfusions.map((c) => (
            <div key={c.type} className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-1 font-medium text-text">
                Tipo {c.type} — {c.name}
              </p>
              <p className="text-sm leading-relaxed text-text-muted">{c.whyNot}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 border-t border-border pt-6">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-text">{value}</p>
    </div>
  );
}

function ListField({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <ul className="list-inside list-disc text-text">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
