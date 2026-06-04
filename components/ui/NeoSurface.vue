<script setup lang="ts">
type NeoDepth = 'outer' | 'inner' | 'inner-deep' | 'track'
type NeoTone = 'default' | 'fill'

const props = withDefaults(
  defineProps<{
    depth?: NeoDepth
    tone?: NeoTone
    radius?: string
    padding?: string
    overflow?: 'hidden' | 'visible'
    tag?: string
  }>(),
  {
    depth: 'outer',
    tone: 'default',
    radius: 'var(--radius-4xl)',
    padding: '0',
    overflow: 'hidden',
    tag: 'div',
  },
)

const rootClass = computed(() => {
  if (props.depth === 'outer') {
    return ['neo-shell-outer', props.tone === 'fill' ? 'neo-shell-outer--fill' : null]
  }
  if (props.depth === 'track') {
    return ['neo-shell-inner', 'neo-shell-inner--track']
  }
  return ['neo-shell-inner']
})
</script>

<template>
  <component
    :is="tag"
    :class="rootClass"
    :style="{ borderRadius: radius, padding, overflow }"
  >
    <span
      :class="depth === 'outer' ? 'neo-shell-outer__bg' : 'neo-shell-inner__bg'"
      aria-hidden="true"
    />
    <div class="neo-shell-inner__content">
      <slot />
    </div>
    <span
      :class="depth === 'outer' ? 'neo-shell-outer__inset' : 'neo-shell-inner__inset'"
      aria-hidden="true"
    />
  </component>
</template>
