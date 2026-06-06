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
      class="accordion-item__panel neo-collapse"
      :class="{ 'accordion-item__panel--open': open, 'neo-collapse--open': open }"
      :aria-hidden="!open"
    >
      <div class="accordion-item__panel-inner neo-collapse__body">
        <div class="accordion-item__body">
          <slot />
        </div>
      </div>
    </div>
    <span class="accordion-item__inset" aria-hidden="true" />
  </section>
</template>

<style scoped>
.accordion-item {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border: var(--border-width) solid var(--border-stroke);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  isolation: isolate;
  flex-shrink: 0;
  box-sizing: border-box;
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
  box-shadow: var(--shadow-outer-sidebar);
}

.accordion-item--open {
  box-shadow: var(--shadow-inner-raised);
}

.accordion-item--open.accordion-item--info {
  box-shadow: var(--shadow-accordion-info-outer);
}

.accordion-item__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.accordion-item--collapsed .accordion-item__inset {
  box-shadow: var(--shadow-inset-soft-sidebar);
}

.accordion-item--open .accordion-item__inset {
  box-shadow: var(--shadow-accordion-open-inset);
}

.accordion-item__headline {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  width: 100%;
  padding: var(--gap-md) var(--gap-2xl);
  border: none;
  background: transparent;
  font: var(--text-md-medium);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  border-radius: inherit;
  transition: padding var(--transition-base);
}

.accordion-item--open .accordion-item__headline {
  padding: var(--gap-lg) var(--gap-2xl);
  border-radius: calc(var(--radius-3xl) - 1px) calc(var(--radius-3xl) - 1px) 0 0;
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
  min-height: 0;
}

.accordion-item__body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0;
  gap: 0;
}

.accordion-item__panel--open .accordion-item__body {
  padding-top: var(--gap-sm);
}

.accordion-item--projects.accordion-item--open {
  flex: 1 1 0;
  min-height: 0;
}

.accordion-item--projects.accordion-item--open .accordion-item__panel {
  flex: 1 1 0;
  min-height: 0;
}

.accordion-item--projects.accordion-item--open .accordion-item__panel-inner {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.accordion-item--projects.accordion-item--open .accordion-item__body {
  flex: 1 1 0;
  min-height: 0;
}
</style>
