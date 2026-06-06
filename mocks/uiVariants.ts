export type ProjectWorkspaceCardsVariant =
  | 'scroll'
  | 'carousel'
  | 'dropdown'
  | 'stepper'
  | 'drawer'
  | 'dropdownStepper'

/** Блок «Управление проектами» в конструкторе */
export type ConstructorProjectsVariant = 'grid' | 'drawer'

export const constructorDefaultVariant: ConstructorProjectsVariant = 'grid'

/** На экранах с мультивыбором (показатели, ранжирование) недоступны — подставляется scroll */
export const multiSelectForbiddenVariants: ProjectWorkspaceCardsVariant[] = [
  'stepper',
  'dropdownStepper',
]

export const multiSelectDefaultVariant: ProjectWorkspaceCardsVariant = 'scroll'

/** @deprecated используйте multiSelectForbiddenVariants */
export const indicatorsForbiddenVariants = multiSelectForbiddenVariants

/** @deprecated используйте multiSelectDefaultVariant */
export const indicatorsDefaultVariant = multiSelectDefaultVariant

export function isVariantAllowedForMultiSelect(
  variant: ProjectWorkspaceCardsVariant,
): boolean {
  return !multiSelectForbiddenVariants.includes(variant)
}

/** @deprecated используйте isVariantAllowedForMultiSelect */
export const isVariantAllowedForIndicators = isVariantAllowedForMultiSelect

export function getEffectiveProjectSelectionVariant(
  variant: ProjectWorkspaceCardsVariant,
  forMultiSelect: boolean,
): ProjectWorkspaceCardsVariant {
  if (forMultiSelect && multiSelectForbiddenVariants.includes(variant)) {
    return multiSelectDefaultVariant
  }
  return variant
}

export interface UiVariantOption<T extends string = string> {
  id: T
  label: string
  description?: string
  /** Нельзя выбрать при мультивыборе (показатели, ранжирование) */
  disabledForMultiSelect?: boolean
  /** @deprecated используйте disabledForMultiSelect */
  disabledForIndicators?: boolean
}

export const constructorProjectsVariantOptions: UiVariantOption<ConstructorProjectsVariant>[] =
  [
    {
      id: 'grid',
      label: 'Сетка',
      description: 'Две колонки, все карточки в блоке',
    },
    {
      id: 'drawer',
      label: 'Дровер',
      description: 'Кнопка «Добавить проект» открывает панель, в блоке — выбранные',
    },
  ]

export const projectWorkspaceCardsVariantOptions: UiVariantOption<ProjectWorkspaceCardsVariant>[] =
  [
    {
      id: 'scroll',
      label: 'Горизонтальный скролл',
      description: 'Все карточки в ряд, прокрутка по горизонтали',
    },
    {
      id: 'carousel',
      label: 'Карусель',
      description: 'Переключение карточек стрелками по бокам',
    },
    {
      id: 'dropdown',
      label: 'Выпадающий список',
      description: 'Выбор проекта из меню в шапке экрана',
    },
    {
      id: 'stepper',
      label: 'Переключатель',
      description: 'Предыдущий и следующий проект стрелками у названия',
      disabledForMultiSelect: true,
    },
    {
      id: 'drawer',
      label: 'Дровер',
      description: 'Кнопка «Выбрать проект» у названия открывает панель справа',
    },
    {
      id: 'dropdownStepper',
      label: 'Список и переключатель',
      description: 'Выпадающий список и стрелки вперёд / назад справа от него',
      disabledForMultiSelect: true,
    },
  ]
