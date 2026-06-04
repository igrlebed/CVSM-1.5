# Handover

## Сделано (UI / DX)

- [x] Дизайн-система: `NeoSurface`, токены теней, `.neo-interactive`
- [x] Состояния hover / focus / active на кнопках
- [x] A11y: `aria-expanded`, `aria-pressed`, `aria-label` регионов, focus слайдера
- [x] Адаптив: KPI grid, сайдбар-drawer, KPI scroll на узких экранах
- [x] Связка год ↔ слайдер; легенда карты — статичная
- [x] PrimeVue preset под токены CVSM
- [x] Страница `/ui-kit`

## Открыто

- [ ] Интерактивная карта вместо placeholder
- [ ] Подключение API для KPI и проектов (заменить `kpiLoading` на реальный fetch)
- [ ] Реализация секций Показатели / Конструктор / Ранжирование (сейчас заглушки)
- [ ] Toast / ошибки API / empty states для API

## Для разработчиков

1. Не дублировать box-shadow — использовать `UiNeoSurface` или переменные из `tokens.css`.
2. Новые кнопки — классы `neo-interactive` + `neo-button` / `neo-accent-button`.
3. Данные экрана — через `useDashboardState()`, не локальный `ref` года/фильтров.
4. Pixel-check: `/` и `/ui-kit`, breakpoints 1280 / 1024 / 640.
