# Work Plan: 온결 공방 (Onggyeol Gongbang) 프론트엔드 프로토타입

- **Status:** pending approval
- **Mode:** SHORT (RALPLAN-DR)
- **Source spec:** `.omc/specs/deep-interview-onggyeol-gongbang.md`
- **Date:** 2026-09-30
- **Complexity:** MEDIUM (about 14 new files, 1 folder move, 1 config edit)

---

## 1. Requirements Summary

Build a single-page responsive prototype named "온결 공방" that shows Korean traditional crafts and lets people try an order-inquiry flow and a class-enrollment flow against a Mock API. It has no login, DB, payment, external API, network calls or persistence.

**Page structure (fixed):** the whole site is **one route, `/`** (`src/app/page.tsx`). The two top tabs ("공예품 전시·주문", "공방 클래스") are **in-page views switched by client state**, not separate routes or pages: no `/products` or `/classes` route, no nested route folders, no `<Link>`/`href` on the tabs, no URL change. The inquiry and enrollment forms are modals on the same page, not routes either.

Repo facts checked for this plan:
- `next@16.3.7`, `react@19.2.8`, Tailwind v4 via `@tailwindcss/postcss` (`postcss.config.mjs`). There is no `tailwind.config.*`. `app/globals.css` uses `@import "tailwindcss"` and `@theme inline`.
- `app/` holds `layout.tsx`, `page.tsx`, `globals.css` and `favicon.ico`. `app/layout.tsx` uses `LayoutProps<"/">`, a global type helper in Next 16 that does not need an import, and `next/font/google` (Geist).
- `tsconfig.json` has `paths: { "@/*": ["./*"] }` and includes `**/*.ts(x)`.
- `eslint.config.mjs` is a flat config with `eslint-config-next/core-web-vitals` and `/typescript`. The lint script is plain `eslint`. The installed `eslint-plugin-react-hooks` includes the React Compiler-era rules, such as `set-state-in-effect` and `refs`.
- Next 16 docs (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/src-folder.md`):
  - `src/app` is **ignored if a root `app/` exists**, so `app/` must be removed entirely.
  - `public/` and the config files stay at the root.
  - The `@/*` path must be updated to point at `src/`.
  - The tailwind.config content note covers v3 only. Tailwind v4 detects sources automatically, so no config change is needed.
- `'use client'` goes at the top of each client entry file. Props that cross the server/client boundary must be serializable, so no function props are passed from the server `page.tsx`.

## 2. RALPLAN-DR Summary

### Principles
1. **Mock-only, zero network:** nothing leaves the browser. There are no `fetch` calls, external images or runtime third-party requests.
2. **Minimal surface:** no new dependencies. Use platform features (`<dialog>`, CSS/SVG) and the existing Tailwind v4.
3. **Server by default, client at the leaves:** `page.tsx` stays a Server Component. Interactivity lives in a small number of `'use client'` entry components.
4. **Spec-traceable:** every component maps to one or more of the 12 ACs, and verification checks each AC explicitly.
5. **Follow Next 16 conventions as documented:** use `src/` per the docs, `LayoutProps`, and flat ESLint. Verify against `node_modules/next/dist/docs/`, not from memory.

### Top 3 Decision Drivers
1. **AC 6 closing behaviour** (ESC, backdrop click, close button, focus handling) with the least custom code.
2. **Passing `npm run lint` and `npm run build`** with the strict react-hooks rules in eslint-config-next 16.
3. **Prototype simplicity:** it is a practice project, so fewer moving parts and dependencies are better.

### Option A: Modal implementation
| Option | Pros | Cons |
|---|---|---|
| **A1. Native `<dialog>` + `showModal()` (CHOSEN)** | ESC closes it natively, and a `cancel` event fires. Focus trap and `inert` background come built in. `::backdrop` styles the backdrop. Zero dependencies. | Backdrop click needs a small handler (`e.target === dialogRef.current`). `showModal()` has to run imperatively in an effect or event, which must be written carefully to satisfy the react-hooks lint rules. |
| A2. Custom div overlay + portal | Full styling control and fully declarative. | Focus trap, ESC, scroll lock and aria all have to be hand-built. More code and more accessibility risk. |
| A3. Library (Radix Dialog / Headless UI) | Well-tested accessibility and declarative API. | Adds a dependency, which conflicts with Principle 2. Compatibility with React 19.2 and Next 16 would need checking. Overkill for 2 modals. |

**Why A1:** it meets AC 6 with the least code and no dependency. The backdrop-click gap takes about 3 lines of code.

### Option B: Tab state
| Option | Pros | Cons |
|---|---|---|
| **B1. Client `useState` in the `'use client'` `StudioTabs` component (CHOSEN, matches the spec assumption and the single-page requirement)** | Simplest. No `useSearchParams`, so there is no Suspense boundary or dynamic-rendering concern at build time. The page stays statically prerenderable. | The tab does not survive a reload or a shared link. |
| B2. URL `?tab=` via `searchParams` or `useSearchParams` | Deep-linkable, and the back button works. | `useSearchParams` requires a Suspense boundary for static builds, and reading `searchParams` in the page makes it dynamic. More complexity for no spec requirement. |

**Why B1:** the requirement is one page with two tabs, so the tabs are views of `/` and not routes (a route-per-tab layout such as `/products` and `/classes` was rejected for that reason). The spec assumes client-state tabs and does not require deep links. Also chosen: each tab panel is rendered and hidden with the `hidden` attribute, so the ARIA `tablist`/`tab`/`tabpanel` wiring stays simple.

### Decision (confirmed by user): font = system Korean font stack
`next/font/google` self-hosts fonts at build time, so no browser request goes to Google. However, it **downloads during `next build`**. **Decision (final):** remove Geist and use a system font stack plus Korean fallbacks (`"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif`) in `globals.css`. This removes the build-time network dependency and the Latin-only Geist glyph mismatch for Korean text. `next/font/google` and `next/font/local` are out of scope for this prototype (self-hosted webfont is only a future follow-up).

## 3. Implementation Steps

### Step 1: Migrate to `src/` and fix config
- Move `app/layout.tsx`, `app/page.tsx`, `app/globals.css` and `app/favicon.ico` to `src/app/`, using plain `mv` (the project folder is untracked in the parent git repo, so `git mv` would fail). Then **delete the root `app/` directory**, because the docs say `src/app` is ignored while `app/` exists.
- Edit `tsconfig.json` from `"paths": { "@/*": ["./*"] }` to `"paths": { "@/*": ["./src/*"] }`. Leave `include` unchanged, since `**/*.ts(x)` already covers `src/`.
- Leave `public/` at the root. Optionally delete the unused create-next-app SVGs (`next.svg`, `vercel.svg`, etc.) once `page.tsx` no longer references them.
- Remove `.next/` before the first build, so stale `app/` types in `.next/types` do not linger.
- L0 replaces the moved `page.tsx` with a minimal placeholder that does not use `next/image` or `/next.svg`, then deletes the unused `public/*.svg` files (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). L0 also runs `rm -rf .next` and `npx next typegen` (see §10 gates).
- **AC:** `src/app/page.tsx` renders at `/`. No root `app/` exists. `npm run build` succeeds, even with placeholder content. (The `@/lib/...` alias check moves to L4, because nothing imports it before then.)

### Step 2: Domain types, Mock data, Mock API
- `src/types/index.ts`: `Product { id; name; craftType: '도자기'|'나전칠기'|'보자기'|'목공예'; description; price; illustration }`, `CraftClass { id; name; description; price; durationMinutes; capacity }`, `InquiryRequest`, `EnrollmentRequest`, and `MockResponse = { success: true; receiptNo: string; message } | { success: false; message }`.
- `src/data/products.ts`: 4 to 8 products, with at least 1 each of 도자기, 나전칠기, 보자기 and 목공예 (AC 2). `illustration` is a key such as `'pottery' | 'najeon' | 'bojagi' | 'wood'` that selects an SVG placeholder.
- `src/data/classes.ts`: 2 or 3 classes, including 도자기 만들기 and 보자기 만들기 (AC 4), with capacities such as 6 and 8.
- `src/lib/format.ts`: `formatPrice(n) => n.toLocaleString('ko-KR') + '원'`, `formatDuration`, and `toLocalISODate(d: Date): string`.
  - **`toLocalISODate` must build `YYYY-MM-DD` from local fields**: `getFullYear()`, `getMonth() + 1` and `getDate()`, each zero-padded (`String(n).padStart(2, '0')`).
  - **Never use `toISOString().slice(0, 10)`**: it is UTC-based, so in Korea (UTC+9) between 00:00 and 09:00 it returns yesterday's date and the `min` of the date input would allow a past day.
- `src/lib/mock-api.ts`: `submitInquiry(req)` and `submitEnrollment(req)`. Each is `async`, awaits `new Promise(r => setTimeout(r, 700))`, and then:
  - if `phone` normalizes to `01000000000` (`010-0000-0000`), resolves to `{ success:false, message:'…Mock 오류…' }`;
  - otherwise resolves to `{ success:true, receiptNo: 'OG-' + 6–8 random digits, message }`.
  - It must not contain `fetch`, `XMLHttpRequest` or any storage API (AC 7, 8, 9).
  - **Import rule (keeps the optional script check in §13 runnable):** `mock-api.ts` may only use `import type { ... } from '../types'` (a relative path, type-only, erased at runtime). No `@/` alias imports and no value imports from other project files. The phone normalization it needs (strip non-digits) is written inline, not imported from `validation.ts`.
- `src/lib/validation.ts`: `isValidPhone` (loose `^01[016789]-?\d{3,4}-?\d{4}$`) plus required and range checks. These are shared by both forms. The phone normalization (strip non-digits) is intentionally duplicated in `mock-api.ts` so the script check in §13 stays runnable.
- **AC:** the files type-check. `grep -rE "fetch\(|XMLHttpRequest|localStorage|sessionStorage" src/` returns nothing.

### Step 3: Shell, tabs, cards (server-first)
- `src/app/layout.tsx`: set `lang="ko"`, metadata `title: '온결 공방'` plus a description, and remove the Geist imports (see the font decision).
- `src/app/globals.css`: keep `@import "tailwindcss"`. Define `@theme inline` tokens (ivory `--color-paper`, ink `--color-ink`, celadon `--color-celadon` and lacquer `--color-lacquer` accents) and the font stack. Remove the `prefers-color-scheme: dark` override entirely (light theme only, so no `dark:` classes are used). Replace `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)` and `body { font-family: Arial… }` with the system font stack.
- `src/app/page.tsx` (Server Component): header with the site name, `<PracticeNotice />` and `<StudioTabs products={products} classes={classes} />`. Only serializable data is passed.
- `src/components/PracticeNotice.tsx` (**shared, no `'use client'` directive**): it has no hooks, state or browser APIs, so it is rendered on the server when used from `page.tsx`, and it is bundled as client code when the forms import it. Keep it free of client-only code. Banner text "실습용 프로토타입입니다. 실제 이름·전화번호를 입력하지 마세요." (AC 10).
- `src/components/StudioTabs.tsx` (`'use client'`), the only tab implementation: the tabs are `<button role="tab">` elements, **not** `<a>`/`<Link>`, with no `href`, no `useRouter`/`usePathname`/`useSearchParams`, and no hash or query change. Both panels are rendered inside the one page and the inactive one is `hidden`. Opening or closing a modal never changes the active tab. `src/app/` contains exactly one page file, `page.tsx` (no `products/`, `classes/`, or other route folders). Exactly 2 tabs, "공예품 전시·주문" (default) and "공방 클래스". It uses `role="tablist"`, `role="tab"`, `aria-selected` and `aria-controls`, plus `role="tabpanel"` (AC 1). It owns the "selected item plus which modal is open" state.
- `src/components/ProductCard.tsx` and `src/components/ClassCard.tsx`: presentational. Neither has a `'use client'` directive: they are client code because the client `StudioTabs` imports them. `ProductCard` takes `onInquire(product)` and `ClassCard` takes `onEnroll(craftClass)` (names fixed in §9.1). ProductCard shows the illustration, name, craft type, description and price, plus a "주문 문의하기" button (AC 2, 3). ClassCard shows the name, description, price, duration and capacity, plus a "클래스 신청" button (AC 4, 5).
- `src/components/CraftIllustration.tsx` (**shared, no `'use client'` directive**, same rule as `PracticeNotice`; it is imported by the client `ProductCard`, so it runs in the client bundle): inline SVG or CSS placeholder per `illustration` key, with `aria-hidden` and no `<img src=http…>`.
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, with padding `px-4` on mobile. Tab labels need `whitespace-nowrap` or a flex wrap that fits at 375px (AC 11).
- **AC:** at `/`, 2 tabs switch the panels, and all card fields render.

### Step 4: Modal and forms
- `src/components/Modal.tsx` (`'use client'`): wraps `<dialog ref>`.
  - Opens with `showModal()` inside `useEffect` when `open` becomes true, then immediately calls `d.querySelector<HTMLElement>('[data-autofocus]')?.focus()` in the same effect (the browser default focuses the first focusable element, which would be 닫기). Only imperative DOM calls go in the effect. `setState` must not be called there, which avoids `react-hooks/set-state-in-effect`.
  - Handles `onClose` (fires on ESC and on `dialog.close()`) and reports it to the parent. Backdrop close is defined in the Contract bullet below (`pointerdown` + `click`). The dialog content goes in an inner wrapper so clicks inside do not close it.
  - Has a visible "닫기" button, `aria-labelledby` pointing at the title, and `::backdrop` styles via Tailwind `backdrop:` variant.
  - Scrolling lives on the **inner wrapper** (`max-h-[90dvh] overflow-y-auto`); the `<dialog>` itself is `p-0 overflow-hidden w-[min(100%-2rem,32rem)]` so it fits at 375px (AC 6, 11).
  - Contract: effect does `if (open && !d.open) d.showModal(); else if (!open && d.open) d.close()`. `onClose` only reports to the parent. Backdrop close requires both `pointerdown` and `click` to land on the dialog itself (so scrollbar clicks and text-selection drags do not close it).
  - While the `busy` prop is true, ESC/backdrop/닫기 are blocked as **best effort** (`onCancel` calls `preventDefault()`; Chromium may still close on a second ESC without user activation). The parent must tolerate a close during submit: a result that resolves after unmount is ignored (React 19 drops the setState).
  - `date` `min` is computed with a lazy `useState(() => toLocalISODate(new Date()))`, never `Date.now()` during render (react-hooks purity lint). `toLocalISODate` (see `format.ts`) uses local `getFullYear/getMonth/getDate`, **not** `toISOString()`, which is UTC-based and yields yesterday's date in Korea between 00:00 and 09:00. The JS validation of 희망일 uses the same helper, so it never accepts a date before local today.
- `src/components/InquiryForm.tsx`: shows the read-only selected product (name, type, price). Fields are 이름 (required), 연락처 (required, `isValidPhone`), 수량 (required, 1 or more) and 문의내용 (optional).
- `src/components/EnrollmentForm.tsx`: shows the read-only selected class. Fields are 이름, 연락처, 희망일 (required, `type="date"` with `min` = today) and 인원 (required, 1 to `capacity`, enforced by `min`/`max` and JS validation, with an error message).
- Shared state machine in each form: `idle → submitting → success | error`. The form calls `onBusyChange(true)` in the submit handler before awaiting, and `onBusyChange(false)` when the promise settles, both in the handler and never in an effect. The first input carries `data-autofocus`; in the success state the result heading gets `tabIndex={-1}` and focus.
  - `submitting`: the button is disabled and shows the label "접수 중…" or a spinner (AC 7).
  - `success`: the form is replaced **inside the same modal** by "접수가 완료되었습니다" and `접수번호 OG-xxxxxx` (AC 8).
  - `error`: shows the message with `role="alert"`, the field values are kept and the submit button is enabled again for retry (AC 9).
  - Validation errors are inline per field, and `noValidate` plus custom messages keep the Korean copy consistent (AC 6).
- Form state resets when the modal closes or a different item is selected. Use a `key` on the form, such as `key={item.id + openCount}`, rather than resetting state in an effect.
- Repeat `PracticeNotice` in compact form at the top of each form (AC 10).
- **AC:** each modal closes by ESC, backdrop click and 닫기. Empty submit shows required errors. 인원 above capacity is blocked. Loading lasts about 700ms. The success receipt number appears. `010-0000-0000` shows an error and a retry succeeds after the phone is fixed.

### Step 5: Polish and verify
- Test responsive layout at 375px and at 1280px or wider. Check focus-visible styles, and check color contrast of ink on ivory.
- Run `npm run lint` and `npm run build`. Fix any react-hooks or compiler-rule warnings or errors.
- Replace the scaffold `README.md` section with a short description plus the Mock phone rule (optional).
- **AC:** every verification step in §6 passes.

## 4. Acceptance Criteria Mapping (spec AC → where → how verified)
| # | Spec AC | Implemented in | Verification |
|---|---|---|---|
| 1 | Exactly 2 tabs and switching works | `StudioTabs.tsx` | Count `role="tab"` = 2, and none is a link (`a[href]`). Click each and the matching panel is visible, the other `hidden`. The URL stays `/` (no path, query or hash change) and the page does not reload. |
| 2 | Product card fields plus the 4 craft types | `data/products.ts`, `ProductCard.tsx`, `CraftIllustration.tsx` | Visually confirm the 5 fields. The data contains all 4 `craftType` values. |
| 3 | "주문 문의하기" opens the modal with that product | `ProductCard` → `StudioTabs` → `Modal` + `InquiryForm` | Click the 2nd product and the modal title or summary shows the 2nd product's name. |
| 4 | Class card fields, including 도자기 and 보자기 classes | `data/classes.ts`, `ClassCard.tsx` | Name, description, price, duration and capacity visible. Both classes are present. |
| 5 | "클래스 신청" opens the modal with that class | `ClassCard` → `Modal` + `EnrollmentForm` | Modal shows the chosen class name and capacity. |
| 6 | Closes by ESC, backdrop and button, and required fields are validated | `Modal.tsx`, `validation.ts`, forms | Try all 3 close paths. An empty submit shows errors, and 인원 = capacity + 1 shows an error. |
| 7 | Calls the async function in `src/lib/mock-api.ts` and shows about 700ms of loading | `mock-api.ts`, form state | Button disabled with a loading label for about 0.7s. Code review shows the import from `@/lib/mock-api`. |
| 8 | Fake receipt number and a completion message on success | forms (success state) | `OG-` plus digits shown in the same modal. |
| 9 | `010-0000-0000` gives an error, retry is possible and no network request occurs | `mock-api.ts`, forms (error state) | Error shown, the inputs are kept, the button is enabled again. The DevTools Network tab shows 0 requests after submit. |
| 10 | Practice notice and "실제 이름·전화번호를 입력하지 마세요" | `PracticeNotice.tsx` (header plus form) | The text is visible on page load and inside both modals. |
| 11 | No layout breakage at 375px or on PC | Tailwind responsive classes, modal sizing | DevTools at 375×667 and 1280×800 show no horizontal scroll, and the modal fits. |
| 12 | lint and build pass | whole repo | `npm run lint` and `npm run build` both exit 0. |

## 5. Risks and Mitigations
| Risk | Mitigation |
|---|---|
| The root `app/` is left behind, so `src/app` is silently ignored and the old page renders | Delete `app/` fully. Step 1 AC checks that no root `app/` exists and that the new title "온결 공방" renders. |
| Stale `.next/types` that reference `app/` break type-checking | Run `rm -rf .next` before the first build. |
| Strict react-hooks rules (`set-state-in-effect`, `refs`) fail lint on the dialog effect or form reset | Keep the effect to imperative `showModal()`/`close()` only. Reset forms with `key` remounts. Read refs only in effects and handlers, never during render. |
| `next/font/google` needs network access during build (offline or sandboxed CI) | Use a system and Korean font stack (final decision). No build-time fetch. |
| Date `min` is one day early in Korea at 00:00–09:00 when built from `toISOString()` (UTC) | Use `toLocalISODate` built from local `getFullYear/getMonth/getDate`. Verify by checking the `min` attribute equals the local date (see §6 step 5). |
| Backdrop click also closes the dialog when a click inside it hits the dialog padding | Put the content in an inner wrapper that fills the dialog with zero padding on `<dialog>`, and close only when `e.target === dialog`. |
| A `<dialog>` element opened with `showModal()` still appears in the Server Component render, which creates a hydration or SSR mismatch | Render the `Modal` only in the client tree, `StudioTabs`, and call `showModal()` only in an effect, never during render. |
| `type="date"` `min` computed as "today" differs between server and client | The forms render only after a user action on the client, so there is no SSR mismatch. Compute `min` inside the client form. |
| Korean tab labels overflow at 375px | Use `text-sm sm:text-base`, `flex-1` tabs and `whitespace-nowrap`, and check at 375px. |

## 6. Verification Steps
1. `rm -rf .next && npm run lint` exits 0 with no errors.
2. `npm run build` exits 0, and `/` is listed as static (○). The route table lists only `/` (plus Next's built-in `/_not-found`); `find src/app -name 'page.tsx'` returns only `src/app/page.tsx`.
3. `grep -rnE "fetch\(|XMLHttpRequest|localStorage|sessionStorage" src/` finds nothing, and `grep -rnE "https?://" src/ | grep -v xmlns` finds nothing (inline SVG `xmlns` is the only allowed URL).
4. `test ! -d app && test -f src/app/page.tsx`, and `tsconfig.json` has `"@/*": ["./src/*"]`.
5. `npm run dev`, then manual checks:
   - 2 tabs. The default is "공예품 전시·주문". Switching works (AC 1).
   - All 4 craft types appear, each card has 5 fields, and both classes appear (AC 2, 4).
   - Each CTA opens a modal that shows the right item (AC 3, 5).
   - The modal closes by ESC, backdrop click and 닫기. Empty submit shows errors, and 인원 above capacity is blocked (AC 6).
   - Valid submit shows about 700ms of loading, then `OG-…` and the completion message in the same modal (AC 7, 8).
   - **Failure path:** with 연락처 `010-0000-0000` the submit shows about 700ms of loading, then an error message. The inputs are kept. Change the phone to `010-1234-5678`, resubmit, and success follows (AC 9).
   - DevTools Network, filtered to Fetch/XHR and cleared before submit: 0 requests during either flow (AC 9). Run this on `npm run build && npm start`, not only `npm run dev`, because dev mode adds HMR and RSC traffic.
   - The notice text is visible in the header and in both modals (AC 10).
   - Date `min`: in the 신청 modal, the 희망일 input's `min` attribute equals the local date (`YYYY-MM-DD`), and yesterday cannot be picked. Also override the DevTools timezone (Sensors) to a zone whose local date currently differs from the UTC date (for example `Pacific/Kiritimati` UTC+14 or `Pacific/Pago_Pago` UTC−11) and confirm `min` equals that zone's local date. The clock cannot be changed, so do not rely on running at 00:00–09:00 KST.
   - DevTools device mode at **375×667**: no horizontal scroll, cards in a single column, the modal fits and scrolls internally, and the tabs do not wrap badly. Also check at 1280×800 (AC 11).
6. Keyboard pass: Tab reaches the tabs, the cards and the CTA. When the modal opens, focus moves inside it. After ESC, focus returns to the trigger, which is native `<dialog>` behaviour.

## 7. ADR (short)
- **Decision:** move to `src/`, use native `<dialog>` modals, keep tab state in the client, use a TypeScript Mock API with a 700ms delay, add zero new dependencies, and use a system Korean font stack (confirmed by the user).
- **Drivers:** AC 6 accessibility with minimal code, lint and build passing under the strict hooks rules, and prototype simplicity.
- **Alternatives considered:** a custom overlay or a Radix/Headless UI modal; URL `?tab=` state; `next/font/google` Korean fonts.
- **Why chosen:** these are platform features, they need the least code and have no network or build-time dependency, and they match the spec's defaults.
- **Consequences:** the tab state does not survive a reload. The backdrop-click handler is custom. Font rendering differs slightly between operating systems.
- **Follow-ups:** optional URL tab sync; a self-hosted Korean webfont is a possible later change and is not part of this plan.

---

## 8. Component Inventory & Responsibilities (request items 1, 3, 4)

```
src/
├─ app/{layout.tsx, page.tsx, globals.css, favicon.ico}
├─ components/
│  ├─ PracticeNotice.tsx    (shared)  실습용 안내 배너, variant: banner | compact. 'use client' 없음, 서버(page)·클라이언트(폼) 양쪽에서 사용
│  ├─ StudioTabs.tsx        (client)  탭 상태, 선택 항목/열린 모달 상태 소유, 카드·모달 조립
│  ├─ ProductCard.tsx       (client 번들, directive 없음)  표시 + onInquire(product)
│  ├─ ClassCard.tsx         (client 번들, directive 없음)  표시 + onEnroll(craftClass)
│  ├─ CraftIllustration.tsx (shared)  illustration key → SVG. 'use client' 없음, 클라이언트 ProductCard에서 import되어 클라이언트 번들로 실행
│  ├─ Modal.tsx             (client)  <dialog> 래퍼(열기/닫기/백드롭/제출중 잠금)
│  ├─ InquiryForm.tsx       (client)  주문 문의 폼 + idle/submitting/success/error
│  └─ EnrollmentForm.tsx    (client)  클래스 신청 폼 + 동일 상태 머신
├─ data/{products.ts, classes.ts}
├─ lib/{mock-api.ts, validation.ts, format.ts}
└─ types/index.ts
```

| Item | Responsibility |
|---|---|
| `StudioTabs` | activeTab, 선택 항목, 열린 모달, `busy`를 소유. 폼은 `key`로 리마운트. 폼 내부 입력값과 `FormStatus`는 폼이 소유하고 `busy`만 `onBusyChange`로 보고 |
| Cards | 순수 표시. 데이터 가공 없음, 콜백만 호출 |
| `Modal` | 다이얼로그 생명주기만. 폼 내용은 모름 |
| Forms | 입력·검증·상태 머신·`mock-api` 호출. 모달 개폐는 `onDone/onClose` 콜백 |
| `mock-api.ts` | 700ms 지연, 010-0000-0000 실패, `OG-` 접수번호. 네트워크/저장 없음 |
| `validation.ts` | 이름·연락처·수량·인원·날짜 순수 검증 함수 |

## 9. Data Structures (request item 2)
```ts
type CraftType = '도자기' | '나전칠기' | '보자기' | '목공예';
type IllustrationKey = 'pottery' | 'najeon' | 'bojagi' | 'wood';
interface Product { id: string; name: string; craftType: CraftType; description: string; price: number; illustration: IllustrationKey }
interface CraftClass { id: string; name: string; description: string; price: number; durationMinutes: number; capacity: number }
interface InquiryRequest { productId: string; name: string; phone: string; quantity: number; message?: string }
interface EnrollmentRequest { classId: string; name: string; phone: string; date: string; headcount: number }
type MockResponse = { success: true; receiptNo: string; message: string } | { success: false; message: string };
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
```

### 9.1 Props & Function Contracts (fixed before lanes start)
```ts
// lib/mock-api.ts (L1)  — type-only relative import, see Step 2
submitInquiry(req: InquiryRequest): Promise<MockResponse>
submitEnrollment(req: EnrollmentRequest): Promise<MockResponse>
// lib/format.ts (L0)
formatPrice(n: number): string; formatDuration(min: number): string; toLocalISODate(d: Date): string
// lib/validation.ts (L3)
isValidPhone(v: string): boolean; validateInquiry(v): Errors; validateEnrollment(v, capacity, todayISO): Errors
// components
PracticeNotice { variant?: 'banner' | 'compact' }                       // L0, no directive
CraftIllustration { name: IllustrationKey; className?: string }         // L2, no directive
ProductCard { product: Product; onInquire(product: Product): void }     // L2
ClassCard { craftClass: CraftClass; onEnroll(craftClass: CraftClass): void } // L2
Modal { open: boolean; onClose(): void; busy: boolean; titleId: string; children: ReactNode } // L3
InquiryForm { product: Product; onBusyChange(busy: boolean): void; onClose(): void }          // L3
EnrollmentForm { craftClass: CraftClass; onBusyChange(busy: boolean): void; onClose(): void } // L3
StudioTabs { products: Product[]; classes: CraftClass[] }               // L4 (only serializable props)
```
`onBusyChange` is called from the submit handler, never from an effect. `StudioTabs` stores `busy` and passes it to `Modal`.

## 10. Agent File Ownership & Integration (request item 7)
모든 파일은 정확히 한 명의 소유자를 가진다. 소유자가 아닌 레인은 그 파일을 수정하지 않는다.

| File / action | Owner |
|---|---|
| `mv app→src/app`, root `app/` 삭제, `rm -rf .next`, `npx next typegen` | L0 |
| `tsconfig.json`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/favicon.ico` | L0 |
| `src/app/page.tsx` (L0: placeholder, L4: 최종) | L0 → L4 (순차, 겹치지 않음) |
| `public/*.svg` 삭제 | L0 |
| `src/types/index.ts`, `src/lib/format.ts` | L0 |
| `src/components/PracticeNotice.tsx` | L0 |
| `src/data/products.ts`, `src/data/classes.ts`, `src/lib/mock-api.ts` | L1 |
| `CraftIllustration.tsx`, `ProductCard.tsx`, `ClassCard.tsx` | L2 |
| `Modal.tsx`, `InquiryForm.tsx`, `EnrollmentForm.tsx`, `src/lib/validation.ts` | L3 |
| `StudioTabs.tsx`, `src/app/page.tsx`(최종), `README.md`(선택) | L4 |

- **잠금(L0 종료 후):** `types`, `format.ts`, `globals.css`, `layout.tsx`, `tsconfig.json`, `PracticeNotice.tsx`. L1–L4는 수정하지 않는다.
- **변경 요청 절차:** 다른 레인 파일의 변경이 필요하면 직접 수정하지 않고 오케스트레이터(메인 세션)에 보고한다. 오케스트레이터가 해당 소유 파일을 수정(또는 소유 레인을 재실행)하고 아래 게이트를 다시 돌린다. L0는 종료 후에도 이 경로로만 수정된다. `validation.ts`는 폼 규칙(날짜, 인원 1~정원)을 인코딩하므로 폼을 설계하는 L3가 소유한다.
- **의존성:** L1·L2는 L0 종료 후 병렬. L3는 L0(types, format, PracticeNotice)와 §9.1 시그니처에 맞춰 바로 작성할 수 있으나 `@/lib/mock-api` 해석 확인은 L1 종료 후에 한다. L4는 L1–L3 종료 후.
- **게이트(실행 가능한 형태):**
  - `rm -rf .next` 후에는 `LayoutProps` 등 생성 타입이 없으므로 `npx next typegen`을 먼저 실행한다.
  - 레인 종료 조건: `npx next typegen && npx tsc --noEmit -p .` 출력에서 **자기 소유 파일의 오류가 0**이고, 소유 범위 밖 파일을 수정하지 않았음(파일 목록·수정 시각으로 확인. 프로젝트가 상위 저장소에서 untracked라 `git diff`를 쓸 수 없음).
  - 다른 레인의 미완성 파일 때문에 나는 오류는 해당 레인 게이트에서 무시한다. **전체 tsc 오류 0은 L4 종료 시점(동기화 지점)에서만** 요구한다.
  - `tsc file.ts`처럼 tsconfig를 무시하는 실행은 쓰지 않는다.

## 11. Implementation Order (request item 5)
L0 → (L1 ‖ L2 ‖ L3) → L4 → 전체 검증. Steps 1–5 in §3 map to: Step1=L0, Step2=L0+L1(+validation은 L3), Step3=L0(PracticeNotice, globals)+L2+L4, Step4=L3+L4, Step5=검증.

## 12. Accessibility Conditions (request item 8)
- **Tab:** `role=tablist` 안에 정확히 2개 `role=tab`, `aria-selected`, `aria-controls`↔`role=tabpanel`+`aria-labelledby`. roving `tabindex`(활성 0, 비활성 -1), ←/→/Home/End로 이동. 비활성 패널은 `hidden`.
- **Modal:** `showModal()`로 열어 포커스 트랩·배경 inert. `aria-labelledby`=제목. 열릴 때 `showModal()` 직후 같은 effect에서 `[data-autofocus]`(폼의 첫 입력)에 `.focus()` 호출(기본 동작은 첫 포커스 가능 요소인 닫기 버튼이라 명시 필요), 닫힐 때 트리거 버튼으로 복귀. ESC/닫기 버튼/백드롭 클릭으로 닫힘. 제출 중 닫기 차단은 best-effort(Chromium은 사용자 활성화 없는 두 번째 ESC를 막지 못할 수 있음). 부모는 제출 중 닫힘을 견뎌야 하며 언마운트 후 resolve된 결과는 무시한다. `::backdrop`은 명시적 스타일.
- **Form:** 모든 입력에 `<label htmlFor>`, 필수 표시(`required` + 텍스트 "필수"), `noValidate` + 커스텀 한국어 오류. 오류는 필드 옆 텍스트 + `aria-invalid` + `aria-describedby`. 제출 실패 시 첫 오류 필드로 포커스. 결과/오류 메시지는 `role="status"`(성공)·`role="alert"`(오류). 제출 버튼은 `aria-busy`, 로딩 문구 "접수 중…".
- 색 대비: 본문 4.5:1 이상. 포커스 링(`focus-visible`) 항상 표시. 터치 타겟 44px 이상. 일러스트는 `aria-hidden`.

## 13. Mock API Success/Failure Test Method (request item 9)
테스트 러너가 없으므로 (신규 의존성 금지) 두 층으로 검증한다.
1. **수동(브라우저)**
   - 성공: 연락처 `010-1234-5678` → 약 700ms 로딩 → `OG-` 접수번호와 완료 메시지.
   - 실패: 연락처 `010-0000-0000` (하이픈 없는 `01000000000`도 동일) → 로딩 → 오류 `role=alert`, 입력값 유지, 버튼 재활성. 번호를 바꿔 재제출하면 성공.
   - 두 폼 모두 반복. DevTools Network(Fetch/XHR) 요청 0건.
2. **스크립트(선택, 의존성 없음)** `node --experimental-strip-types`로 `mock-api.ts`를 직접 호출해 (a) 소요 시간 ≥ 650ms, (b) 실패 번호 → `success:false`, (c) 그 외 → `receiptNo` 가 `/^OG-\d{6,8}$/`인지 확인. 스크립트는 저장소에 남기지 않고 scratchpad에서 실행.
   - **실행 방법:** scratchpad의 러너가 `mock-api.ts`를 **`.ts` 확장자가 붙은 절대 경로**로 import한다(확장자가 없으면 `ERR_MODULE_NOT_FOUND`). 이 저장소의 Node는 v26.7.0이며 타입 제거가 기본 활성이라 `--experimental-strip-types` 플래그는 있어도 없어도 된다(이전 버전 Node에서만 필요).
   - **실행 가능 조건:** `mock-api.ts`는 `import type ... from '../types'`(상대 경로, 타입 전용, 런타임에 제거됨)만 쓴다. `@/` 별칭과 다른 프로젝트 파일의 값 import는 금지(§3 Step 2). 타입 제거는 별칭을 해석하지 못하고 값 import는 확장자 없이는 실패하기 때문이다. 전화번호 정규화는 `mock-api.ts` 안에 인라인(`validation.ts`와 의도적으로 중복).
   - **실행 불가 시:** 위 조건으로도 스크립트가 실행되지 않으면 스크립트 검증은 건너뛰고 1번 수동 검증만으로 AC 7–9를 판정한다. 결과에 "스크립트 검증 미실시, 수동 검증으로 대체"라고 명시한다. 실행 불가를 이유로 `mock-api.ts` 구조를 바꾸거나 테스트 의존성을 추가하지 않는다.

## 14. Pass Conditions for lint & build (request item 10)
최종 완료는 아래를 **모두** 만족할 때만 선언한다.
1. `rm -rf .next && npm run lint` → exit 0, error 0 (warning은 목록 보고, react-hooks 규칙 위반은 0).
2. `npm run build` → exit 0, TypeScript 오류 0, `/` 가 정적(○)으로 표시. 라우트는 `/`(+ 내장 `/_not-found`)뿐이고 `src/app/**/page.tsx`는 `src/app/page.tsx` 하나다(탭·폼용 별도 라우트 없음).
3. 루트 `app/` 없음, `src/app/page.tsx` 존재, `tsconfig` `@/*`=`./src/*`.
4. `package.json` dependencies/devDependencies 변경 없음(신규 의존성 0).
5. §6 검증 1–6단계 전부 통과, 스펙 AC 1–12 매핑표(§4) 전 항목 확인.
6. 코드에 `fetch`/`XMLHttpRequest`/storage 사용 0, TODO·skip·stub 테스트·미구현 분기 0.
7. 검증은 구현자가 아닌 별도 verifier 패스가 수행한다.
8. `npx next typegen && npx tsc --noEmit -p .` → exit 0 (L4 종료 시점, 전체 오류 0). `@/lib/...` 별칭 import 해석도 여기서 확인한다.

## 15. Changelog (Architect review 반영, Critic 미실시)
- `git mv`→`mv`, 검증 grep에서 `xmlns` 제외, 모달 스크롤/백드롭/열림 가드/제출 중 잠금, 날짜 `min` lazy init, 폰트를 "사용자 확인 필요 가정"으로 격하, 탭 키보드 조작 추가.
- (Round 2, 사용자 요청) 날짜 `min`을 UTC `toISOString()`이 아닌 로컬 날짜(`toLocalISODate`)로 명시, `PracticeNotice`/`CraftIllustration`을 `server`가 아닌 `shared`(directive 없음)로 정정, §13 스크립트 검증의 import 제약(`import type`만)과 실행 불가 시 수동 검증 대체 명시, 폰트를 시스템 한글 폰트 스택으로 확정.
- Critic Round 2 결과: REVISE (major 4: L3→L2 의존성, 레인 간 props 계약 부재, 실행 불가한 레인별 tsc 게이트, 파일 소유자 누락 / minor 9).
- (Round 3) 반영: `PracticeNotice`를 L0로 이동, §9.1 props·함수 계약 추가, 게이트를 `next typegen` + 프로젝트 전체 `tsc` 기준으로 재정의, 모든 파일 1:1 소유 표와 변경 요청 절차 추가(`validation.ts`는 L3), 카드 콜백명 통일(`onInquire/onEnroll`), 백드롭 닫기 정의 단일화, 신규 파일 수 14, 카드 directive 없음 명시, ESC 잠금 best-effort, 열림 시 `[data-autofocus]` 포커스, 타임존 검증을 Kiritimati/Pago_Pago로 변경, 네트워크 0건은 build+start에서도 확인, §13 러너 import 규칙(`.ts` 절대 경로), globals.css 교체 항목과 다크 모드 제거 확정, Step 1 AC에서 `@/lib` 확인을 L4로 이동, 전화번호 정규화 중복 명시.
- Critic Round 3 결과: APPROVE (사소한 정리 4건은 비차단).
- (Round 4, 사용자 요청) 단일 페이지 + 페이지 내부 탭 구조 점검: 구조 자체(`/` 하나, `StudioTabs` 클라이언트 상태 탭)는 이미 맞았으나 명시가 부족해 보강. §1에 페이지 구조 고정, B1에 라우트 분리안 기각 사유, Step 3에 탭을 `<button>`으로 구현·라우터 훅 금지·`page.tsx` 하나만 존재, AC 1 검증에 링크 아님/URL 불변, §6·§14에 빌드 라우트 표와 `page.tsx` 개수 확인 추가.
