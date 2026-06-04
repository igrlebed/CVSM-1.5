<script setup lang="ts">
defineProps<{
  checked: boolean
  indeterminate?: boolean
}>()
</script>

<template>
  <span
    class="project-multi-check"
    :class="{
      'project-multi-check--checked': checked,
      'project-multi-check--indeterminate': indeterminate && !checked,
    }"
    aria-hidden="true"
  >
    <svg
      v-if="checked"
      class="project-multi-check__icon"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span v-else-if="indeterminate" class="project-multi-check__dash" />
  </span>
</template>

<style scoped>
.project-multi-check {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-sm);
  background: var(--island-external);
  box-shadow: var(--shadow-inset-soft);
  color: var(--text-invert);
}

.project-multi-check--checked,
.project-multi-check--indeterminate {
  border-color: var(--accent-primary);
  background: var(--accent-primary);
  box-shadow: none;
}

.project-multi-check__dash {
  width: 8px;
  height: 2px;
  border-radius: 1px;
  background: var(--text-invert);
}
</style>
