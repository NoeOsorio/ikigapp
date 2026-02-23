import { useState, useCallback, useRef } from "react";
import { SEASON_CLASSES, type Season } from "../constants/categories";

interface CategoryInputProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  minItems?: number;
  onContinue: () => void;
  continueLabel?: string;
  season?: Season;
  onBack?: () => void;
  backLabel?: string;
  showBackButton?: boolean;
}

export default function CategoryInput({
  items,
  onItemsChange,
  minItems = 4,
  onContinue,
  continueLabel = "Continue",
  season = "spring",
  onBack,
  backLabel = "Back",
  showBackButton = false,
}: CategoryInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = SEASON_CLASSES[season];

  const addItem = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed) && items.length < 10) {
      onItemsChange([...items, trimmed]);
      setInputValue("");
      inputRef.current?.focus();
    }
  }, [inputValue, items, onItemsChange]);

  const removeItem = useCallback(
    (index: number) => {
      onItemsChange(items.filter((_, i) => i !== index));
      inputRef.current?.focus();
    },
    [items, onItemsChange]
  );

  const canContinue = items.length >= minItems;
  const pct = Math.min((items.length / minItems) * 100, 100);

  return (
    <div className="w-full max-w-[560px] space-y-5">
      <div className="flex items-center justify-between mb-4">
        {canContinue ? (
          <span className={`text-xs ${theme.accent} font-medium`}>Ready! ✓</span>
        ) : (
          <span className={`text-xs ${theme.muted} tracking-wide`}>
            {items.length} of {minItems} minimum
          </span>
        )}
      </div>
      <div className="h-1 rounded-full bg-black/10 overflow-hidden mb-6">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.progressGradient} transition-[width] duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div
        className={`flex flex-wrap gap-2.5 min-h-20 rounded-2xl p-4 content-start border-[1.5px] border-dashed ${theme.border} ${theme.inputBg} mb-4`}
      >
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`inline-flex items-center gap-1.5 rounded-full py-1.5 px-3.5 text-sm border ${theme.border} ${theme.inputBg} ${theme.text} animate-pop-in`}
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className={`text-xs ${theme.accent} leading-none p-0.5 hover:opacity-80`}
              aria-label={`Remove ${item}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2.5 mb-5">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          placeholder="e.g. Designing, Teaching, Cooking..."
          className={`flex-1 py-3 px-4 rounded-xl border-[1.5px] ${theme.border} ${theme.inputBg} ${theme.text} ${theme.placeholder} outline-none ${theme.inputFocus}`}
          aria-label="Add item"
        />
        <button
          type="button"
          onClick={addItem}
          className={`py-3 px-5 rounded-xl ${theme.accentBg} text-white text-lg font-medium hover:opacity-90 transition-opacity flex-shrink-0 min-h-[44px]`}
        >
          +
        </button>
      </div>

      <div className="flex gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className={`w-1/3 py-4 rounded-xl font-display text-base flex items-center justify-center gap-2 min-h-[44px] border ${theme.border} ${theme.inputBg} ${theme.text} hover:bg-black/5 transition-all`}
          >
            {backLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={`${
            showBackButton ? "w-2/3" : "w-full"
          } py-4 rounded-xl font-display text-base flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            canContinue
              ? `${theme.btnPrimary} text-white ${theme.btnPrimaryHover} hover:-translate-y-px cursor-pointer`
              : "opacity-35 cursor-not-allowed bg-black/10 text-black/50"
          }`}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
