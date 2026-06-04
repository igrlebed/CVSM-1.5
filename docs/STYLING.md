# Стилистика и дизайн-система CVSM

## Визуальный язык

Светлый **soft UI / неоморфизм**: «острова» на фоне `--background-primary`, двойные внешние и inset-тени, скругления 16–36px.

## Двойная оболочка (обязательно)

Все блоки-острова (header, KPI, карта, легенда, слайдер) строятся из **одинаковой пары слоёв**:

| Слой | Классы | Border | Фон `__bg` | Inset-тень |
|------|--------|--------|------------|------------|
| **Внешний** | `.neo-shell-outer` + `__bg` + `__inset` | `--border-primary` | `--island-external` | `--shadow-inset-soft` |
| **Внутренний** | `.neo-shell-inner` + `__bg` + `__inset` | `--border-secondary` | `--island-inner` | `--shadow-inner-deep` |

- Отступ между слоями: `--shell-gap` (4px) на `.neo-shell-outer`
- Контент: `.neo-shell-inner__content` (`z-index: 1`)
- Исключение фона внешнего слоя: `.neo-shell-outer--fill` (слайдер) — `--background-primary`

Не дублировать border/box-shadow в scoped-стилях компонентов — только радиусы, размеры и layout.

## Прочие классы

| Назначение | Классы |
|------------|--------|
| Кнопка secondary | `.neo-button` + `.neo-interactive` |
| Primary | `PrimaryButton` + `.neo-accent-button` |
| Трек слайдера | `.neo-shell-inner.neo-shell-inner--track` |

## Состояние приложения

`useDashboardState()` — год, проект, сайдbar, KPI loading. См. `docs/ARCHITECTURE.md`.

## UI Kit

`/ui-kit` — витрина компонентов.
