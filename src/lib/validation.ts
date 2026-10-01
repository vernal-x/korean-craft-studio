export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 10;

const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "이름을 입력해 주세요.";
  if (trimmed.length > 30) return "이름은 30자 이하로 입력해 주세요.";
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return "연락처를 입력해 주세요.";
  if (!isValidPhone(value)) {
    return "연락처 형식이 올바르지 않습니다. 예: 010-1234-5678";
  }
  return undefined;
}

export function validateRequired(
  value: string,
  message: string,
): string | undefined {
  return value.trim() ? undefined : message;
}

/** Parses an integer from a form string. Returns NaN for empty/invalid input. */
export function parseIntegerInput(value: string): number {
  return /^\d+$/.test(value.trim()) ? Number(value.trim()) : Number.NaN;
}

export function validateQuantity(value: string): string | undefined {
  const n = parseIntegerInput(value);
  if (Number.isNaN(n)) return "수량을 숫자로 입력해 주세요.";
  if (n < QUANTITY_MIN || n > QUANTITY_MAX) {
    return `수량은 ${QUANTITY_MIN}개 이상 ${QUANTITY_MAX}개 이하로 입력해 주세요.`;
  }
  return undefined;
}

export function validateHeadcount(
  value: string,
  capacity: number,
): string | undefined {
  const n = parseIntegerInput(value);
  if (Number.isNaN(n)) return "인원을 숫자로 입력해 주세요.";
  if (n < 1 || n > capacity) {
    return `인원은 1명 이상 ${capacity}명 이하(정원)로 입력해 주세요.`;
  }
  return undefined;
}

/** `todayISO` is a local YYYY-MM-DD from toLocalISODate(new Date()). */
export function validateFutureDate(
  value: string,
  todayISO: string,
): string | undefined {
  if (!value) return "희망 날짜를 선택해 주세요.";
  if (!DATE_PATTERN.test(value)) return "날짜 형식이 올바르지 않습니다.";
  if (value < todayISO) return "과거 날짜는 선택할 수 없습니다.";
  return undefined;
}

export function validateNote(value: string): string | undefined {
  return value.length > 300 ? "요청사항은 300자 이하로 입력해 주세요." : undefined;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
