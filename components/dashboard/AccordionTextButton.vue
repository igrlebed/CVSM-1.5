<script setup lang="ts">
defineProps<{
  label: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="accordion-text-button neo-interactive neo-button"
    @click="emit('click')"
  >
    <span class="accordion-text-button__bg" aria-hidden="true" />
    <span class="accordion-text-button__label">{{ label }}</span>
    <span class="accordion-text-button__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.accordion-text-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.accordion-text-button__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.accordion-text-button__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.accordion-text-button__label {
  position: relative;
  z-index: 1;
  font: var(--text-md-regular);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
