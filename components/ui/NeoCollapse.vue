<script setup lang="ts">
defineProps<{
  open: boolean
}>()
</script>

<template>
  <div
    class="neo-collapse"
    :class="{ 'neo-collapse--open': open }"
    :aria-hidden="!open"
  >
    <div class="neo-collapse__body">
      <slot />
    </div>
  </div>
</template>
