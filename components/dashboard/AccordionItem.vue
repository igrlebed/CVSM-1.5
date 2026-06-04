<script setup lang="ts">
import type { SidebarSectionType } from '~/mocks/dashboard'

defineProps<{
  title: string
  open: boolean
  type: SidebarSectionType
}>()

const emit = defineEmits<{
  toggle: []
}>()

const panelId = useId()
</script>

<template>
  <section
    class="accordion-item"
    :class="[
      open ? 'accordion-item--open' : 'accordion-item--collapsed',
      `accordion-item--${type}`,
    ]"
  >
    <span class="accordion-item__bg" aria-hidden="true" />
    <button
      type="button"
      class="accordion-item__headline neo-interactive neo-interactive--headline"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('toggle')"
    >
      <span class="accordion-item__title">{{ title }}</span>
      <DashboardAccordionChevron :up="open" />
    </button>
    <div
      :id="panelId"
      class="accordion-item__panel"
      :class="{ 'accordion-item__panel--open': open }"
      :aria-hidden="!open"
    >
      <div
        class="accordion-item__body"
        :class="{ 'accordion-item__body--projects': type === 'projects' }"
      >
        <slot />
      </div>
    </div>
    <span class="accordion-item__inset" aria-hidden="true" />
  </section>
</template>

<style scoped>
.accordion-item {
  position: relative;
  width: 100%;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  isolation: isolate;
  flex-shrink: 0;
}

.accordion-item__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.accordion-item--collapsed .accordion-item__bg {
  background: var(--island-external);
}

.accordion-item--open .accordion-item__bg {
  background: var(--background-primary);
}

.accordion-item--collapsed {
  box-shadow: var(--shadow-outer);
}

.accordion-item--open {
  box-shadow: var(--shadow-inner-raised);
}

.accordion-item--open.accordion-item--info {
  box-shadow:
    -2px 2px 4px 0 rgba(245, 245, 245, 0.2),
    2px -2px 4px 0 rgba(245, 245, 245, 0.2),
    -2px -2px 4px 0 rgba(255, 255, 255, 0.9),
    2px 2px 5px 0 rgba(245, 245, 245, 0.9);
}

.accordion-item__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.accordion-item--collapsed .accordion-item__inset {
  box-shadow: var(--shadow-inset-soft);
}

.accordion-item--open.accordion-item--projects .accordion-item__inset {
  box-shadow:
    inset -2px 2px 4px 0 rgba(245, 245, 245, 0.2),
    inset 2px -2px 4px 0 rgba(245, 245, 245, 0.2),
    inset -2px -2px 4px 0 rgba(255, 255, 255, 0.9),
    inset 2px 2px 5px 0 rgba(245, 245, 245, 0.9);
}

.accordion-item--open.accordion-item--indicators .accordion-item__inset,
.accordion-item--open.accordion-item--info .accordion-item__inset {
  box-shadow: var(--shadow-inset-soft);
}

.accordion-item__headline {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: transparent;
  font: var(--text-md-medium);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: padding var(--transition-base);
}

.accordion-item--open .accordion-item__headline {
  padding: 16px 20px;
}

.accordion-item__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.accordion-item__panel {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--transition-base);
}

.accordion-item__panel--open {
  grid-template-rows: 1fr;
}

@media (prefers-reduced-motion: reduce) {
  .accordion-item__panel {
    transition: none;
  }

  .accordion-item__body {
    transition: none;
  }
}

.accordion-item__body {
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 8px 0;
  opacity: 0;
  transition:
    opacity var(--transition-fast),
    padding var(--transition-base);
}

.accordion-item__panel--open .accordion-item__body {
  padding: 0 8px 12px;
  opacity: 1;
}

.accordion-item--indicators .accordion-item__body,
.accordion-item--info .accordion-item__body {
  gap: 16px;
  padding: 0 16px 0;
  align-items: center;
}

.accordion-item--indicators .accordion-item__panel--open .accordion-item__body,
.accordion-item--info .accordion-item__panel--open .accordion-item__body {
  padding: 0 16px 24px;
}

.accordion-item--projects.accordion-item--open {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* grid 1fr + min-height:0 схлопывает контент — для проектов flex-колонка */
.accordion-item--projects.accordion-item--open .accordion-item__panel {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  grid-template-rows: unset;
  transition: none;
}

.accordion-item--projects.accordion-item--open .accordion-item__body--projects {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  gap: 0;
}
</style>
