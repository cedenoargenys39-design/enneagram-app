"use client";

interface Option {
  id: string;
  text: string;
  order: number;
}

export default function ScaleInput({
  options,
  onSelect,
}: {
  options: Option[];
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="focus-ring group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-all hover:border-accent hover:shadow-soft"
        >
          <span className="h-3 w-3 shrink-0 rounded-full border-2 border-border group-hover:border-accent" />
          <span className="text-[15px] text-text">{opt.text}</span>
        </button>
      ))}
    </div>
  );
}
