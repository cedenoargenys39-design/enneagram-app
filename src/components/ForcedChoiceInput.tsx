"use client";

interface Option {
  id: string;
  text: string;
  order: number;
}

export default function ForcedChoiceInput({
  options,
  onSelect,
}: {
  options: Option[];
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${options.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="focus-ring rounded-2xl border border-border bg-surface p-5 text-left transition-all hover:border-accent hover:shadow-soft"
        >
          <span className="text-[15px] leading-snug text-text">{opt.text}</span>
        </button>
      ))}
    </div>
  );
}
