<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const props = defineProps<{
  project: DashboardProject
}>()

const { selectedProjectId, selectProject } = useDashboardState()

const isSelected = computed(() => selectedProjectId.value === props.project.id)
</script>

<template>
  <button
    type="button"
    class="project-list-button neo-interactive neo-button"
    :class="{ 'project-list-button--selected': isSelected }"
    :aria-pressed="isSelected"
    @click="selectProject(project.id)"
  >
    <span class="project-list-button__bg" aria-hidden="true" />
    <DashboardProjectBadge :type="project.type" />
    <span class="project-list-button__title">{{ project.title }}</span>
    <span v-if="project.international" class="project-list-button__tag">Международный</span>
    <span class="project-list-button__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.project-list-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.project-list-button--selected,
.project-list-button--selected:hover:not(:disabled) {
  border-color: var(--accent-muted);
}

.project-list-button--selected .project-list-button__title {
  color: var(--accent-primary);
  font-weight: 500;
}

.project-list-button__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-list-button__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-list-button :deep(.project-badge) {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
}

.project-list-button__title {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  font: var(--text-md-regular);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-list-button__tag {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  font: var(--text-xs-regular);
  color: var(--text-secondary);
}
</style>
