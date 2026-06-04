<script setup lang="ts">
import type { SidebarInfoSection } from '~/mocks/dashboard'

defineProps<{
  section: SidebarInfoSection
}>()
</script>

<template>
  <div class="accordion-info-panel">
    <p class="accordion-info-panel__text">{{ section.description }}</p>
    <button type="button" class="accordion-info-panel__cta neo-interactive neo-accent-button">
      <span class="accordion-info-panel__cta-bg" aria-hidden="true" />
      <span class="accordion-info-panel__cta-label">{{ section.buttonLabel }}</span>
      <span class="accordion-info-panel__cta-inset neo-button-inset" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.accordion-info-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
}

.accordion-info-panel__text {
  margin: 0;
  font: var(--text-md-regular);
  line-height: 20px;
  color: var(--text-secondary);
  text-align: center;
}

.accordion-info-panel__cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.accordion-info-panel__cta-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.accordion-info-panel__cta-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.accordion-info-panel__cta-label {
  position: relative;
  z-index: 1;
  font: var(--text-md-medium);
  color: var(--accent-primary);
  white-space: nowrap;
}
</style>
