<script setup lang="ts">
defineProps<{
  checked: boolean
  indeterminate?: boolean
}>()
</script>

<template>
  <span
    class="neo-check project-multi-check"
    :class="{
      'neo-check--checked': checked,
      'neo-check--indeterminate': indeterminate && !checked,
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
.project-multi-check__dash {
  width: 8px;
  height: 2px;
  border-radius: 1px;
  background: var(--text-invert);
}
</style>
