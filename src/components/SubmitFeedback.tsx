"use client";

import { useEffect, useRef } from "react";
import type { MockApiResult, SubmitStatus } from "@/types";

interface SubmitMessageProps {
  status: SubmitStatus;
  result: MockApiResult | null;
}

/** Loading and Error feedback shown under the form (Success uses SuccessPanel). */
export function SubmitMessage({ status, result }: SubmitMessageProps) {
  if (status === "submitting") {
    return (
      <p
        role="status"
        className="rounded-lg bg-sand px-4 py-3 text-sm font-medium text-ink"
      >
        접수 중입니다… (실습용 Mock 응답을 기다리는 중)
      </p>
    );
  }
  if (status === "error" && result && !result.success) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-danger bg-red-50 px-4 py-3 text-sm font-medium text-danger"
      >
        {result.message}
      </p>
    );
  }
  return null;
}

interface SuccessPanelProps {
  receiptNumber: string;
  message: string;
  onClose: () => void;
}

/** Replaces the form after a Mock success. Moves focus to its heading on mount. */
export function SuccessPanel({
  receiptNumber,
  message,
  onClose,
}: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status" className="space-y-4">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-lg font-semibold text-success outline-none"
      >
        접수가 완료되었습니다
      </h3>
      <p className="rounded-lg bg-sand px-4 py-3 text-base">
        가상 접수번호{" "}
        <strong className="font-semibold tracking-wide">{receiptNumber}</strong>
      </p>
      <p className="text-sm text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="min-h-11 rounded-lg bg-celadon-dark px-5 text-base font-semibold text-white hover:bg-celadon"
      >
        확인
      </button>
    </div>
  );
}
