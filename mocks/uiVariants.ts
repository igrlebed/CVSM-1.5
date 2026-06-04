export type ProjectWorkspaceCardsVariant =
  | 'scroll'
  | 'carousel'
  | 'dropdown'
  | 'stepper'
  | 'drawer'
  | 'dropdownStepper'

/** На экране показателей недоступны — подставляется scroll */
export const indicatorsForbiddenVariants: ProjectWorkspaceCardsVariant[] = [
  'stepper',
  'dropdownStepper',
]

export const indicatorsDefaultVariant: ProjectWorkspaceCardsVariant = 'scroll'

export function isVariantAllowedForIndicators(
  variant: ProjectWorkspaceCardsVariant,
): boolean {
  return !indicatorsForbiddenVariants.includes(variant)
}

export function getEffectiveProjectSelectionVariant(
  variant: ProjectWorkspaceCardsVariant,
  forIndicators: boolean,
): ProjectWorkspaceCardsVariant {
  if (forIndicators && indicatorsForbiddenVariants.includes(variant)) {
    return indicatorsDefaultVariant
  }
  return variant
}

export interface UiVariantOption<T extends string = string> {
  id: T
  label: string
  description?: string
  /** Нельзя выбрать на экране «Показатели» */
  disabledForIndicators?: boolean
}

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
      disabledForIndicators: true,
    },
    {
      id: 'drawer',
      label: 'Сайдвер',
      description: 'Кнопка «Выбрать проект» у названия открывает панель справа',
    },
    {
      id: 'dropdownStepper',
      label: 'Список и переключатель',
      description: 'Выпадающий список и стрелки вперёд / назад справа от него',
      disabledForIndicators: true,
    },
  ]
