import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="mb-10 flex justify-end">
        <ThemeToggle />
      </div>

      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
        Eneagrama · Tipo y subtipo instintivo
      </p>
      <h1 className="mb-5 text-4xl font-semibold leading-tight text-text sm:text-5xl">
        Un test que mide motivación, no estereotipos
      </h1>
      <p className="mb-8 text-lg leading-relaxed text-text-muted">
        No te vamos a preguntar si eres “organizado” o si “te gusta ayudar”. Este test
        explora tus miedos y deseos fundamentales, tus mecanismos de defensa y cómo
        procesás el conflicto — las bases reales del Eneagrama, según Naranjo,
        Riso-Hudson y Chestnut.
      </p>

      <div className="mb-10 grid gap-4 rounded-2xl border border-border bg-surface p-6">
        <InfoRow label="Duración estimada" value="30–45 minutos" />
        <InfoRow label="Preguntas" value="~90 ítems en 3 bloques" />
        <InfoRow label="Podés" value="Pausar y retomar en cualquier momento" />
        <InfoRow label="Resultado" value="Tipo, ala, subtipo instintivo y nivel de confianza" />
      </div>

      <Link
        href="/test"
        className="focus-ring inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-center text-[15px] font-medium text-accent-fg transition-opacity hover:opacity-90 sm:w-fit"
      >
        Empezar el test →
      </Link>

      <p className="mt-6 text-xs leading-relaxed text-text-muted">
        Tu progreso se guarda automáticamente. El cálculo de resultados corre en el
        servidor para que ninguna respuesta pueda alterarse desde el navegador.
      </p>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="font-medium text-text">{value}</span>
    </div>
  );
}
