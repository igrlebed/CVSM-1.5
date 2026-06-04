<script setup lang="ts">
import type { ProjectDetailTabId } from '~/mocks/dashboard'

type TabItem = { id: ProjectDetailTabId; label: string }

const props = defineProps<{
  tabs: readonly TabItem[]
  modelValue: ProjectDetailTabId
}>()

const emit = defineEmits<{
  'update:modelValue': [id: ProjectDetailTabId]
}>()

/** Длинные подписи — ширина по контенту (Figma: shrink-0) */
const contentWidthTabIds: ProjectDetailTabId[] = ['socio', 'technical']

function isGrowTab(index: number) {
  const id = props.tabs[index]?.id
  return id != null && !contentWidthTabIds.includes(id)
}
</script>

<template>
  <div class="project-tab-bar" role="tablist" aria-label="Разделы проекта">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="project-tab-bar__item neo-interactive neo-button"
      :class="{
        'project-tab-bar__item--active': modelValue === tab.id,
        'project-tab-bar__item--grow': isGrowTab(index),
      }"
      :aria-selected="modelValue === tab.id"
      @click="emit('update:modelValue', tab.id)"
    >
      <span class="project-tab-bar__item-bg" aria-hidden="true" />
      <span class="project-tab-bar__item-label">{{ tab.label }}</span>
      <span class="project-tab-bar__item-inset neo-button-inset" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
/* Трек + отдельные «чипы»: кликабельность как у кнопок, мягче чем Figma TabBar item outer */
.project-tab-bar {
  display: flex;
  gap: 6px;
  width: 100%;
  padding: 6px;
  flex-shrink: 0;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-3xl);
  background: var(--island-external);
  box-shadow: var(--shadow-inset-soft);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.project-tab-bar__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: var(--radius-2xl);
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-tab-bar-chip);
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  white-space: nowrap;
}

.project-tab-bar__item:not(.project-tab-bar__item--grow) {
  flex: 0 0 auto;
  width: max-content;
}

.project-tab-bar__item--grow {
  flex: 1 1 0;
  min-width: 0;
}

.project-tab-bar__item--grow .project-tab-bar__item-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-tab-bar__item-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--background-primary);
  border-radius: inherit;
  pointer-events: none;
  transition: background-color var(--transition-fast);
}

.project-tab-bar__item-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-tab-bar__item:not(.project-tab-bar__item--active) .project-tab-bar__item-inset {
  box-shadow: none;
}

.project-tab-bar__item:not(.project-tab-bar__item--active).neo-interactive:hover:not(:disabled).neo-button {
  border-color: var(--accent-muted-100);
  box-shadow: var(--shadow-tab-bar-chip-hover);
  transform: none;
}

.project-tab-bar__item:not(.project-tab-bar__item--active).neo-interactive:hover:not(:disabled)
  .project-tab-bar__item-bg {
  background: var(--island-inner);
}

.project-tab-bar__item--active {
  border-color: var(--accent-muted-100);
  box-shadow: var(--shadow-inset-soft);
  transform: none;
}

.project-tab-bar__item--active .project-tab-bar__item-bg {
  background: var(--accent-muted-300);
}

.project-tab-bar__item--active .project-tab-bar__item-inset {
  box-shadow: var(--shadow-inset-soft);
}

.project-tab-bar__item--active.neo-interactive:hover:not(:disabled).neo-button,
.project-tab-bar__item--active.neo-interactive:active:not(:disabled).neo-button {
  border-color: var(--accent-muted-100);
  box-shadow: var(--shadow-inset-soft);
  transform: none;
}

.project-tab-bar__item--active.neo-interactive:hover:not(:disabled) .project-tab-bar__item-bg,
.project-tab-bar__item--active.neo-interactive:active:not(:disabled) .project-tab-bar__item-bg {
  background: var(--accent-muted-300);
}

.project-tab-bar__item--active.neo-interactive:hover:not(:disabled) .project-tab-bar__item-inset,
.project-tab-bar__item--active.neo-interactive:active:not(:disabled) .project-tab-bar__item-inset {
  box-shadow: var(--shadow-inset-soft);
}

.project-tab-bar__item-label {
  position: relative;
  z-index: 1;
  font: 500 14px/16px var(--font-family);
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.project-tab-bar__item--active .project-tab-bar__item-label {
  color: var(--text-primary);
}
</style>
