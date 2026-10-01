"use client";

import { useId, useState } from "react";
import type { CraftClass } from "@/types";
import { classes } from "@/mocks/classes";
import { Modal } from "@/components/Modal";
import { ClassCard } from "./ClassCard";
import { ClassApplicationForm } from "./ClassApplicationForm";

const noticeBlockClassName =
  "rounded-2xl border border-line bg-surface p-5 sm:p-6";

export function ClassSection() {
  const titleId = useId();
  const [selected, setSelected] = useState<CraftClass | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const [busy, setBusy] = useState(false);

  function handleApply(craftClass: CraftClass) {
    setSelected(craftClass);
    setOpenCount((count) => count + 1);
  }

  function handleClose() {
    setSelected(null);
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          공방 클래스
        </h2>
        <p className="text-base leading-relaxed text-ink-soft">
          손끝으로 전통 공예의 결을 느껴 보는 세 가지 가상 클래스입니다. 마음에
          드는 클래스를 골라 신청 흐름을 체험해 보세요.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section aria-labelledby={`${titleId}-prep`} className={noticeBlockClassName}>
          <h3
            id={`${titleId}-prep`}
            className="font-serif text-lg font-semibold text-ink"
          >
            클래스 준비물 안내
          </h3>
          <p className="mt-1 text-xs font-medium text-celadon-dark">
            실습용 가상 안내
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            <li>움직이기 편한 복장</li>
            <li>더러워져도 괜찮은 앞치마</li>
            <li>긴 머리는 묶어 주세요</li>
          </ul>
        </section>
        <section
          aria-labelledby={`${titleId}-refund`}
          className={noticeBlockClassName}
        >
          <h3
            id={`${titleId}-refund`}
            className="font-serif text-lg font-semibold text-ink"
          >
            취소·환불 안내
          </h3>
          <p className="mt-1 text-xs font-medium text-celadon-dark">
            실습용 가상 안내
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            <li>수업 3일 전까지 무료 취소</li>
            <li>이후 취소는 가상 규정에 따라 안내됩니다</li>
            <li>실제 결제나 환불은 이루어지지 않습니다</li>
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((craftClass) => (
          <ClassCard
            key={craftClass.id}
            craftClass={craftClass}
            onApply={handleApply}
          />
        ))}
      </div>

      <Modal
        open={selected !== null}
        title="클래스 신청"
        titleId={titleId}
        busy={busy}
        onClose={handleClose}
      >
        {selected ? (
          <ClassApplicationForm
            key={openCount}
            craftClass={selected}
            classes={classes}
            onBusyChange={setBusy}
            onClose={handleClose}
          />
        ) : null}
      </Modal>
    </div>
  );
}
