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
    class="project-card neo-select-pill neo-interactive neo-button"
    :class="{ 'neo-select-pill--selected': selected }"
    :aria-pressed="selected"
    @click="emit('select', project.id)"
  >
    <span class="neo-select-pill__bg" aria-hidden="true" />
    <div class="project-card__top neo-select-pill__content">
      <DashboardProjectBadge :type="project.type" />
      <DashboardFingerprintIcon />
    </div>
    <div class="project-card__headline neo-select-pill__content">
      <span class="project-card__title neo-select-pill__title">{{ project.title }}</span>
      <span v-if="project.international" class="project-card__tag">Международный</span>
    </div>
    <span class="neo-select-pill__inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.project-card {
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
  cursor: pointer;
  text-align: left;
}

.project-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  gap: 12px;
}

.project-card__headline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  width: max-content;
}

.project-card__title {
  font: var(--text-md-medium);
  white-space: nowrap;
}

.project-card__tag {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
