const NOTICE_TEXT =
  "이 사이트는 실습용 프로토타입입니다. 입력한 정보는 저장되거나 전송되지 않으므로 실제 개인정보를 입력하지 마세요.";

export function PracticeNotice({
  variant = "banner",
}: {
  variant?: "banner" | "compact";
}) {
  if (variant === "compact") {
    return (
      <p
        role="note"
        className="rounded-md border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink"
      >
        <span className="mr-2 font-semibold text-celadon-dark">실습용 안내</span>
        {NOTICE_TEXT}
      </p>
    );
  }

  return (
    <div role="note" className="border-b border-line bg-sand text-ink">
      <p className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-2 text-sm leading-relaxed sm:flex-row sm:items-baseline sm:gap-3 sm:px-6">
        <span className="shrink-0 font-semibold text-celadon-dark">
          실습용 안내
        </span>
        <span>{NOTICE_TEXT}</span>
      </p>
    </div>
  );
}
