# Стилистика и дизайн-система CVSM

Эталон визуала — **главный экран** (`/`). Все экраны (проекты, ранжирование, модалки) должны совпадать по интенсивности обводок, теней и отступов.

## Источники правды

| Файл | Что настраивать |
|------|-----------------|
| `assets/css/tokens.css` | Цвета, обводки, gap, радиусы, тени, switch, overlay |
| `assets/css/neomorphic.css` | Классы `.neo-*`, `.neo-interactive`, состояния кнопок |
| `components/ui/` | Переиспользуемые оболочки (`NeoSurface`, `NeoButtonShell`) |

**Не задавать** `border`, `border-color`, `box-shadow` в scoped-стилях компонентов — только layout, размеры, радиусы.

---

## Обводки (единая точка настройки)

Все значения — в `tokens.css`. Меняя их, обновляется весь проект.

| Токен | Назначение |
|-------|------------|
| `--border-width` | Толщина (1px) |
| `--border-stroke` | Default: кнопки, карточки, аккордеон, outer-shell |
| `--border-stroke-inner` | Вложенный `shell-inner`, треки табов/слайдера |
| `--border-hover` | Hover интерактивов |
| `--border-active` | Active pill/tab/option |
| `--border-accent` | Accent CTA (`PrimaryButton`) |

Алиасы (для совместимости): `--border-primary` → `--border-stroke`, `--border-secondary` → `--border-stroke-inner`.

**Правила:**
- Кнопки с `.neo-button` наследуют `--border-stroke` автоматически.
- Выбор с вдавливанием — `neo-select-pill` + `neo-select-pill--selected` (карточки, dropdown, drawer, nav pills workspace).
- Active tab chip — `neo-button--active` только в `ProjectTabBar` (отдельная система).
- Dropdown/меню — `var(--border-stroke)`, не `--border-stroke-inner`.

---

## Отступы (gap)

Шкала: `--gap-3xs` (4) … `--gap-2xl` (24).

| Алиас | Значение | Где |
|-------|----------|-----|
| `--gap-page` | 8px | padding страницы |
| `--gap-section` | 20px | между крупными секциями |
| `--gap-kpi` | 12px | ряд KPI |
| `--gap-workspace` | 16px | колонки workspace (ранжирование, конструктор) |

Заголовок workspace: `--workspace-section-head-height` (88px), `--workspace-section-head-padding` (20px) — компонент `WorkspaceSectionHeader`.

**Конструктор:** `--constructor-scenario-width` (320px), цвета ганта `--gantt-pir`, `--gantt-smr`, `--gantt-commissioning`. Данные — `mocks/constructor.ts`.

---

## Острова (NeoSurface)

Двойная оболочка для header, KPI, карты, легенды, слайдера:

| Слой | Класс | Обводка | Фон `__bg` | Inset |
|------|-------|---------|------------|-------|
| Внешний | `.neo-shell-outer` | `--border-stroke` | `--island-external` | `--shadow-inset-soft` |
| Внутренний | `.neo-shell-inner` | `--border-stroke-inner` | `--island-inner` | `--shadow-inner-deep` |

- Отступ между слоями: `--shell-gap` (2px)
- Контент: `.neo-shell-inner__content`
- Заливка внешнего слоя: `.neo-shell-outer--fill`
- Трек слайдера: `.neo-shell-inner--track`

Компонент: `UiNeoSurface` (`depth`: `outer` | `inner` | `inner-deep` | `track`) — обёртка над `neo-shell-*`, чтобы не копировать `__bg` / `__inset` вручную. Сейчас в проде чаще ручная разметка (эквивалентна); миграция на `UiNeoSurface` — опционально, не блокер.

**Не доработан:** `YearSlider` — тени thumb заданы локально, не через токены.

---

## Кнопки

| Компонент | Оболочка | Variant / класс |
|-----------|----------|-----------------|
| `IconButton` | `NeoButtonShell` | `default`, размеры `header` / `nav` |
| `PrimaryButton` | `NeoButtonShell` | `accent` |
| `AccordionTextButton`, `ProjectListButton` | `NeoButtonShell` | `sidebar` |
| Элемент выбора | `.neo-select-pill.neo-interactive.neo-button` | + `neo-select-pill--selected` |
| Чекбокс мультивыбора | `.neo-check` | + `--checked` / `--indeterminate` |
| Tab chip (`ProjectTabBar`) | `.neo-interactive.neo-button` | + `neo-button--active` |

Интерактив: `.neo-interactive` — hover/focus/active из `neomorphic.css`.

**Не дублировать** разметку `__bg` / `__inset` — использовать `NeoButtonShell`.

---

## Прочие UI-токены

| Токен / компонент | Назначение |
|-------------------|------------|
| `--overlay-backdrop` | Overlay drawer/modal/sidebar mobile |
| `--headline-hover-bg` | Hover заголовка аккордеона |
| `NeoSwitch` | Токены `--switch-*`, `--border-stroke-switch-off*` |
| Тени аккордеона | `--shadow-outer-sidebar`, `--shadow-accordion-open-inset` — эталон, не менять без Figma |

---

## Аккордеон сайдбара

- Headline padding: `12px 24px` (open: `16px 24px`) — `--gap-md` / `--gap-2xl`
- Info-body: `24px 16px` — `--gap-2xl` / `--gap-lg`
- Обводка секции: `--border-stroke`

---

## Чеклист для нового компонента

0. **Не переопределять** shared-компоненты (`IconButton`, `NeoButtonShell`, …) в scoped-стилях экрана — только пропсы/слоты. См. `.cursor/rules/no-shared-ui-overrides.mdc`.
1. Остров → `UiNeoSurface` или классы `.neo-shell-*`
2. Кнопка → `UiNeoButtonShell` или `.neo-button` + `.neo-interactive`
3. Выбор → `neo-select-pill--selected`; tab chip → `neo-button--active`
4. Gap/padding → `--gap-*`
5. Обводка/тень → только токены из `tokens.css`
6. Проверка: `/` и `/ui-kit`, breakpoints 1280 / 1024 / 640

См. также `docs/HANDOVER.md`, `docs/CHANGELOG.md`.
