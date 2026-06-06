<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    /** header: 44×32, icon 16px; nav: 46×46, icon 20px (Figma button-icon) */
    size?: 'header' | 'nav'
    iconSrc?: string
    disabled?: boolean
    ariaPressed?: boolean
  }>(),
  {
    size: 'header',
    disabled: false,
  },
)
</script>

<template>
  <UiNeoButtonShell
    variant="default"
    class="icon-button"
    :class="`icon-button--${size}`"
    :disabled="disabled"
    :aria-label="label"
    :aria-pressed="ariaPressed"
  >
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
  </UiNeoButtonShell>
</template>

<style scoped>
.icon-button {
  flex-shrink: 0;
  justify-content: center;
}

.icon-button :deep(.neo-button-shell__content) {
  justify-content: center;
  align-items: center;
}

.icon-button--header {
  width: 44px;
  height: 32px;
  padding: var(--gap-xs);
  border-radius: 14px;
}

.icon-button--nav {
  width: 46px;
  height: 46px;
  padding: var(--gap-md);
  border-radius: var(--radius-xl);
}

.icon-button__icon {
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
</style>
