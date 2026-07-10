import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReport } from "@/lib/engine/report-generator";
import { TypePosterior, InstinctPosterior } from "@/lib/engine/bayesian-engine";

const TOTAL_DIMENSIONS = 8; // miedo, deseo, defensa, conflicto, estres_seguridad + 3 ejes de subtipo agregados

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const existing = await prisma.report.findUnique({ where: { sessionId: params.sessionId } });
  if (existing) {
    return NextResponse.json(existing.fullData);
  }

  const session = await prisma.session.findUnique({
    where: { id: params.sessionId },
    include: { responses: { include: { question: true } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }

  const dimensionsCovered = new Set(session.responses.map((r) => r.question.dimension)).size;

  const report = generateReport({
    typePosterior: session.typePosterior as unknown as TypePosterior,
    instinctPosterior: session.instinctPosterior as unknown as InstinctPosterior | null,
    inconsistencyScore: session.inconsistencyScore,
    dimensionsCovered,
    totalDimensions: TOTAL_DIMENSIONS,
  });

  await prisma.report.create({
    data: {
      sessionId: session.id,
      typeResult: report.typeResult,
      wingResult: report.wing?.wing ?? null,
      instinctResult: report.instinctResult ?? null,
      confidence: report.confidence,
      fullData: report as any,
    },
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { status: "completed" },
  });

  return NextResponse.json(report);
}
