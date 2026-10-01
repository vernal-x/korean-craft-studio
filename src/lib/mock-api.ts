import type {
  ClassApplication,
  MockApiResult,
  OrderInquiry,
} from "../types";

const MOCK_DELAY_MS = 700;
const MOCK_FAILURE_PHONE = "01000000000";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isFailurePhone(phone: string): boolean {
  return phone.replace(/\D/g, "") === MOCK_FAILURE_PHONE;
}

function createReceiptNumber(prefix: string): string {
  const digits = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `${prefix}-${digits}`;
}

function failure(): MockApiResult {
  return {
    success: false,
    message:
      "실습용 Mock 오류입니다. 연락처 010-0000-0000은 실패 응답을 확인하기 위한 예시 번호입니다. 다른 번호로 다시 시도해 보세요.",
  };
}

/** Mock only: no network request and no storage. Results vanish on reload. */
export async function submitOrderInquiry(
  inquiry: OrderInquiry,
): Promise<MockApiResult> {
  await wait(MOCK_DELAY_MS);
  if (isFailurePhone(inquiry.phone)) return failure();
  return {
    success: true,
    receiptNumber: createReceiptNumber("OG-ORD"),
    message:
      "주문 문의가 접수되었습니다. (실습용 가상 접수이며 실제로 전달되거나 저장되지 않습니다.)",
  };
}

/** Mock only: no network request and no storage. Results vanish on reload. */
export async function submitClassApplication(
  application: ClassApplication,
): Promise<MockApiResult> {
  await wait(MOCK_DELAY_MS);
  if (isFailurePhone(application.phone)) return failure();
  return {
    success: true,
    receiptNumber: createReceiptNumber("OG-CLS"),
    message:
      "클래스 신청이 접수되었습니다. (실습용 가상 접수이며 실제로 전달되거나 저장되지 않습니다.)",
  };
}
