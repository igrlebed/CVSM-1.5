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

## 2026-06-04 — Правило: без переопределения shared UI

- **Что**: `.cursor/rules/no-shared-ui-overrides.mdc`, пункт в `STYLING.md`.
- **Зачем**: Единообразие кнопок/оболочек; не дублировать кастомные стили на экранах.

## 2026-06-04 — Экран «Конструктор»

- **Что**: Сверстан экран по Figma `3921:29528` — сценарий, параметры (KPI), управление проектами (grid pills, мультивыбор), гант с привязкой к выбранным проектам.
- **Зачем**: Рабочий UI конструктора с переиспользованием паттернов ранжирования/показателей и mock-данными для всех 19 проектов.
- **Файлы**: `mocks/constructor.ts`, `ConstructorWorkspace.vue`, `ConstructorScenarioPanel.vue`, `ConstructorProjectCard.vue`, `ConstructorProjectManagement.vue`, `ConstructorGanttChart.vue`, `ProjectWorkspace.vue`, `useDashboardState.ts`, `tokens.css`

## 2026-06-04 — Документация дизайн-системы

- **Что**: Актуализирован `docs/STYLING.md` (токены обводок, gap, компоненты, чеклист); ссылки в `HANDOVER.md`, `ARCHITECTURE.md`.
- **Зачем**: Единый источник правил для handover и дальнейшей подгонки цветов из `tokens.css`.

## 2026-06-04 — Единая система обводок

- **Что**: Токены `--border-stroke*` в `tokens.css`, класс `neo-button--active`, убраны локальные `border-color` в компонентах проектов.
- **Зачем**: Консистентная интенсивность обводки как на главном экране; настройка цветов из одного файла.
- **Файлы**: `assets/css/tokens.css`, `assets/css/neomorphic.css`, `ProjectWorkspace.vue`, `ProjectTabBar.vue`, `ProjectSelector.vue`, `ProjectCardsPanel.vue`, `ProjectDrawer.vue`, `UiVariantsModal.vue`, `YearSlider.vue`, `AccordionItem.vue`

## 2026-06-04 — Унификация токенов и UI-оболочек

- **Что**: Шкала `--gap-*`, `WorkspaceSectionHeader`, `NeoButtonShell`, токены `NeoSwitch` и `--overlay-backdrop`; ранжирование и аккордеон на токенах (headline 24px, workspace gap 16px).
- **Зачем**: Единое поддерживаемое решение для Конструктора и дальнейших секций без дублирования стилей.
- **Файлы**: `assets/css/tokens.css`, `components/ui/NeoButtonShell.vue`, `components/ui/NeoSwitch.vue`, `components/dashboard/WorkspaceSectionHeader.vue`, `PrimaryButton.vue`, `AccordionTextButton.vue`, `ProjectListButton.vue`, `Ranking*.vue`, `AccordionItem.vue`, `docs/HANDOVER.md`

## 2026-06-04 — Dev: `#app-manifest`

- **Что**: `experimental.appManifest: false`, скрипт `npm run dev:clean`.
- **Зачем**: Убрать Pre-transform error Vite 7 в `nuxt dev` (кэш `.nuxt` / `node_modules/.cache/vite`).

## 2026-06-04 — Ранжирование, конструктор, унификация UI

- **Что**: Экраны «Ранжирование» и «Конструктор»; общая `ProjectsOverviewTable` для показателей и ранжирования; `neo-select-pill` / `neo-check` / `neo-collapse`; подсказка логотипа; правки скролла таблицы и карточек критериев.
- **Зачем**: Визуальная стабильность прототипа перед передачей; единая неоморфная стилистика workspace.
- **Файлы**: `Ranking*.vue`, `Constructor*.vue`, `ProjectsOverviewTable.vue`, `useProjectsOverviewColumns.ts`, `useLogoVariantHint.ts`, `mocks/ranking.ts`, `mocks/constructor.ts`, `assets/css/neomorphic.css`, `assets/css/tokens.css`, `docs/STYLING.md`
- **Техдолг**: Реестр Q-01…Q-13 в `docs/HANDOVER.md` (исправления отложены).

## 2026-06-04 — Аудит качества кода

- **Что**: Pre-handover проверка: build OK, typecheck 2 ошибки (ariaLabel), бэклог задокументирован.
- **Зачем**: Зафиксировать известные проблемы без правок UI; приоритет — визуальная стабильность.
- **Файлы**: `docs/HANDOVER.md`
