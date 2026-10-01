export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line bg-surface"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-sand sm:size-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 right-24 hidden size-40 rounded-full border border-line md:block"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <p className="text-sm font-semibold tracking-widest text-celadon-dark">
          KOREAN CRAFT STUDIO
        </p>
        <h1
          id="hero-title"
          className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-5xl"
        >
          결을 따라 이어지는
          <br />
          손의 시간, 온결 공방
        </h1>
        <p className="mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
          온결 공방은 도자기, 나전칠기, 보자기, 목공예처럼 오래 쓰는 한국
          공예의 결을 오늘의 생활에 맞게 소개하는 가상의 공방입니다. 전시된
          공예품을 둘러보고 주문을 문의하거나, 직접 만들어 보는 클래스를
          신청해 보세요.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          * 이 페이지의 공방과 상품, 클래스는 모두 실습용 가상 정보입니다.
        </p>
      </div>
    </section>
  );
}
