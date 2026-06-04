<script setup lang="ts">
import { mapLegendImplementation, mapLegendRows } from '~/mocks/dashboard'
</script>

<template>
  <div class="map-legend neo-shell-outer">
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="map-legend__body neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content map-legend__content">
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
      <span class="neo-shell-inner__inset" aria-hidden="true" />
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.map-legend {
  position: absolute;
  left: 19px;
  bottom: 19px;
  z-index: 2;
  border-radius: var(--radius-2xl);
}

.map-legend__body {
  border-radius: var(--radius-xl);
}

.map-legend__content {
  --legend-swatch-size: 16px;
  --legend-row-gap: 8px;
  --legend-label-indent: calc(var(--legend-swatch-size) + var(--legend-row-gap));
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
  padding-left: var(--legend-label-indent);
  font: var(--text-sm-regular);
  line-height: 16px;
  color: var(--text-secondary);
  text-align: left;
}
</style>
