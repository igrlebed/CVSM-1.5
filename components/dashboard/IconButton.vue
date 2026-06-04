<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    /** header: 44×32, icon 16px; nav: 46×46, icon 20px (Figma button-icon) */
    size?: 'header' | 'nav'
    iconSrc?: string
    disabled?: boolean
  }>(),
  {
    size: 'header',
    disabled: false,
  },
)
</script>

<template>
  <button
    type="button"
    class="icon-button neo-interactive neo-button"
    :class="`icon-button--${size}`"
    :aria-label="label"
    :disabled="disabled"
  >
    <span class="icon-button__bg" aria-hidden="true" />
    <span class="icon-button__icon">
      <slot>
        <img
          v-if="iconSrc"
          :src="iconSrc"
          alt=""
          :width="size === 'nav' ? 20 : 16"
          :height="size === 'nav' ? 20 : 16"
        />
      </slot>
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
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.icon-button--header {
  width: 44px;
  height: 32px;
  padding: 8px;
  border-radius: 14px;
}

.icon-button--nav {
  width: 46px;
  height: 46px;
  padding: 12px;
  border-radius: var(--radius-xl);
  border-color: var(--border-secondary);
}

.icon-button__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.icon-button__inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.icon-button__icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-button--header .icon-button__icon {
  width: 16px;
  height: 16px;
}

.icon-button--nav .icon-button__icon {
  width: 20px;
  height: 20px;
}

.icon-button--header .icon-button__icon img {
  display: block;
  width: 16px;
  height: 16px;
}

.icon-button--nav .icon-button__icon :deep(svg),
.icon-button--nav .icon-button__icon img {
  display: block;
  width: 20px;
  height: 20px;
}

.icon-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
