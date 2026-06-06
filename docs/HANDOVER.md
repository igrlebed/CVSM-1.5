# Handover

## Сделано (UI / DX)

- [x] Дизайн-система: `NeoSurface`, `NeoButtonShell`, `IconButton`, `WorkspaceSectionHeader`, шкала `--gap-*`, единые `--border-stroke*`, токены теней, `.neo-interactive`, `neo-select-pill`, `neo-check`, `neo-collapse`, `neo-scroll-fade`, `neo-dropdown-panel` — см. `docs/STYLING.md`
- [x] Состояния hover / focus / active на кнопках
- [x] A11y: `aria-expanded`, `aria-pressed`, `aria-label` регионов, focus слайдера
- [x] Адаптив: KPI grid, сайдбар-drawer, KPI scroll на узких экранах
- [x] Связка год ↔ слайдер; легенда карты — статичная
- [x] PrimeVue preset под токены CVSM
- [x] Страница `/ui-kit`
- [x] Конструктор: сценарий, KPI, управление проектами, гант (`3921:29528`)
- [x] Ранжирование: панель критериев + таблица результатов (`ProjectsOverviewTable`)
- [x] Показатели: сводная таблица обзора (общий компонент с ранжированием)
- [x] Единый паттерн выбора `neo-select-pill` (карточки, dropdown, drawer, nav pills workspace)
- [x] Варианты выбора проектов: scroll, carousel, dropdown (мультивыбор), drawer; stepper/combo недоступны на показателях/ранжировании
- [x] Подсказка у логотипа (мигание + tooltip) при первом входе в каждый раздел workspace — `useLogoVariantHint`
- [x] Сайдбар: единая анимация `neo-collapse`, скролл списка проектов, `neo-scroll-fade`
- [x] Таблица ранжирования: фиксированная шапка колонок, вертикальный скролл внутри `neo-shell`
- [x] Карточки критериев: стабильные отступы при выкл. toggle; счётчик в кнопке «N Критерия»

## Открыто (функционал / API)

- [ ] Интерактивная карта вместо placeholder
- [ ] Подключение API для KPI и проектов (заменить `kpiLoading` на реальный fetch)
- [ ] Показатели: полный контент вкладок (таблица обзора есть)
- [ ] Toast / ошибки API / empty states для API

## Бэклог качества кода

Проверка от 2026-06-04. **Приоритет сейчас — визуальная стабильность; исправления отложены.**

| ID | Проблема | Место | Критичность | Обход | План исправления |
|----|----------|-------|-------------|-------|------------------|
| Q-01 | `aria-label` в шаблоне не мапится на prop `ariaLabel` — `nuxi typecheck` падает | `IndicatorsOverviewTable.vue`, `RankingResultsTable.vue` | blocker | `npm run build` проходит; в runtime aria работает | Заменить `aria-label` → `aria-label` через `:aria-label` или prop `ariaLabel` |
| Q-02 | Нет MOCK-комментариев с endpoint | `mocks/ranking.ts` (критерии), `mocks/constructor.ts` | high | Данные в `mocks/` очевидны | Добавить `// MOCK: replace with GET /api/v1/...` |
| Q-03 | Компоненты >300 строк | `ConstructorGanttChart` (830), `ProjectSelector` (720), `ProjectsOverviewTable` (476) | high | Работают как есть | Декомпозиция на подкомпоненты / composables |
| Q-04 | Нет ESLint и `npm run lint` | `package.json` | high | Ручной review | Подключить `@nuxt/eslint`, скрипт lint в CI |
| Q-05 | `criteriaCount` дублирует `criteria.length` | `mocks/ranking.ts`, `RankingCriteriaCard.vue` | medium | Fallback на `criteria.length` | Убрать поле из моков, считать из массива |
| Q-06 | Склонение «критерий» inline в компоненте | `RankingCriteriaCard.vue` | medium | — | Вынести в `utils/pluralize.ts` или composable |
| Q-07 | `RankingTableGroup` дублирует `ProjectsOverviewGroup` | `mocks/ranking.ts`, `types/projectsOverview.ts` | medium | Структуры совместимы | Унифицировать тип в `types/` |
| Q-08 | Hardcoded `px` вместо `--gap-*` | `RankingCriteriaCard.vue` | medium | Визуал совпадает с макетом | Заменить на токены gap |
| Q-09 | `YearSlider`: thumb — локальные `rgba`-тени | `YearSlider.vue` | low | Визуал ок | Вынести в `tokens.css` |
| Q-10 | Pulse логотипа — hardcoded `rgb` | `DashboardHeader.vue` | low | Работает | Токен `--focus-ring-pulse` или алиас accent |
| Q-11 | `UiNeoSurface` не везде — ручной `neo-shell-*` | KPI, header, карта, таблицы и др. | low | Визуально эквивалентно | Опциональная миграция на `UiNeoSurface` |
| Q-12 | `ProjectTabBar` — отдельная chip-система теней | `ProjectTabBar.vue` | low | Осознанное решение | Оставить или унифицировать с `neo-select-pill` |
| Q-13 | `AccordionItem` — локальные тени (эталон Figma) | `AccordionItem.vue` | low | Совпадает с макетом | Вынести в токены при необходимости |

## Для разработчиков

Полные правила: **`docs/STYLING.md`**.

Кратко:
1. Токены — `assets/css/tokens.css`; классы — `assets/css/neomorphic.css`.
2. Острова → `UiNeoSurface` (или вручную `neo-shell-*` — см. Q-11); кнопки → `UiNeoButtonShell` / `IconButton`.
3. Обводки, gap, overlay, switch — только токены; выбор → `neo-select-pill--selected`.
4. Данные экрана — `useDashboardState()`.
5. Регрессия — `/` + `/ui-kit`, breakpoints 1280 / 1024 / 640; workspace: проекты, показатели, ранжирование, конструктор.
6. Сброс подсказки логотипа: `Object.keys(localStorage).filter(k => k.startsWith('cvsm-logo-variant-hint-dismissed')).forEach(k => localStorage.removeItem(k))` — подсказка только в workspace (кликабельный логотип), не на главной карте
