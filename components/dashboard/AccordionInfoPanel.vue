<script setup lang="ts">
import type { SidebarInfoSection } from '~/mocks/dashboard'

defineProps<{
  section: SidebarInfoSection
}>()
</script>

<template>
  <div class="accordion-info-panel">
    <p class="accordion-info-panel__text">{{ section.description }}</p>
    <DashboardPrimaryButton :label="section.buttonLabel" size="md" />
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
</style>
