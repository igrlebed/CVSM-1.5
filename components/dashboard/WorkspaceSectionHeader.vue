<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** compact — p 20 / h 84 (Параметры, Сценарий); spacious — px 20 py 32 / h 88 */
    size?: 'compact' | 'spacious'
    /** Липкий заголовок при скролле родительского контейнера */
    sticky?: boolean
  }>(),
  {
    size: 'spacious',
    sticky: false,
  },
)
</script>

<template>
  <header
    class="workspace-section-head"
    :class="[
      `workspace-section-head--${size}`,
      { 'workspace-section-head--sticky': sticky },
    ]"
  >
    <div class="workspace-section-head__text">
      <h2 class="workspace-section-head__title">{{ title }}</h2>
      <p v-if="subtitle" class="workspace-section-head__subtitle">{{ subtitle }}</p>
    </div>
    <slot name="actions" />
  </header>
</template>

<style scoped>
.workspace-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-lg);
  box-sizing: border-box;
  flex-shrink: 0;
}

.workspace-section-head--compact {
  height: var(--workspace-section-head-height-compact);
  min-height: var(--workspace-section-head-height-compact);
  padding: var(--workspace-section-head-padding);
}

.workspace-section-head--spacious {
  min-height: var(--workspace-section-head-height);
  padding-inline: var(--workspace-guide-inset);
  padding-block: var(--workspace-section-head-padding-block);
}

.workspace-section-head__text {
  display: flex;
  flex-direction: column;
  gap: var(--gap-3xs);
  min-width: 0;
}

.workspace-section-head__title {
  margin: 0;
  font: var(--text-xl-medium);
  line-height: 24px;
  color: var(--text-primary);
}

.workspace-section-head__subtitle {
  margin: 0;
  font: var(--text-md-regular);
  color: var(--text-secondary);
}

.workspace-section-head--sticky {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--background-primary);
}
</style>
