"use client";

import { AnimatePresence, motion } from "framer-motion";
import ScaleInput from "./ScaleInput";
import ForcedChoiceInput from "./ForcedChoiceInput";

interface Option {
  id: string;
  text: string;
  order: number;
}

export interface QuestionData {
  id: string;
  code: string;
  block: string;
  dimension: string;
  text: string;
  scaleType: "likert6" | "forced_choice";
  options: Option[];
}

export default function QuestionCard({
  question,
  onAnswer,
}: {
  question: QuestionData;
  onAnswer: (optionId: string) => void;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full"
      >
        <h2 className="mb-6 text-xl font-medium leading-snug text-text sm:text-2xl">
          {question.text}
        </h2>
        {question.scaleType === "likert6" ? (
          <ScaleInput options={question.options} onSelect={onAnswer} />
        ) : (
          <ForcedChoiceInput options={question.options} onSelect={onAnswer} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
