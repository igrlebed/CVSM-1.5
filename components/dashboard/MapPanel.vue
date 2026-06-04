<template>
  <div class="map-panel" role="region" aria-label="Карта сети ВСМ и СМ">
    <span class="map-panel__shell-bg" aria-hidden="true" />
    <div class="map-panel__map">
      <span class="map-panel__map-bg" aria-hidden="true" />
      <img src="/images/map.svg" alt="" class="map-panel__placeholder" width="64" height="64" />
      <DashboardMapLegend />
      <span class="map-panel__map-inset" aria-hidden="true" />
    </div>
    <span class="map-panel__shell-inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.map-panel {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 4px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-4xl);
  overflow: hidden;
  isolation: isolate;
  box-shadow: var(--shadow-outer-sidebar);
}

.map-panel__shell-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: var(--island-external);
  pointer-events: none;
}

.map-panel__shell-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inset-soft-sidebar);
}

.map-panel__map {
  position: relative;
  z-index: 1;
  flex: 1;
  min-height: 0;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-inner-raised);
}

.map-panel__map-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-inner);
  border-radius: inherit;
  pointer-events: none;
}

.map-panel__map-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inner-deep);
}

.map-panel__placeholder {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
