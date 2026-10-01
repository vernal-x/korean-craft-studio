const INFO: { label: string; value: string }[] = [
  { label: "주소", value: "서울특별시 가상구 온결로 1 (가상 주소)" },
  { label: "운영시간", value: "화–일 10:00–18:00 (가상)" },
  { label: "문의처", value: "000-0000-0000 (가상, 연결되지 않음)" },
  { label: "이메일", value: "example@example.invalid (가상)" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-sand text-ink">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h2 className="font-serif text-lg font-bold">
          공방 안내 (실습용 가상 정보)
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
          {INFO.map((item) => (
            <div key={item.label} className="contents">
              <dt className="font-semibold text-ink-soft">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-xs text-ink-soft">
          위 정보는 모두 실습용으로 만든 가상의 내용이며 실제 공방과 관련이
          없습니다.
        </p>
      </div>
    </footer>
  );
}
