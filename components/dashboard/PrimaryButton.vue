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

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <UiNeoButtonShell
    variant="accent"
    class="primary-button"
    :class="`primary-button--${size}`"
    @click="emit('click')"
  >
    <span class="primary-button__label">{{ label }}</span>
  </UiNeoButtonShell>
</template>

<style scoped>
.primary-button {
  width: 100%;
  border-radius: var(--radius-2xl);
}

.primary-button--lg {
  padding: var(--gap-md) var(--gap-lg);
  min-height: 48px;
}

.primary-button--md {
  padding: var(--gap-md);
  min-height: 44px;
}

.primary-button__label {
  display: block;
  width: 100%;
  font: var(--text-md-medium);
  color: var(--accent-primary);
  text-align: center;
  white-space: nowrap;
  transition: color var(--transition-fast);
}
</style>
