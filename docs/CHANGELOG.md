## 2026-06-04 — Главный экран Desktop — Main

- **Что**: Инициализирован Nuxt 3 + PrimeVue 4, сверстан дашборд из Figma (header, KPI, сайдбар, карта, легенда, CTA, таймлайн).
- **Зачем**: Перенос макета `6275:25399` в кодовую базу CVSM.
- **Файлы**: `pages/index.vue`, `components/dashboard/*`, `mocks/dashboard.ts`, `assets/css/*`, `public/images/*`, `nuxt.config.ts`
- **Mock**: KPI, проекты, легенда, годы — `mocks/dashboard.ts`
- **Техдолг / Заметки**: Карта — placeholder SVG; интерактивная карта и API — `[DEV]`. Секции «Показатели», «Конструктор», «Ранжирование» — заглушки аккордеона.

## 2026-06-04 — Дизайн-система и UX дашборда

- **Что**: `NeoSurface`, токены теней, `useDashboardState`, интерактивные состояния, адаптив, фильтр легенды, meta в header, `/ui-kit`, пресет PrimeVue `CvsmPreset`.
- **Зачем**: Закрыть рекомендации по UI-стилистике и подготовить handover.
- **Файлы**: `components/ui/NeoSurface.vue`, `composables/useDashboardState.ts`, `plugins/dashboard-state.ts`, `theme/cvsm-preset.ts`, `pages/ui-kit.vue`, `docs/STYLING.md`, обновлены `ARCHITECTURE.md`, `HANDOVER.md`

## 2026-06-04 — Dev: `#app-manifest`

- **Что**: `experimental.appManifest: false`, скрипт `npm run dev:clean`.
- **Зачем**: Убрать Pre-transform error Vite 7 в `nuxt dev` (кэш `.nuxt` / `node_modules/.cache/vite`).
