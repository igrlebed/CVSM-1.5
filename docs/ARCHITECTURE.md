# Архитектура CVSM

## Стек

- Nuxt 3, Vue 3 Composition API, TypeScript
- PrimeVue 4 (пресет `theme/cvsm-preset.ts`, Aura + токены CVSM)
- Моки в `/mocks/`

## Структура

- `pages/index.vue` — главный экран «Desktop — Main»
- `pages/ui-kit.vue` — витрина компонентов
- `components/dashboard/` — UI дашборда
- `components/ui/NeoSurface.vue` — оболочка неоморфных слоёв
- `composables/useDashboardState.ts` — общее состояние экрана
- `plugins/dashboard-state.ts` — provide состояния
- `assets/css/tokens.css` — дизайн-токены и тени
- `assets/css/neomorphic.css` — классы `.neo-*`, `.neo-interactive`
- `theme/cvsm-preset.ts` — тема PrimeVue
- `mocks/dashboard.ts` — KPI, проекты, легенда, мета header
- `public/images/` — ассеты из Figma

## Роутинг

| Маршрут | Назначение |
|---------|------------|
| `/` | Дашборд модели развития сети |
| `/ui-kit` | UI Kit для handover и регрессии |

## Состояние

Централизовано в `useDashboardState()` (без Pinia): год модели, фильтры легенды, выбранный проект, мобильный сайдбар, флаг loading KPI. Локально в компонентах — только UI аккордеона (`openId`).

## API

Нет. Данные из `mocks/dashboard.ts`. См. `docs/HANDOVER.md` для интеграции API.

## Стилистика

См. `docs/STYLING.md`.
