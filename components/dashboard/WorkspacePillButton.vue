<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    tone?: 'accent' | 'muted'
  }>(),
  {
    tone: 'accent',
  },
)
</script>

<template>
  <UiNeoButtonShell
    class="workspace-pill-btn neo-button"
    :class="{ 'workspace-pill-btn--muted': tone === 'muted' }"
  >
    <slot />
    <span class="workspace-pill-btn__label">{{ label }}</span>
  </UiNeoButtonShell>
</template>

<style scoped>
.workspace-pill-btn {
  flex-shrink: 0;
  height: var(--workspace-pill-height);
  padding: 0 var(--gap-md);
  border-radius: var(--radius-xl);
  gap: var(--gap-xs);
}

.workspace-pill-btn :deep(.neo-button-shell__content) {
  gap: var(--gap-xs);
}

.workspace-pill-btn__label {
  font: var(--text-sm-regular);
  color: var(--accent-primary);
  white-space: nowrap;
}

.workspace-pill-btn--muted .workspace-pill-btn__label {
  color: var(--text-secondary);
}
</style>
