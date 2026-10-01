"use client";

import { useId, useState, type FormEvent } from "react";
import type { CraftClass, MockApiResult, SubmitStatus } from "@/types";
import { FormField, controlClassName } from "@/components/FormField";
import { SubmitMessage, SuccessPanel } from "@/components/SubmitFeedback";
import { PracticeNotice } from "@/components/PracticeNotice";
import { submitClassApplication } from "@/lib/mock-api";
import { toLocalISODate } from "@/lib/format";
import {
  hasErrors,
  parseIntegerInput,
  validateFutureDate,
  validateHeadcount,
  validateName,
  validateNote,
  validatePhone,
  type FieldErrors,
} from "@/lib/validation";

interface ClassApplicationFormProps {
  craftClass: CraftClass;
  classes: CraftClass[];
  onBusyChange: (busy: boolean) => void;
  onClose: () => void;
}

type FieldKey = "name" | "phone" | "date" | "headcount" | "note";

const FIELD_ORDER: FieldKey[] = ["name", "phone", "date", "headcount", "note"];

export function ClassApplicationForm({
  craftClass,
  classes,
  onBusyChange,
  onClose,
}: ClassApplicationFormProps) {
  const prefix = useId();
  const [todayISO] = useState(() => toLocalISODate(new Date()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classId, setClassId] = useState(craftClass.id);
  const [date, setDate] = useState("");
  const [headcount, setHeadcount] = useState("1");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors<FieldKey>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<MockApiResult | null>(null);

  const selected = classes.find((c) => c.id === classId) ?? craftClass;
  const ids: Record<FieldKey | "class", string> = {
    name: `${prefix}-name`,
    phone: `${prefix}-phone`,
    class: `${prefix}-class`,
    date: `${prefix}-date`,
    headcount: `${prefix}-headcount`,
    note: `${prefix}-note`,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors: FieldErrors<FieldKey> = {
      name: validateName(name),
      phone: validatePhone(phone),
      date: validateFutureDate(date, todayISO),
      headcount: validateHeadcount(headcount, selected.capacity),
      note: validateNote(note),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid) document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    setStatus("submitting");
    setResult(null);
    onBusyChange(true);
    const response = await submitClassApplication({
      name: name.trim(),
      phone: phone.trim(),
      classId: selected.id,
      date,
      headcount: parseIntegerInput(headcount),
      note: note.trim(),
    });
    onBusyChange(false);
    setResult(response);
    setStatus(response.success ? "success" : "error");
  }

  if (status === "success" && result?.success) {
    return (
      <SuccessPanel
        receiptNumber={result.receiptNumber}
        message={result.message}
        onClose={onClose}
      />
    );
  }

  const submitting = status === "submitting";

  return (
    <div className="space-y-5">
      <PracticeNotice variant="compact" />
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <FormField id={ids.name} label="이름" required error={errors.name}>
          {(aria) => (
            <input
              {...aria}
              type="text"
              data-autofocus
              autoComplete="off"
              value={name}
              disabled={submitting}
              onChange={(e) => setName(e.target.value)}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField
          id={ids.phone}
          label="연락처"
          required
          error={errors.phone}
          hint="010-0000-0000을 입력하면 Mock 오류 응답을 확인할 수 있습니다."
        >
          {(aria) => (
            <input
              {...aria}
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="예: 010-1234-5678"
              value={phone}
              disabled={submitting}
              onChange={(e) => setPhone(e.target.value)}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField id={ids.class} label="클래스" required>
          {(aria) => (
            <select
              {...aria}
              value={classId}
              disabled={submitting}
              onChange={(e) => {
                setClassId(e.target.value);
                setErrors((prev) => ({ ...prev, headcount: undefined }));
              }}
              className={controlClassName}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField id={ids.date} label="희망 날짜" required error={errors.date}>
          {(aria) => (
            <input
              {...aria}
              type="date"
              min={todayISO}
              value={date}
              disabled={submitting}
              onChange={(e) => setDate(e.target.value)}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField
          id={ids.headcount}
          label="인원"
          required
          error={errors.headcount}
          hint={`정원 ${selected.capacity}명`}
        >
          {(aria) => (
            <input
              {...aria}
              type="number"
              inputMode="numeric"
              min={1}
              max={selected.capacity}
              value={headcount}
              disabled={submitting}
              onChange={(e) => setHeadcount(e.target.value)}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField id={ids.note} label="요청사항" error={errors.note}>
          {(aria) => (
            <textarea
              {...aria}
              rows={3}
              value={note}
              disabled={submitting}
              onChange={(e) => setNote(e.target.value)}
              className={controlClassName}
            />
          )}
        </FormField>
        <SubmitMessage status={status} result={result} />
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="min-h-11 w-full rounded-lg bg-celadon-dark px-5 text-base font-semibold text-white hover:bg-celadon disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "접수 중…" : "클래스 신청하기"}
        </button>
      </form>
    </div>
  );
}
