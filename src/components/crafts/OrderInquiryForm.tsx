"use client";

import { useId, useState, type FormEvent } from "react";
import type { Craft, MockApiResult, SubmitStatus } from "@/types";
import { submitOrderInquiry } from "@/lib/mock-api";
import {
  QUANTITY_MAX,
  QUANTITY_MIN,
  hasErrors,
  parseIntegerInput,
  validateName,
  validateNote,
  validatePhone,
  validateQuantity,
  validateRequired,
} from "@/lib/validation";
import { FormField, controlClassName } from "@/components/FormField";
import { SubmitMessage, SuccessPanel } from "@/components/SubmitFeedback";
import { PracticeNotice } from "@/components/PracticeNotice";

interface OrderInquiryFormProps {
  craft: Craft;
  crafts: Craft[];
  onBusyChange: (busy: boolean) => void;
  onClose: () => void;
}

type FieldKey = "name" | "phone" | "craftId" | "quantity" | "note";
type Errors = Partial<Record<FieldKey, string>>;

const FIELD_ORDER: FieldKey[] = ["name", "phone", "craftId", "quantity", "note"];

export function OrderInquiryForm({
  craft,
  crafts,
  onBusyChange,
  onClose,
}: OrderInquiryFormProps) {
  const prefix = useId();
  const ids: Record<FieldKey, string> = {
    name: `${prefix}-name`,
    phone: `${prefix}-phone`,
    craftId: `${prefix}-craft`,
    quantity: `${prefix}-quantity`,
    note: `${prefix}-note`,
  };

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [craftId, setCraftId] = useState(craft.id);
  const [quantity, setQuantity] = useState("1");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<MockApiResult | null>(null);

  const submitting = status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: Errors = {
      name: validateName(name),
      phone: validatePhone(phone),
      craftId: validateRequired(craftId, "상품을 선택해 주세요."),
      quantity: validateQuantity(quantity),
      note: validateNote(note),
    };
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
      if (firstInvalid) document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    setStatus("submitting");
    onBusyChange(true);
    const response = await submitOrderInquiry({
      name: name.trim(),
      phone: phone.trim(),
      craftId,
      quantity: parseIntegerInput(quantity),
      note: note.trim(),
    });
    onBusyChange(false);
    setResult(response);
    setStatus(response.success ? "success" : "error");
  }

  if (status === "success" && result && result.success) {
    return (
      <SuccessPanel
        receiptNumber={result.receiptNumber}
        message={result.message}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PracticeNotice variant="compact" />
      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        <FormField id={ids.name} label="이름" required error={errors.name}>
          {(aria) => (
            <input
              {...aria}
              type="text"
              autoComplete="off"
              data-autofocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField
          id={ids.phone}
          label="연락처"
          required
          error={errors.phone}
          hint="실습용 입력입니다. 010-0000-0000을 입력하면 Mock 오류 응답을 확인할 수 있습니다."
        >
          {(aria) => (
            <input
              {...aria}
              type="tel"
              inputMode="tel"
              autoComplete="off"
              placeholder="예: 010-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField
          id={ids.craftId}
          label="상품"
          required
          error={errors.craftId}
        >
          {(aria) => (
            <select
              {...aria}
              value={craftId}
              onChange={(e) => setCraftId(e.target.value)}
              disabled={submitting}
              className={controlClassName}
            >
              {crafts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField
          id={ids.quantity}
          label="수량"
          required
          error={errors.quantity}
          hint={`${QUANTITY_MIN}개 이상 ${QUANTITY_MAX}개 이하`}
        >
          {(aria) => (
            <input
              {...aria}
              type="number"
              inputMode="numeric"
              min={QUANTITY_MIN}
              max={QUANTITY_MAX}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={submitting}
              className={controlClassName}
            />
          )}
        </FormField>
        <FormField
          id={ids.note}
          label="요청사항"
          error={errors.note}
          hint="300자 이하로 입력해 주세요."
        >
          {(aria) => (
            <textarea
              {...aria}
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={submitting}
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
          {submitting ? "접수 중…" : "주문 문의 접수하기"}
        </button>
      </form>
    </div>
  );
}
