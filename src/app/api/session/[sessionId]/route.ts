import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shouldTriggerAdaptiveBranch } from "@/lib/engine/bayesian-engine";

// Orden de bloques del flujo. El bloque "type_adaptive" es opcional y se activa
// dinámicamente si hay ambigüedad real entre los dos tipos más probables.
const BLOCK_ORDER = ["center", "type", "type_adaptive", "subtype", "done"] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await prisma.session.findUnique({
    where: { id: params.sessionId },
    include: { responses: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }

  const answeredQuestionIds = new Set(session.responses.map((r) => r.questionId));

  // Trae todas las preguntas activas del bloque actual, en orden, excluyendo las ya respondidas.
  const questions = await prisma.question.findMany({
    where: { active: true, block: session.currentBlock === "type_adaptive" ? "type" : session.currentBlock },
    orderBy: { order: "asc" },
    include: { options: { orderBy: { order: "asc" }, select: { id: true, text: true, order: true } } },
  });

  const pending = questions.filter((q) => !answeredQuestionIds.has(q.id));

  const totalQuestions = await prisma.question.count({ where: { active: true } });
  const progress = {
    answered: session.responses.length,
    total: totalQuestions,
    currentBlock: session.currentBlock,
  };

  return NextResponse.json({
    session: {
      id: session.id,
      status: session.status,
      currentBlock: session.currentBlock,
      typePosterior: session.typePosterior,
    },
    pendingQuestions: pending.map((q) => ({
      id: q.id,
      code: q.code,
      block: q.block,
      dimension: q.dimension,
      text: q.text,
      scaleType: q.scaleType,
      options: q.options,
    })),
    progress,
  });
}

// Avanza manualmente de bloque cuando el frontend detecta que ya no quedan
// preguntas pendientes en el bloque actual.
export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const session = await prisma.session.findUnique({ where: { id: params.sessionId } });
  if (!session) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }

  const idx = BLOCK_ORDER.indexOf(session.currentBlock as (typeof BLOCK_ORDER)[number]);

  let nextBlock = BLOCK_ORDER[Math.min(idx + 1, BLOCK_ORDER.length - 1)];

  // Si el bloque actual era "type" y no hay ambigüedad real, se salta "type_adaptive".
  if (session.currentBlock === "type") {
    const posterior = session.typePosterior as Record<string, number>;
    const numericPosterior = Object.fromEntries(
      Object.entries(posterior).map(([k, v]) => [Number(k), v as number])
    ) as Record<number, number>;
    const ambiguous = shouldTriggerAdaptiveBranch(numericPosterior as any, 1);
    if (!ambiguous) nextBlock = "subtype";
  }

  const updated = await prisma.session.update({
    where: { id: params.sessionId },
    data: {
      currentBlock: nextBlock,
      status: nextBlock === "done" ? "completed" : session.status,
      instinctPosterior:
        nextBlock === "subtype" && !session.instinctPosterior
          ? ({ SP: 1 / 3, SO: 1 / 3, SX: 1 / 3 } as any)
          : undefined,
    },
  });

  return NextResponse.json({ currentBlock: updated.currentBlock, status: updated.status });
}
