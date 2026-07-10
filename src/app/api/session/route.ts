import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniformTypePosterior } from "@/lib/engine/bayesian-engine";

export async function POST() {
  const session = await prisma.session.create({
    data: {
      status: "in_progress",
      currentBlock: "center",
      typePosterior: uniformTypePosterior(),
    },
  });

  return NextResponse.json({ sessionId: session.id });
}
