"use client";

import { motion } from "framer-motion";

export default function ProbabilityBar({
  label,
  probability,
  highlight = false,
}: {
  label: string;
  probability: number;
  highlight?: boolean;
}) {
  const pct = Math.round(probability * 100);
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className={highlight ? "font-medium text-text" : "text-text-muted"}>{label}</span>
        <span className={highlight ? "font-medium text-text" : "text-text-muted"}>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
        <motion.div
          className={`h-full rounded-full ${highlight ? "bg-accent" : "bg-text-muted/50"}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
