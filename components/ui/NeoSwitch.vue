<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {},
)

const hovered = ref(false)

function toggle() {
  model.value = !model.value
}
</script>

<template>
  <button
    type="button"
    class="neo-switch"
    :class="{ 'neo-switch--hover': hovered }"
    role="switch"
    :aria-checked="model"
    :aria-label="label"
    @click="toggle"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
  >
    <span class="neo-switch__track" aria-hidden="true">
      <span class="neo-switch__track-bg" />
      <span class="neo-switch__track-inset" />
    </span>
    <span class="neo-switch__thumb" aria-hidden="true">
      <span class="neo-switch__thumb-bg" />
      <span class="neo-switch__thumb-inset" />
    </span>
  </button>
</template>

<style scoped>
.neo-switch {
  position: relative;
  flex-shrink: 0;
  width: var(--switch-width);
  height: var(--switch-height);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s var(--switch-spring);
}

.neo-switch:active:not(:disabled) {
  transform: scale(0.96);
}

.neo-switch:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 999px;
}

.neo-switch__track {
  position: absolute;
  inset: 0;
  border: 1px solid var(--switch-track-off-border);
  border-radius: 999px;
  box-shadow: var(--shadow-switch-track-off-inset);
  overflow: hidden;
  transition:
    border-color var(--switch-duration) var(--switch-spring),
    box-shadow var(--switch-duration) var(--switch-spring);
}

.neo-switch[aria-checked='true'] .neo-switch__track {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-switch-track-on);
}

.neo-switch--hover:not([aria-checked='true']) .neo-switch__track {
  border-color: var(--switch-track-off-border-hover);
  box-shadow: var(--shadow-switch-track-off-inset-hover);
}

.neo-switch--hover[aria-checked='true'] .neo-switch__track {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-switch-track-on-hover);
}

.neo-switch__track-bg {
  position: absolute;
  inset: 0;
  background: var(--switch-track-off);
  border-radius: inherit;
  transition:
    background var(--switch-duration) var(--switch-spring),
    filter var(--switch-duration) ease;
}

.neo-switch[aria-checked='true'] .neo-switch__track-bg {
  background: var(--accent-primary);
  filter: none;
}

.neo-switch--hover:not([aria-checked='true']) .neo-switch__track-bg {
  background: var(--switch-track-off-hover);
}

.neo-switch--hover[aria-checked='true'] .neo-switch__track-bg {
  filter: brightness(1.12);
}

.neo-switch__track-inset {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: var(--shadow-inset-soft);
  pointer-events: none;
  transition: box-shadow var(--switch-duration) ease;
}

.neo-switch[aria-checked='true'] .neo-switch__track-inset {
  box-shadow: var(--shadow-switch-track-on-inset);
}

.neo-switch__thumb {
  position: absolute;
  top: var(--switch-thumb-offset);
  left: var(--switch-thumb-offset);
  width: var(--switch-thumb-size);
  height: var(--switch-thumb-size);
  border-radius: 999px;
  transform: scale(1);
  transition: transform var(--switch-duration) var(--switch-spring);
}

.neo-switch[aria-checked='true'] .neo-switch__thumb {
  transform: translateX(var(--switch-thumb-travel)) scale(1);
}

.neo-switch--hover:not([aria-checked='true']) .neo-switch__thumb {
  transform: scale(1.12);
}

.neo-switch--hover[aria-checked='true'] .neo-switch__thumb {
  transform: translateX(var(--switch-thumb-travel)) scale(1.12);
}

.neo-switch__thumb-bg {
  position: absolute;
  inset: 0;
  background: var(--background-primary);
  border-radius: inherit;
}

.neo-switch__thumb-inset {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: var(--shadow-switch-thumb);
  transition: box-shadow var(--switch-duration) var(--switch-spring);
}

.neo-switch--hover .neo-switch__thumb-inset {
  box-shadow: var(--shadow-switch-thumb-hover);
}

@media (prefers-reduced-motion: reduce) {
  .neo-switch,
  .neo-switch__track,
  .neo-switch__track-bg,
  .neo-switch__track-inset,
  .neo-switch__thumb,
  .neo-switch__thumb-inset {
    transition-duration: 0.01ms;
  }
}
</style>
