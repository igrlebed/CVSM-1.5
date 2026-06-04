<template>
  <div
    class="map-panel neo-shell-outer"
    role="region"
    aria-label="Карта сети ВСМ и СМ"
  >
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="map-panel__map neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content map-panel__content">
        <img
          src="/images/map.svg"
          alt=""
          class="map-panel__placeholder"
          width="64"
          height="64"
          decoding="async"
        />
        <DashboardMapLegend />
      </div>
      <span class="neo-shell-inner__inset" aria-hidden="true" />
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.map-panel {
  flex: 1;
  width: 100%;
  min-height: 0;
  border-radius: var(--radius-4xl);
}

.map-panel__map {
  border-radius: var(--radius-3xl);
}

.map-panel__content {
  position: relative;
  height: 100%;
  min-height: 0;
}

.map-panel__placeholder {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
