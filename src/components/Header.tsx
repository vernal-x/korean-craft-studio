import { PracticeNotice } from "./PracticeNotice";

export function Header() {
  return (
    <header className="bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-0.5 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-4 sm:px-6">
        <p className="font-serif text-2xl font-bold tracking-tight text-ink">
          온결 공방
        </p>
        <p className="text-sm text-ink-soft">한국 전통 공예를 오늘의 결로</p>
      </div>
      <PracticeNotice variant="banner" />
    </header>
  );
}
