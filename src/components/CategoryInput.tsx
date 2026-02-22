import { useState, useCallback } from "react";

interface CategoryInputProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  minItems?: number;
  onContinue: () => void;
  continueLabel?: string;
}

export default function CategoryInput({
  items,
  onItemsChange,
  minItems = 4,
  onContinue,
  continueLabel = "Continue",
}: CategoryInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addItem = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onItemsChange([...items, trimmed]);
      setInputValue("");
    }
  }, [inputValue, items, onItemsChange]);

  const removeItem = useCallback(
    (index: number) => {
      onItemsChange(items.filter((_, i) => i !== index));
    },
    [items, onItemsChange]
  );

  const canContinue = items.length >= minItems;

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          placeholder="Add an item..."
          className="flex-1 py-2 px-3 border border-[var(--color-border)] bg-[var(--color-surface)] rounded text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]"
          aria-label="Add item"
        />
        <button
          type="button"
          onClick={addItem}
          className="py-2 px-4 border border-[var(--color-border)] bg-[var(--color-surface)] rounded hover:bg-[var(--color-bg-subtle)]"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-sm border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="ml-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] leading-none"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <p className="text-sm text-[var(--color-ink-muted)]">
        Add at least {minItems} items to continue.
      </p>
      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full py-3 px-4 bg-[var(--color-accent)] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)]"
      >
        {continueLabel}
      </button>
    </div>
  );
}
