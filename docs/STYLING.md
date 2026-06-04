# Стилистика и дизайн-система CVSM

## Визуальный язык

Светлый **soft UI / неоморфизм**: «острова» на фоне `--background-primary`, двойные внешние и inset-тени, скругления 16–36px. Типографика **Onest**, палитра текста — холодный синий (`--text-primary` → `--text-muted`).

## Когда какой слой

| Слой | Компонент / класс | Назначение |
|------|-------------------|------------|
| Outer | `UiNeoSurface depth="outer"` / `.neo-outer` | KPI, карта, слайдер, легенда |
| Outer sidebar | `tone="sidebar"` / `.neo-outer--sidebar` | Сайдбар, карта (чуть контрастнее тень) |
| Inner | `depth="inner"` / `.neo-inner` | Контент внутри outer-рамки |
| Inner deep | `depth="inner-deep"` | KPI body, область карты, легенда |
| Track | `depth="track"` | Вдавленный трек слайдера |
| Кнопка | `.neo-button` + `.neo-interactive` | Hover/focus/active |

## Токены теней

Определены в `assets/css/tokens.css`: `--shadow-outer`, `--shadow-outer-sidebar`, `--shadow-inset-soft`, `--shadow-inner-deep`, `--shadow-track-inset`.

## Состояния

- **Интерактив**: класс `.neo-interactive` — hover (inset глубже), `:focus-visible` (outline `--focus-ring`), `:active` (scale 0.99).
- **Слайдер**: `:has(input:focus-visible)` подсвечивает thumb.
- **Аккордеон**: `aria-expanded`, анимация `grid-template-rows`, `prefers-reduced-motion` отключает transition.

## Состояние приложения

`plugins/dashboard-state.ts` — provide `useDashboardState()`:

- `modelYear` — год сценария (слайдер)
- `selectedProjectId` — выбранный проект в сайдбаре
- `sidebarOpen` — drawer на `< 1024px`
- `kpiLoading` — skeleton KPI (демо на `/ui-kit`)

## Адаптив

| Breakpoint | Поведение |
|------------|-----------|
| `≤ 1280px` | KPI 3×2, скрыт «Обновлено» в header |
| `≤ 1024px` | KPI 2 колонки, сайдбар — overlay + кнопка «Меню» |
| `≤ 640px` | KPI — горизонтальный scroll-snap |

## PrimeVue

Пресет `theme/cvsm-preset.ts` (Aura + токены CVSM). Использовать Prime для сложных виджетов (таблицы, диалоги); дашборд — кастомные компоненты.

## UI Kit

Страница `/ui-kit` — NeoSurface, KPI, кнопки, слайдер, бейджи.
