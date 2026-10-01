import Image from "next/image";
import type { CraftClass } from "@/types";
import { formatDuration, formatPrice } from "@/lib/format";

interface ClassCardProps {
  craftClass: CraftClass;
  onApply: (craftClass: CraftClass) => void;
}

export function ClassCard({ craftClass, onApply }: ClassCardProps) {
  const { name, description, price, durationMinutes, capacity, image } =
    craftClass;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Image
        src={image.src}
        alt={image.alt}
        width={480}
        height={360}
        unoptimized
        className="h-auto w-full"
      />
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <h3 className="font-serif text-xl font-semibold text-ink">{name}</h3>
        <p className="text-base leading-relaxed text-ink-soft">{description}</p>
        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-4 text-sm">
          <dt className="text-ink-soft">수강료</dt>
          <dd className="font-semibold text-ink">{formatPrice(price)} / 1인</dd>
          <dt className="text-ink-soft">소요시간</dt>
          <dd className="text-ink">{formatDuration(durationMinutes)}</dd>
          <dt className="text-ink-soft">정원</dt>
          <dd className="text-ink">최대 {capacity}명</dd>
        </dl>
        <button
          type="button"
          aria-label={`${name} 신청하기`}
          onClick={() => onApply(craftClass)}
          className="min-h-11 rounded-lg bg-celadon-dark px-5 text-base font-semibold text-white hover:bg-celadon"
        >
          신청하기
        </button>
      </div>
    </article>
  );
}
