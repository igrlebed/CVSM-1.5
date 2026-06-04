<script setup lang="ts">
import {
  getEffectiveProjectSelectionVariant,
  isVariantAllowedForIndicators,
  projectWorkspaceCardsVariantOptions,
  type ProjectWorkspaceCardsVariant,
} from '~/mocks/uiVariants'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  uiVariantsOpen,
  closeUiVariantsModal,
  projectWorkspaceCardsVariant,
  isIndicatorsWorkspace,
} = useDashboardState()

const displayedVariant = computed(() =>
  getEffectiveProjectSelectionVariant(
    projectWorkspaceCardsVariant.value,
    isIndicatorsWorkspace.value,
  ),
)

function optionDescription(option: (typeof projectWorkspaceCardsVariantOptions)[number]) {
  if (isIndicatorsWorkspace.value && option.id === 'dropdown') {
    return 'Множественный выбор проектов в списке с чекбоксами'
  }
  if (isIndicatorsWorkspace.value && option.disabledForIndicators) {
    return 'Недоступно на экране показателей'
  }
  return option.description
}

function isOptionDisabled(option: (typeof projectWorkspaceCardsVariantOptions)[number]) {
  return isIndicatorsWorkspace.value && !!option.disabledForIndicators
}

function pickVariant(id: ProjectWorkspaceCardsVariant) {
  if (!isVariantAllowedForIndicators(id) && isIndicatorsWorkspace.value) {
    return
  }
  projectWorkspaceCardsVariant.value = id
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

            <p v-if="isIndicatorsWorkspace" class="ui-variants-modal__note">
              На экране показателей переключатель и комбо-вариант недоступны — при их выборе в
              проектах здесь используется горизонтальный скролл.
            </p>

            <div
              class="ui-variants-modal__options"
              role="radiogroup"
              :aria-label="
                isIndicatorsWorkspace
                  ? 'Выбор варианта отображения проектов на показателях'
                  : 'Выбор варианта отображения карточек'
              "
            >
              <button
                v-for="option in projectWorkspaceCardsVariantOptions"
                :key="option.id"
                type="button"
                role="radio"
                class="ui-variants-option neo-interactive neo-button"
                :class="{
                  'ui-variants-option--active': displayedVariant === option.id,
                  'ui-variants-option--disabled': isOptionDisabled(option),
                }"
                :aria-checked="displayedVariant === option.id"
                :aria-disabled="isOptionDisabled(option)"
                :disabled="isOptionDisabled(option)"
                @click="pickVariant(option.id)"
              >
                <span class="ui-variants-option__bg" aria-hidden="true" />
                <span class="ui-variants-option__text">
                  <span class="ui-variants-option__label">{{ option.label }}</span>
                  <span v-if="optionDescription(option)" class="ui-variants-option__desc">
                    {{ optionDescription(option) }}
                  </span>
                </span>
                <span class="ui-variants-option__inset neo-button-inset" aria-hidden="true" />
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
  background: rgb(13 23 76 / 40%);
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
  border-color: var(--border-primary);
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

.ui-variants-option--active {
  border-color: var(--accent-muted-100);
}

.ui-variants-option--active .ui-variants-option__bg {
  background: var(--accent-muted-300);
}

.ui-variants-option--active .ui-variants-option__inset {
  box-shadow: var(--shadow-inner-deep);
}

.ui-variants-option__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--background-primary);
  border-radius: inherit;
  pointer-events: none;
}

.ui-variants-option__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
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
  color: var(--text-primary);
}

.ui-variants-option__desc {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}
</style>
