import type { ReactNode } from "react";

export interface FieldAria {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
  "aria-required": true | undefined;
}

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  /** Render the control with the given aria props spread onto it. */
  children: (aria: FieldAria) => ReactNode;
}

export const controlClassName =
  "block min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base text-ink placeholder:text-ink-soft aria-[invalid=true]:border-danger aria-[invalid=true]:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60";

/** Label + control + hint + error, wired with htmlFor / aria-describedby. */
export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 font-normal text-ink-soft">(필수)</span>
        ) : (
          <span className="ml-1 font-normal text-ink-soft">(선택)</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required ? true : undefined,
      })}
      {hint ? (
        <p id={hintId} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
