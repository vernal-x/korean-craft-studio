"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  /** Called after the dialog closed (ESC, 닫기, backdrop) so the parent can reset its own state. */
  onClose: () => void;
  title: string;
  /** Unique id for the heading; the dialog is labelled by it. */
  titleId: string;
  /** While true, ESC / backdrop / 닫기 are blocked (best effort) so a pending submit is not abandoned. */
  busy?: boolean;
  children: ReactNode;
}

/**
 * Native <dialog> wrapper.
 * - open: showModal() then focus the first element marked `data-autofocus`
 * - close: ESC, 닫기 button or backdrop press+click; focus returns to the opener
 */
export function Modal({
  open,
  onClose,
  title,
  titleId,
  busy = false,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const pressStartedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleClosed() {
    openerRef.current?.focus();
    openerRef.current = null;
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        if (busy) event.preventDefault();
      }}
      onKeyDown={(event) => {
        // Chrome lets `cancel` be cancelled only once per user activation,
        // so also swallow repeated Esc presses while a submit is in flight.
        if (busy && event.key === "Escape") event.preventDefault();
      }}
      onClose={handleClosed}
      onPointerDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (
          !busy &&
          pressStartedOnBackdrop.current &&
          event.target === event.currentTarget
        ) {
          dialogRef.current?.close();
        }
        pressStartedOnBackdrop.current = false;
      }}
      className="m-auto w-[min(100%-2rem,34rem)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl"
    >
      <div className="max-h-[90dvh] overflow-y-auto p-5 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="font-serif text-xl font-semibold leading-snug sm:text-2xl"
          >
            {title}
          </h2>
          <button
            type="button"
            disabled={busy}
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 shrink-0 rounded-lg border border-line px-4 text-sm font-medium text-ink hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
          >
            닫기
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
