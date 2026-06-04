<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'

defineProps<{
  project: DashboardProject
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <button
    type="button"
    class="project-card neo-interactive neo-button"
    :class="{ 'project-card--selected': selected }"
    :aria-pressed="selected"
    @click="emit('select', project.id)"
  >
    <span class="project-card__bg" aria-hidden="true" />
    <div class="project-card__top">
      <DashboardProjectBadge :type="project.type" />
      <DashboardFingerprintIcon />
    </div>
    <div class="project-card__headline">
      <span class="project-card__title">{{ project.title }}</span>
      <span v-if="project.international" class="project-card__tag">Международный</span>
    </div>
    <span class="project-card__inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: max-content;
  min-width: 218px;
  height: 108px;
  padding: 16px 20px;
  border-radius: var(--radius-3xl);
  border-color: var(--border-primary);
  box-shadow: var(--shadow-outer);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.project-card:not(.project-card--selected) .project-card__inset {
  box-shadow: var(--shadow-inset-soft);
}

.project-card--selected {
  box-shadow: var(--shadow-inset-soft);
  transform: none;
}

.project-card--selected .project-card__inset {
  box-shadow: var(--shadow-project-card-pressed);
}

.project-card--selected.neo-interactive:hover:not(:disabled).neo-button,
.project-card--selected.neo-interactive:active:not(:disabled).neo-button {
  border-color: var(--border-primary);
  box-shadow: var(--shadow-inset-soft);
  transform: none;
}

.project-card--selected.neo-interactive:hover:not(:disabled) .project-card__bg,
.project-card--selected.neo-interactive:active:not(:disabled) .project-card__bg {
  background: var(--island-external);
}

.project-card--selected.neo-interactive:hover:not(:disabled) .project-card__inset,
.project-card--selected.neo-interactive:active:not(:disabled) .project-card__inset {
  box-shadow: var(--shadow-project-card-pressed);
}

.project-card__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-card__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-card__top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  gap: 12px;
}

.project-card__headline {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  width: max-content;
}

.project-card__title {
  font: var(--text-md-medium);
  color: var(--text-secondary);
  white-space: nowrap;
}

.project-card--selected .project-card__title {
  color: var(--text-primary);
}

.project-card__tag {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
