"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import QuestionCard, { QuestionData } from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import ThemeToggle from "@/components/ThemeToggle";

const BLOCK_LABELS: Record<string, string> = {
  center: "Bloque 1 · Reacciones fundamentales",
  type: "Bloque 2 · Miedos, deseos y defensas",
  type_adaptive: "Bloque 2b · Desambiguación",
  subtype: "Bloque 3 · Subtipo instintivo",
  done: "Completado",
};

export default function TestPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QuestionData[]>([]);
  const [history, setHistory] = useState<QuestionData[]>([]);
  const [progress, setProgress] = useState({ answered: 0, total: 1, currentBlock: "center" });
  const [loading, setLoading] = useState(true);
  const questionStartRef = useRef<number>(Date.now());

  // Inicializa o retoma la sesión (persistida en localStorage).
  useEffect(() => {
    async function init() {
      let id = localStorage.getItem("enneagram_session_id");
      if (!id) {
        const res = await fetch("/api/session", { method: "POST" });
        const data = await res.json();
        id = data.sessionId;
        localStorage.setItem("enneagram_session_id", id!);
      }
      setSessionId(id);
    }
    init();
  }, []);

  const fetchQuestions = useCallback(async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/session/${id}`);
    const data = await res.json();

    if (data.pendingQuestions.length === 0 && data.session.currentBlock !== "done") {
      // No quedan preguntas en este bloque: avanzar de bloque y reintentar.
      await fetch(`/api/session/${id}`, { method: "POST" });
      return fetchQuestions(id);
    }

    if (data.session.currentBlock === "done") {
      router.push(`/report/${id}`);
      return;
    }

    setQueue(data.pendingQuestions);
    setProgress(data.progress);
    setLoading(false);
    questionStartRef.current = Date.now();
  }, [router]);

  useEffect(() => {
    if (sessionId) fetchQuestions(sessionId);
  }, [sessionId, fetchQuestions]);

  async function handleAnswer(optionId: string) {
    if (!sessionId || queue.length === 0) return;
    const current = queue[0];
    const responseTimeMs = Date.now() - questionStartRef.current;

    await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, questionId: current.id, optionId, responseTimeMs }),
    });

    const remaining = queue.slice(1);
    setHistory((h) => [...h, current]);
    setQueue(remaining);
    setProgress((p) => ({ ...p, answered: p.answered + 1 }));
    questionStartRef.current = Date.now();

    if (remaining.length === 0) {
      fetchQuestions(sessionId);
    }
  }

  function handleBack() {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setQueue((q) => [previous, ...q]);
    setProgress((p) => ({ ...p, answered: Math.max(0, p.answered - 1) }));
  }

  function handlePause() {
    router.push("/");
  }

  if (loading || queue.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">Cargando...</p>
      </main>
    );
  }

  const current = queue[0];

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={handlePause}
          className="focus-ring text-sm text-text-muted hover:text-text"
        >
          ← Pausar y guardar
        </button>
        <ThemeToggle />
      </div>

      <div className="mb-10">
        <ProgressBar
          answered={progress.answered}
          total={progress.total}
          blockLabel={BLOCK_LABELS[progress.currentBlock] ?? progress.currentBlock}
        />
      </div>

      <div className="flex-1">
        <QuestionCard question={current} onAnswer={handleAnswer} />
      </div>

      <div className="mt-10 flex justify-start">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className="focus-ring text-sm text-text-muted hover:text-text disabled:opacity-30"
        >
          ← Volver a la pregunta anterior
        </button>
      </div>
    </main>
  );
}
