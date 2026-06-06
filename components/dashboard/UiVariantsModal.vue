<script setup lang="ts">
import {
  constructorProjectsVariantOptions,
  getEffectiveProjectSelectionVariant,
  isVariantAllowedForMultiSelect,
  projectWorkspaceCardsVariantOptions,
  type ConstructorProjectsVariant,
  type ProjectWorkspaceCardsVariant,
} from '~/mocks/uiVariants'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  uiVariantsOpen,
  closeUiVariantsModal,
  projectWorkspaceCardsVariant,
  constructorProjectsVariant,
  isConstructorWorkspace,
  usesMultiProjectSelection,
} = useDashboardState()

const displayedWorkspaceVariant = computed(() =>
  getEffectiveProjectSelectionVariant(
    projectWorkspaceCardsVariant.value,
    usesMultiProjectSelection.value,
  ),
)

const modalOptions = computed(() =>
  isConstructorWorkspace.value
    ? constructorProjectsVariantOptions
    : projectWorkspaceCardsVariantOptions,
)

const displayedVariant = computed(() =>
  isConstructorWorkspace.value
    ? constructorProjectsVariant.value
    : displayedWorkspaceVariant.value,
)

function isMultiSelectRestricted(
  option: { disabledForMultiSelect?: boolean; disabledForIndicators?: boolean },
) {
  return !!(option.disabledForMultiSelect ?? option.disabledForIndicators)
}

function workspaceOptionDescription(
  option: (typeof projectWorkspaceCardsVariantOptions)[number],
) {
  if (usesMultiProjectSelection.value && option.id === 'dropdown') {
    return 'Множественный выбор проектов в списке с чекбоксами'
  }
  if (usesMultiProjectSelection.value && isMultiSelectRestricted(option)) {
    return 'Недоступно при мультивыборе проектов'
  }
  return option.description
}

function optionDescription(option: { id: string; description?: string }) {
  if (isConstructorWorkspace.value) {
    return option.description
  }
  return workspaceOptionDescription(
    option as (typeof projectWorkspaceCardsVariantOptions)[number],
  )
}

function isOptionDisabled(option: { id: string; disabledForMultiSelect?: boolean }) {
  if (isConstructorWorkspace.value) {
    return false
  }
  return (
    usesMultiProjectSelection.value
    && isMultiSelectRestricted(option)
  )
}

function pickVariant(id: string) {
  if (isConstructorWorkspace.value) {
    constructorProjectsVariant.value = id as ConstructorProjectsVariant
    return
  }

  const workspaceVariant = id as ProjectWorkspaceCardsVariant
  if (!isVariantAllowedForMultiSelect(workspaceVariant) && usesMultiProjectSelection.value) {
    return
  }
  projectWorkspaceCardsVariant.value = workspaceVariant
}

function onOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeUiVariantsModal()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeUiVariantsModal()
  }
}

watch(uiVariantsOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="uiVariantsOpen"
      class="ui-variants-overlay"
      role="presentation"
      @click="onOverlayClick"
      @keydown="onKeydown"
    >
      <div
        class="ui-variants-modal neo-shell-outer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ui-variants-title"
        @click.stop
      >
        <span class="neo-shell-outer__bg ui-variants-modal__outer-bg" aria-hidden="true" />
        <div class="ui-variants-modal__inner neo-shell-inner">
          <span class="neo-shell-inner__bg" aria-hidden="true" />
          <div class="neo-shell-inner__content ui-variants-modal__content">
            <header class="ui-variants-modal__head">
              <h2 id="ui-variants-title" class="ui-variants-modal__title">
                Выбор варианта
              </h2>
              <DashboardIconButton
                label="Закрыть"
                size="nav"
                @click="closeUiVariantsModal"
              >
                <DashboardCloseIcon />
              </DashboardIconButton>
            </header>

            <p v-if="isConstructorWorkspace" class="ui-variants-modal__note">
              Вариант блока «Управление проектами» в конструкторе.
            </p>
            <p v-else-if="usesMultiProjectSelection" class="ui-variants-modal__note">
              На экранах показателей и ранжирования переключатель и комбо-вариант недоступны —
              при их выборе в проектах здесь используется горизонтальный скролл.
            </p>

            <div
              class="ui-variants-modal__options"
              role="radiogroup"
              :aria-label="
                isConstructorWorkspace
                  ? 'Выбор варианта блока управления проектами'
                  : usesMultiProjectSelection
                    ? 'Выбор варианта отображения проектов при мультивыборе'
                    : 'Выбор варианта отображения карточек'
              "
            >
              <button
                v-for="option in modalOptions"
                :key="option.id"
                type="button"
                role="radio"
                class="ui-variants-option neo-select-pill neo-interactive neo-button"
                :class="{
                  'neo-select-pill--selected': displayedVariant === option.id,
                  'ui-variants-option--disabled': isOptionDisabled(option),
                }"
                :aria-checked="displayedVariant === option.id"
                :aria-disabled="isOptionDisabled(option)"
                :disabled="isOptionDisabled(option)"
                @click="pickVariant(option.id)"
              >
                <span class="neo-select-pill__bg" aria-hidden="true" />
                <span class="ui-variants-option__text neo-select-pill__content">
                  <span class="ui-variants-option__label neo-select-pill__title">{{ option.label }}</span>
                  <span v-if="optionDescription(option)" class="ui-variants-option__desc">
                    {{ optionDescription(option) }}
                  </span>
                </span>
                <span class="neo-select-pill__inset" aria-hidden="true" />
              </button>
            </div>
          </div>
          <span class="neo-shell-inner__inset" aria-hidden="true" />
        </div>
        <span class="neo-shell-outer__inset" aria-hidden="true" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ui-variants-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--overlay-backdrop);
  backdrop-filter: blur(2px);
}

.ui-variants-modal.neo-shell-outer {
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-4xl);
  flex-shrink: 0;
  box-shadow: var(--shadow-modal-outer);
}

.ui-variants-modal__outer-bg {
  background: var(--island-external);
}

.ui-variants-modal__inner {
  border-radius: var(--radius-3xl);
}

.ui-variants-modal__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px 24px;
}

.ui-variants-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ui-variants-modal__title {
  margin: 0;
  font: var(--text-xl-medium);
  color: var(--text-primary);
}

.ui-variants-modal__note {
  margin: 0;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.ui-variants-modal__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ui-variants-option {
  position: relative;
  display: flex;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.ui-variants-option--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.ui-variants-option__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ui-variants-option__label {
  font: var(--text-md-medium);
}

.ui-variants-option__desc {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}
</style>
