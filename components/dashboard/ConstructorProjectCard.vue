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

function toggle() {
  if (props.readonly) {
    return
  }
  toggleIndicatorProject(props.project.id)
}
</script>

<template>
  <component
    :is="rootTag"
    :type="readonly ? undefined : 'button'"
    class="constructor-project-card"
    :class="{
      'constructor-project-card--readonly': readonly,
      'constructor-project-card--compact': compact,
      'neo-select-pill': true,
      'neo-select-pill--selected': selected,
      'neo-interactive': !readonly,
    }"
    :aria-pressed="readonly ? undefined : selected"
    @click="toggle"
  >
    <span class="neo-select-pill__bg" aria-hidden="true" />
    <DashboardProjectMultiSelectCheck
      v-if="!readonly"
      class="constructor-project-card__check"
      :checked="selected"
    />
    <span
      class="constructor-project-card__text neo-select-pill__content"
      :class="{ 'constructor-project-card__text--stacked': project.international }"
    >
      <span class="constructor-project-card__title neo-select-pill__title">{{ project.title }}</span>
      <span
        v-if="project.international"
        class="constructor-project-card__subtitle"
      >Международный</span>
    </span>
    <DashboardProjectBadge :type="project.type" size="compact" />
    <span class="neo-select-pill__inset" aria-hidden="true" />
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
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  background: transparent;
  isolation: isolate;
}

.constructor-project-card:not(.constructor-project-card--readonly).neo-select-pill {
  box-shadow: none;
}

.constructor-project-card.neo-select-pill--selected:not(.constructor-project-card--readonly) {
  border-color: var(--border-active);
  box-shadow: none;
}

.constructor-project-card.neo-interactive:hover:not(:disabled):not(.constructor-project-card--readonly),
.constructor-project-card.neo-interactive:active:not(:disabled):not(.constructor-project-card--readonly) {
  border-color: var(--border-hover);
  box-shadow: none;
  transform: none;
}

.constructor-project-card.neo-interactive:hover:not(:disabled):not(.neo-select-pill--selected)
  .neo-select-pill__bg,
.constructor-project-card.neo-interactive:active:not(:disabled):not(.neo-select-pill--selected)
  .neo-select-pill__bg {
  background: var(--island-inner);
}

.constructor-project-card.neo-select-pill--selected.neo-interactive:hover:not(:disabled) .neo-select-pill__bg,
.constructor-project-card.neo-select-pill--selected.neo-interactive:active:not(:disabled) .neo-select-pill__bg {
  background: var(--select-pill-surface);
}

.constructor-project-card.neo-interactive:hover:not(:disabled) .neo-select-pill__inset,
.constructor-project-card.neo-interactive:active:not(:disabled) .neo-select-pill__inset {
  box-shadow: var(--shadow-select-pressed);
}

.constructor-project-card:not(.neo-select-pill--selected).neo-interactive:hover:not(:disabled) .neo-select-pill__inset,
.constructor-project-card:not(.neo-select-pill--selected).neo-interactive:active:not(:disabled) .neo-select-pill__inset {
  box-shadow: none;
}

.constructor-project-card.neo-select-pill--selected.neo-interactive:hover:not(:disabled),
.constructor-project-card.neo-select-pill--selected.neo-interactive:active:not(:disabled) {
  border-color: var(--border-active);
  box-shadow: none;
}

.constructor-project-card--readonly {
  cursor: default;
  pointer-events: none;
  box-shadow: var(--shadow-outer);
}

.constructor-project-card--compact {
  min-height: var(--constructor-project-card-min-height-compact);
  gap: var(--gap-xs);
  padding: var(--gap-sm) var(--gap-lg);
  border-radius: var(--radius-2xl);
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
