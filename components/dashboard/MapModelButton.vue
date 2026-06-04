<template>
  <button type="button" class="map-model-button neo-interactive neo-accent-button">
    <span class="map-model-button__bg" aria-hidden="true" />
    <span class="map-model-button__label">Модель развития сети СМ и ВСМ</span>
    <span class="map-model-button__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.map-model-button {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.map-model-button__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.map-model-button__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.map-model-button__label {
  position: relative;
  z-index: 1;
  font: var(--text-md-medium);
  color: var(--accent-primary);
  white-space: nowrap;
}
</style>
