<script setup lang="ts">
export type PrimaryButtonSize = 'lg' | 'md'

withDefaults(
  defineProps<{
    label: string
    size?: PrimaryButtonSize
  }>(),
  {
    size: 'lg',
  },
)
</script>

<template>
  <button
    type="button"
    class="primary-button neo-interactive neo-accent-button"
    :class="`primary-button--${size}`"
  >
    <span class="primary-button__bg" aria-hidden="true" />
    <span class="primary-button__label">{{ label }}</span>
    <span class="primary-button__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.primary-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.primary-button--lg {
  padding: 12px 16px;
  min-height: 48px;
}

.primary-button--md {
  padding: 12px;
  min-height: 44px;
}

.primary-button__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: var(--island-external);
  pointer-events: none;
  transition: background-color var(--transition-fast);
}

.primary-button__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.primary-button__label {
  position: relative;
  z-index: 1;
  font: var(--text-md-medium);
  color: var(--accent-primary);
  text-align: center;
  transition: color var(--transition-fast);
}

.primary-button--md .primary-button__label {
  white-space: nowrap;
}

.primary-button--lg .primary-button__label {
  white-space: nowrap;
}
</style>
