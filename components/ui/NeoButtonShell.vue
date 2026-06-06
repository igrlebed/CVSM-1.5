<script setup lang="ts">
export type NeoButtonShellVariant = 'default' | 'accent' | 'sidebar'

const props = withDefaults(
  defineProps<{
    variant?: NeoButtonShellVariant
    disabled?: boolean
  }>(),
  {
    variant: 'default',
    disabled: false,
  },
)

const variantClass = computed(() => {
  if (props.variant === 'accent') return 'neo-accent-button'
  if (props.variant === 'sidebar') return 'neo-button neo-button--sidebar'
  return 'neo-button'
})
</script>

<template>
  <button
    type="button"
    class="neo-button-shell neo-interactive"
    :class="variantClass"
    :disabled="disabled"
  >
    <span class="neo-button-shell__bg" aria-hidden="true" />
    <span class="neo-button-shell__content">
      <slot />
    </span>
    <span class="neo-button-shell__inset neo-button-inset" aria-hidden="true" />
  </button>
</template>

<style scoped>
.neo-button-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  background: transparent;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: inherit;
}

.neo-button-shell__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: var(--island-external);
  pointer-events: none;
}

.neo-button-shell__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.neo-button-shell__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  width: 100%;
}

.neo-button-shell:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
