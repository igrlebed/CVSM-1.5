<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const props = withDefaults(
  defineProps<{
    project: DashboardProject
    selected: boolean
    readonly?: boolean
    compact?: boolean
  }>(),
  {
    readonly: false,
    compact: false,
  },
)

const { toggleIndicatorProject } = useDashboardState()

const rootTag = computed(() => (props.readonly ? 'article' : 'button'))

function toggle(event: MouseEvent) {
  if (props.readonly) {
    return
  }
  toggleIndicatorProject(props.project.id)
  ;(event.currentTarget as HTMLButtonElement).blur()
}
</script>

<template>
  <component
    :is="rootTag"
    :type="readonly ? undefined : 'button'"
    class="constructor-project-card"
    :class="{
      'constructor-project-card--selected': selected,
      'constructor-project-card--readonly': readonly,
      'constructor-project-card--compact': compact,
      'neo-interactive': !readonly,
    }"
    :aria-pressed="readonly ? undefined : selected"
    @click="toggle"
  >
    <span class="constructor-project-card__bg" aria-hidden="true" />
    <DashboardProjectMultiSelectCheck
      v-if="!readonly"
      class="constructor-project-card__check"
      :checked="selected"
    />
    <span
      class="constructor-project-card__text"
      :class="{ 'constructor-project-card__text--stacked': project.international }"
    >
      <span class="constructor-project-card__title">{{ project.title }}</span>
      <span
        v-if="project.international"
        class="constructor-project-card__subtitle"
      >Международный</span>
    </span>
    <DashboardProjectBadge :type="project.type" size="compact" />
    <span class="constructor-project-card__inset" aria-hidden="true" />
  </component>
</template>

<style scoped>
.constructor-project-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  width: 100%;
  min-height: var(--constructor-project-card-min-height);
  padding: var(--gap-md) var(--gap-xl);
  margin: 0;
  border-radius: var(--radius-3xl);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  background: transparent;
  isolation: isolate;
  appearance: none;
  outline: none;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.constructor-project-card:not(.constructor-project-card--readonly) {
  border: var(--border-width) solid var(--border-stroke);
  box-shadow: var(--shadow-outer);
}

.constructor-project-card.neo-interactive:active:not(:disabled) {
  transform: none;
}

.constructor-project-card--readonly {
  cursor: default;
  border: var(--border-width) solid var(--border-stroke);
  box-shadow: var(--shadow-outer);
}

.constructor-project-card--compact {
  min-height: var(--constructor-project-card-min-height-compact);
  gap: var(--gap-xs);
  padding: var(--gap-sm) var(--gap-lg);
  border-radius: var(--radius-2xl);
}

.constructor-project-card--selected:not(.constructor-project-card--readonly) {
  border-color: var(--border-active);
  box-shadow: none;
}

.constructor-project-card--selected .constructor-project-card__inset {
  box-shadow: var(--shadow-select-pressed);
}

.constructor-project-card.neo-interactive:hover:not(:disabled):not(.constructor-project-card--readonly):not(.constructor-project-card--selected),
.constructor-project-card.neo-interactive:active:not(:disabled):not(.constructor-project-card--readonly):not(.constructor-project-card--selected) {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-outer-hover);
  transform: none;
}

.constructor-project-card.neo-interactive:focus:not(:disabled):not(.constructor-project-card--readonly),
.constructor-project-card.neo-interactive:focus-visible:not(:disabled):not(.constructor-project-card--readonly) {
  border-color: var(--border-hover);
}

.constructor-project-card--selected.neo-interactive:hover:not(:disabled),
.constructor-project-card--selected.neo-interactive:active:not(:disabled),
.constructor-project-card--selected.neo-interactive:focus:not(:disabled),
.constructor-project-card--selected.neo-interactive:focus-visible:not(:disabled) {
  border-color: var(--border-active);
  box-shadow: none;
}

.constructor-project-card--selected.neo-interactive:hover:not(:disabled) .constructor-project-card__inset,
.constructor-project-card--selected.neo-interactive:active:not(:disabled) .constructor-project-card__inset {
  box-shadow: var(--shadow-select-pressed);
}

.constructor-project-card__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--select-pill-surface);
  border-radius: inherit;
  pointer-events: none;
  transition: background-color var(--transition-fast);
}

.constructor-project-card__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: box-shadow var(--transition-fast);
}

.constructor-project-card__check {
  position: relative;
  z-index: 1;
}

.constructor-project-card__text {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.constructor-project-card__text--stacked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.constructor-project-card__title {
  display: block;
  font: var(--text-md-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.constructor-project-card--compact .constructor-project-card__title {
  font: var(--text-sm-medium);
}

.constructor-project-card__text--stacked .constructor-project-card__title {
  white-space: normal;
}

.constructor-project-card__subtitle {
  font: var(--text-xs-regular);
  color: var(--text-secondary);
}

.constructor-project-card :deep(.project-badge) {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
</style>
