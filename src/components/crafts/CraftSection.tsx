"use client";

import { useId, useState } from "react";
import type { Craft } from "@/types";
import { crafts } from "@/mocks/crafts";
import { Modal } from "@/components/Modal";
import { CraftCard } from "./CraftCard";
import { OrderInquiryForm } from "./OrderInquiryForm";

export function CraftSection() {
  const titleId = useId();
  const [selected, setSelected] = useState<Craft | null>(null);
  const [busy, setBusy] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  function handleInquire(craft: Craft) {
    setSelected(craft);
    setOpenCount((count) => count + 1);
  }

  function handleClose() {
    setSelected(null);
    setBusy(false);
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby={`${titleId}-brand`}
          className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
        >
          <h2
            id={`${titleId}-brand`}
            className="font-serif text-xl font-semibold text-ink"
          >
            온결 공방 소개
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            온결 공방은 도자기, 나전칠기, 보자기, 목공예를 한곳에서 소개하는
            가상의 한국 전통 공예 공방입니다. 손으로 빚고 다듬은 결을 오늘의
            생활 속에 잇는 것을 이야기로 삼았습니다.
          </p>
        </section>
        <section
          aria-labelledby={`${titleId}-guide`}
          className="rounded-2xl border border-line bg-sand p-5 sm:p-6"
        >
          <h2
            id={`${titleId}-guide`}
            className="font-serif text-xl font-semibold text-ink"
          >
            제작·배송 안내{" "}
            <span className="text-sm font-normal text-ink-soft">
              (실습용 가상 안내)
            </span>
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>제작 기간: 주문 확인 후 약 2~3주 (가상)</li>
            <li>배송 방식: 파손 방지 포장 후 택배 발송 (가상)</li>
            <li>실제 제작, 결제, 배송은 이루어지지 않습니다.</li>
          </ul>
        </section>
      </div>

      <section aria-labelledby={`${titleId}-list`} className="space-y-5">
        <h2
          id={`${titleId}-list`}
          className="font-serif text-2xl font-semibold text-ink"
        >
          공예품 전시·주문
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {crafts.map((craft) => (
            <CraftCard key={craft.id} craft={craft} onInquire={handleInquire} />
          ))}
        </div>
      </section>

      <Modal
        open={selected !== null}
        title="주문 문의"
        titleId={`${titleId}-modal`}
        busy={busy}
        onClose={handleClose}
      >
        {selected ? (
          <OrderInquiryForm
            key={openCount}
            craft={selected}
            crafts={crafts}
            onBusyChange={setBusy}
            onClose={handleClose}
          />
        ) : null}
      </Modal>
    </div>
  );
}
