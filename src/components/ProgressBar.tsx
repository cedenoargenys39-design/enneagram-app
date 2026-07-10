"use client";

import { motion } from "framer-motion";

export default function ProgressBar({
  answered,
  total,
  blockLabel,
}: {
  answered: number;
  total: number;
  blockLabel: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;
  const estimatedMinutesLeft = Math.max(1, Math.round(((total - answered) * 12) / 60));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm text-text-muted">
        <span>{blockLabel}</span>
        <span>
          {answered} / {total} · ~{estimatedMinutesLeft} min restantes
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
