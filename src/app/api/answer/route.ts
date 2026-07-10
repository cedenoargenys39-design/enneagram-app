import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  TypePosterior,
  InstinctPosterior,
  updateTypePosterior,
  updateInstinctPosterior,
  mirrorPairInconsistency,
  aggregateInconsistency,
} from "@/lib/engine/bayesian-engine";
import { ALL_TYPES } from "@/lib/engine/weights";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, questionId, optionId, responseTimeMs } = body as {
    sessionId: string;
    questionId: string;
    optionId: string;
    responseTimeMs: number;
  };

  if (!sessionId || !questionId || !optionId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const [session, question, option] = await Promise.all([
    prisma.session.findUnique({ where: { id: sessionId } }),
    prisma.question.findUnique({ where: { id: questionId } }),
    prisma.option.findUnique({ where: { id: optionId } }),
  ]);

  if (!session || !question || !option) {
    return NextResponse.json({ error: "Sesión, pregunta u opción no encontrada" }, { status: 404 });
  }

  // El cálculo del posterior ocurre exclusivamente en el servidor: el cliente
  // nunca ve los vectores de pesos, así que no puede manipular el resultado.
  const likelihood = option.typeWeights as unknown as Record<number, number>;
  const likelihoodTyped = Object.fromEntries(
    ALL_TYPES.map((t) => [t, likelihood[t]])
  ) as TypePosterior;

  const priorType = session.typePosterior as unknown as TypePosterior;
  const newTypePosterior = updateTypePosterior(priorType, likelihoodTyped);

  let newInstinctPosterior: InstinctPosterior | null = null;
  if (option.instinctWeights && session.instinctPosterior) {
    const instLikelihood = option.instinctWeights as unknown as InstinctPosterior;
    const priorInstinct = session.instinctPosterior as unknown as InstinctPosterior;
    newInstinctPosterior = updateInstinctPosterior(priorInstinct, instLikelihood);
  }

  // Detección de contradicciones: si esta pregunta pertenece a un mirrorGroup y
  // su pareja ya fue respondida, comparamos ambos vectores de verosimilitud.
  let newInconsistencyScore = session.inconsistencyScore;
  if (question.mirrorGroup) {
    const pairQuestion = await prisma.question.findFirst({
      where: { mirrorGroup: question.mirrorGroup, id: { not: question.id } },
    });
    if (pairQuestion) {
      const pairResponse = await prisma.response.findFirst({
        where: { sessionId, questionId: pairQuestion.id },
        include: { option: true },
      });
      if (pairResponse) {
        const pairLikelihood = Object.fromEntries(
          ALL_TYPES.map((t) => [t, (pairResponse.option.typeWeights as any)[t]])
        ) as TypePosterior;
        const distance = mirrorPairInconsistency(likelihoodTyped, pairLikelihood);
        // Promedio simple incremental de inconsistencia (aproximación; en v2 se
        // puede guardar el historial completo de distancias por sesión).
        newInconsistencyScore = aggregateInconsistency([session.inconsistencyScore, distance]);
      }
    }
  }

  await prisma.response.create({
    data: {
      sessionId,
      questionId,
      optionId,
      responseTimeMs: responseTimeMs ?? 0,
    },
  });

  const updatedSession = await prisma.session.update({
    where: { id: sessionId },
    data: {
      typePosterior: newTypePosterior as any,
      instinctPosterior: newInstinctPosterior ? (newInstinctPosterior as any) : undefined,
      inconsistencyScore: newInconsistencyScore,
    },
  });

  return NextResponse.json({
    ok: true,
    inconsistencyScore: updatedSession.inconsistencyScore,
  });
}
