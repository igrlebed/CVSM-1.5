<script setup lang="ts">
defineProps<{
  label: string
  iconSrc: string
}>()
</script>

<template>
  <button type="button" class="icon-button neo-interactive neo-button" :aria-label="label">
    <span class="icon-button__bg neo-surface__bg" aria-hidden="true" />
    <span class="icon-button__icon">
      <img :src="iconSrc" alt="" width="16" height="16" />
    </span>
    <span class="icon-button__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.icon-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 44px;
  height: 32px;
  padding: 8px;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.icon-button__bg {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: var(--island-external);
  pointer-events: none;
}

.icon-button__inset {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.icon-button__icon {
  position: relative;
  z-index: 1;
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

.icon-button__icon img {
  display: block;
  width: 16px;
  height: 16px;
}
</style>
