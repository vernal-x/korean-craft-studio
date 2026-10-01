## Handoff: team-plan → team-exec

- **Decided**: single route `/`; `StudioTabs` (Lead) takes `craftPanel`/`classPanel` ReactNode props; native <dialog> `Modal` (Lead); forms use `FormField` + `SubmitFeedback` (Lead). Types/mock-api/validation/format/globals.css done by Lead before workers start. Light theme only, system Korean font stack.
- **Ownership**: worker-a = `src/app/layout.tsx`, `src/components/{Header,Footer,PracticeNotice}.tsx`. worker-b = `src/mocks/crafts.ts`, `src/components/crafts/*`, `public/images/crafts/*`. worker-c = `src/mocks/classes.ts`, `src/components/classes/*`, `public/images/classes/*`. Lead = `src/app/page.tsx`, `globals.css`, `types/index.ts`, `lib/{mock-api,validation,format}.ts`, `components/{Modal,FormField,SubmitFeedback,Hero,StudioTabs}.tsx`.
- **Rejected**: route-per-tab; Radix/Headless UI; next/font/google; external images.
- **Risks**: B/C import PracticeNotice (worker-a) — unresolved import is expected until worker-a reports; strict react-hooks lint (no setState in effects); `rm -rf .next` needs `npx next typegen` before tsc.
- **Files**: see Ownership.
- **Remaining**: Lead integrates page.tsx, then lint/build/browser verification by a verifier pass.
