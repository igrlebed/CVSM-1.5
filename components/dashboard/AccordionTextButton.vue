<script setup lang="ts">
defineProps<{
  label: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <UiNeoButtonShell
    variant="sidebar"
    class="accordion-text-button"
    @click="emit('click')"
  >
    <span class="accordion-text-button__label">{{ label }}</span>
  </UiNeoButtonShell>
</template>

<style scoped>
.accordion-text-button {
  width: 100%;
  height: 44px;
  padding: 0 var(--gap-md);
  border-radius: var(--radius-lg);
  text-align: left;
}

.accordion-text-button :deep(.neo-button-shell__content) {
  justify-content: flex-start;
}

.accordion-text-button__label {
  flex: 1;
  min-width: 0;
  font: var(--text-md-regular);
  color: var(--text-primary);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
