<script setup lang="ts">
import type { ProjectType } from '~/mocks/dashboard'

const props = defineProps<{
  type: ProjectType
}>()

const label = computed(() => {
  if (props.type === 'sm') return 'СМ'
  return 'ВСМ'
})

const colorVar = computed(() => {
  switch (props.type) {
    case 'vsm-minsk':
      return 'var(--project-vsm-minsk)'
    case 'sm':
      return 'var(--project-sm)'
    default:
      return 'var(--project-vsm)'
  }
})
</script>

<template>
  <span
    class="project-badge"
    :class="{ 'project-badge--sm': type === 'sm' }"
    :style="{ background: colorVar }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.project-badge {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 6px;
  border-radius: var(--radius-sm);
  font: var(--text-xs-bold);
  line-height: 12px;
  color: var(--text-invert);
  white-space: nowrap;
}

.project-badge--sm {
  width: 40px;
  min-width: 40px;
  max-width: 40px;
}
</style>
