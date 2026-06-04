<script setup lang="ts">
defineProps<{
  up?: boolean
}>()
</script>

<template>
  <svg
    class="accordion-chevron"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g transform="translate(4.167 6.667)">
      <path
        v-if="up"
        d="M6.42259 0.244078C6.09715 -0.0813592 5.56951 -0.0813592 5.24408 0.244078L0.244078 5.24408C-0.0813592 5.56951 -0.0813592 6.09715 0.244078 6.42259C0.569515 6.74803 1.09715 6.74803 1.42259 6.42259L5.83333 2.01184L10.2441 6.42259C10.5695 6.74803 11.0972 6.74803 11.4226 6.42259C11.748 6.09715 11.748 5.56951 11.4226 5.24408L6.42259 0.244078Z"
        fill="currentColor"
      />
      <path
        v-else
        d="M1.42259 0.244078C1.09715 -0.0813592 0.569515 -0.0813592 0.244078 0.244078C-0.0813592 0.569515 -0.0813592 1.09715 0.244078 1.42259L5.24408 6.42259C5.56951 6.74803 6.09715 6.74803 6.42259 6.42259L11.4226 1.42259C11.748 1.09715 11.748 0.569515 11.4226 0.244078C11.0972 -0.0813592 10.5695 -0.0813592 10.2441 0.244078L5.83333 4.65482L1.42259 0.244078Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<style scoped>
.accordion-chevron {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  display: block;
  color: var(--text-primary);
  transition: transform var(--transition-base);
}

.accordion-chevron path {
  transition: opacity var(--transition-fast);
}
</style>
