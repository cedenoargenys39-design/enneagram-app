import { PrismaClient } from "@prisma/client";
import { QUESTION_BANK } from "../src/lib/data/question-bank";

const prisma = new PrismaClient();

async function main() {
  console.log(`Sembrando ${QUESTION_BANK.length} preguntas...`);

  for (let i = 0; i < QUESTION_BANK.length; i++) {
    const q = QUESTION_BANK[i];
    await prisma.question.upsert({
      where: { code: q.code },
      update: {
        block: q.block,
        dimension: q.dimension,
        text: q.text,
        scaleType: q.scaleType,
        mirrorGroup: q.mirrorGroup ?? null,
        order: i,
      },
      create: {
        code: q.code,
        block: q.block,
        dimension: q.dimension,
        text: q.text,
        scaleType: q.scaleType,
        mirrorGroup: q.mirrorGroup ?? null,
        order: i,
        options: {
          create: q.options.map((o, idx) => ({
            text: o.text,
            order: idx,
            typeWeights: o.typeWeights,
            instinctWeights: o.instinctWeights ?? undefined,
          })),
        },
      },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
