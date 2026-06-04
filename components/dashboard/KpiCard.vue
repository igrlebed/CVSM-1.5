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
  <article class="kpi-card neo-shell-outer">
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="kpi-card__body neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content kpi-card__content">
        <div v-if="loading" class="kpi-card__skeleton skeleton-pulse" aria-hidden="true" />
        <template v-else>
          <div class="kpi-card__value-row">
            <span class="kpi-card__value">{{ item.value }}</span>
            <span v-if="item.suffix" class="kpi-card__suffix">{{ item.suffix }}</span>
          </div>
          <p class="kpi-card__label" :title="labelText">{{ labelText }}</p>
        </template>
      </div>
      <span class="neo-shell-inner__inset" aria-hidden="true" />
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </article>
</template>

<style scoped>
.kpi-card {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  height: 116px;
  border-radius: var(--radius-4xl);
}

.kpi-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  border-radius: var(--radius-3xl);
}

.kpi-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 0;
  padding: 16px;
}

.kpi-card__skeleton {
  flex: 1;
  margin: 16px;
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
