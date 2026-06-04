<script setup lang="ts">
import type { KpiItem } from '~/mocks/dashboard'

const props = defineProps<{
  item: KpiItem
  loading?: boolean
}>()

const labelText = computed(() => {
  const parts = [props.item.label, ...(props.item.labelLines ?? [])]
  return parts.join(' ')
})
</script>

<template>
  <article class="kpi-card">
    <span class="kpi-card__shell-bg" aria-hidden="true" />
    <div class="kpi-card__body">
      <span class="kpi-card__body-bg" aria-hidden="true" />
      <span class="kpi-card__body-inset" aria-hidden="true" />
      <div v-if="loading" class="kpi-card__skeleton skeleton-pulse" aria-hidden="true" />
      <div v-else class="kpi-card__content">
        <div class="kpi-card__value-row">
          <span class="kpi-card__value">{{ item.value }}</span>
          <span v-if="item.suffix" class="kpi-card__suffix">{{ item.suffix }}</span>
        </div>
        <p class="kpi-card__label" :title="labelText">{{ labelText }}</p>
      </div>
    </div>
    <span class="kpi-card__shell-inset" aria-hidden="true" />
  </article>
</template>

<style scoped>
.kpi-card {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  height: 116px;
  padding: 4px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-4xl);
  overflow: hidden;
  box-shadow: var(--shadow-outer);
}

.kpi-card__shell-bg {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-4xl);
  background: var(--island-external);
  pointer-events: none;
}

.kpi-card__shell-inset {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inset-soft);
}

.kpi-card__body {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  isolation: isolate;
  padding: 16px;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-inner-raised);
}

.kpi-card__body-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--radius-3xl);
  background: var(--island-inner);
  pointer-events: none;
}

.kpi-card__body-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inner-deep);
}

.kpi-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 0;
}

.kpi-card__skeleton {
  position: relative;
  z-index: 1;
  flex: 1;
  border-radius: var(--radius-md);
  min-height: 48px;
}

.kpi-card__value-row {
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  gap: 8px;
}

.kpi-card__value {
  font: var(--text-2xl-medium);
  color: var(--text-primary);
}

.kpi-card__suffix {
  padding-bottom: 3px;
  font: var(--text-xl-medium);
  color: var(--text-primary);
}

.kpi-card__label {
  flex-shrink: 0;
  margin: 0;
  max-height: 32px;
  font: var(--text-xs-regular);
  line-height: 16px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
}
</style>
