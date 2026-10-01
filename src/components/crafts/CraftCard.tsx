import Image from "next/image";
import type { Craft } from "@/types";
import { formatPrice } from "@/lib/format";

interface CraftCardProps {
  craft: Craft;
  onInquire: (craft: Craft) => void;
}

export function CraftCard({ craft, onInquire }: CraftCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="aspect-[4/3] w-full overflow-hidden bg-sand">
        <Image
          src={craft.image.src}
          alt={craft.image.alt}
          width={480}
          height={360}
          unoptimized
          className="h-auto w-full"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
            {craft.name}
          </h3>
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-ink-soft">
            {craft.craftType}
          </span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-ink-soft">
          {craft.description}
        </p>
        <p className="text-base font-semibold text-ink">
          {formatPrice(craft.price)}
        </p>
        <button
          type="button"
          onClick={() => onInquire(craft)}
          aria-label={`${craft.name} 주문 문의하기`}
          className="min-h-11 rounded-lg bg-celadon-dark px-5 text-base font-semibold text-white hover:bg-celadon"
        >
          주문 문의하기
        </button>
      </div>
    </article>
  );
}
