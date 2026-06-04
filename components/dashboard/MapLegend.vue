<script setup lang="ts">
import { mapLegendImplementation, mapLegendRows } from '~/mocks/dashboard'
</script>

<template>
  <div class="map-legend">
    <span class="map-legend__shell-bg" aria-hidden="true" />
    <div class="map-legend__body">
      <span class="map-legend__body-bg" aria-hidden="true" />
      <div class="map-legend__content">
        <div v-for="item in mapLegendRows" :key="item.label" class="map-legend__row">
          <span class="map-legend__swatch" :style="{ background: item.color }" />
          <span class="map-legend__label">{{ item.label }}</span>
        </div>
        <div class="map-legend__group-block">
          <p class="map-legend__group">{{ mapLegendImplementation.group }}</p>
          <div class="map-legend__row">
            <span
              class="map-legend__swatch"
              :style="{ background: mapLegendImplementation.item.color }"
            />
            <span class="map-legend__label">{{ mapLegendImplementation.item.label }}</span>
          </div>
        </div>
      </div>
      <span class="map-legend__body-inset" aria-hidden="true" />
    </div>
    <span class="map-legend__shell-inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.map-legend {
  position: absolute;
  left: 19px;
  bottom: 19px;
  z-index: 2;
  padding: 4px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  isolation: isolate;
  box-shadow: var(--shadow-outer-sidebar);
}

.map-legend__shell-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: var(--island-external);
  pointer-events: none;
}

.map-legend__shell-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inset-soft-sidebar);
}

.map-legend__body {
  position: relative;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-inner-raised);
}

.map-legend__body-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: var(--island-inner);
  pointer-events: none;
}

.map-legend__body-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inner-deep);
}

.map-legend__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
}

.map-legend__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-legend__swatch {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.map-legend__label {
  font: var(--text-md-regular);
  color: var(--text-primary);
  white-space: nowrap;
}

.map-legend__group-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.map-legend__group {
  margin: 0;
  font: var(--text-sm-regular);
  line-height: 16px;
  color: var(--text-secondary);
  text-align: left;
}
</style>
