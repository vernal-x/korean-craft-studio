"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

interface StudioTabsProps {
  craftPanel: ReactNode;
  classPanel: ReactNode;
}

const TAB_LABELS = ["공예품 전시·주문", "공방 클래스"] as const;

/**
 * The only tab implementation. Exactly two tabs, switched by client state on
 * the single route `/` (buttons, not links; the URL never changes).
 * Arrow Left/Right/Home/End move between tabs (roving tabindex).
 */
export function StudioTabs({ craftPanel, classPanel }: StudioTabsProps) {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panels = [craftPanel, classPanel];

  function activate(index: number) {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TAB_LABELS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    activate(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div
        role="tablist"
        aria-label="온결 공방 메뉴"
        className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-sand p-1"
      >
        {TAB_LABELS.map((label, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={label}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`min-h-12 rounded-xl px-2 text-sm font-semibold sm:px-4 sm:text-base ${
                selected
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {panels.map((panel, index) => (
        <div
          key={TAB_LABELS[index]}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== activeIndex}
          tabIndex={0}
          className="mt-8"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
