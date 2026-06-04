<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const props = defineProps<{
  project: DashboardProject
}>()

const { openProject } = useDashboardState()
</script>

<template>
  <button
    type="button"
    class="project-list-button neo-interactive neo-button"
    @click="openProject(project.id)"
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
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
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
  z-index: 2;
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
