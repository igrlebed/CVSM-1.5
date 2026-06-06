<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const props = defineProps<{
  project: DashboardProject
}>()

const { openProject } = useDashboardState()
</script>

<template>
  <UiNeoButtonShell
    variant="sidebar"
    class="project-list-button"
    @click="openProject(project.id)"
  >
    <DashboardProjectBadge :type="project.type" />
    <span class="project-list-button__title">{{ project.title }}</span>
    <span v-if="project.international" class="project-list-button__tag">Международный</span>
  </UiNeoButtonShell>
</template>

<style scoped>
.project-list-button {
  gap: var(--gap-md);
  width: 100%;
  height: 44px;
  min-height: 44px;
  padding: 0 var(--gap-md);
  border-radius: var(--radius-lg);
  text-align: left;
}

.project-list-button :deep(.neo-button-shell__content) {
  gap: var(--gap-md);
  justify-content: flex-start;
}

.project-list-button :deep(.project-badge) {
  flex: 0 0 auto;
}

.project-list-button__title {
  flex: 1;
  min-width: 0;
  font: var(--text-md-regular);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-list-button__tag {
  flex-shrink: 0;
  font: var(--text-xs-regular);
  color: var(--text-secondary);
}
</style>
