<script setup lang="ts">
type NeoTone = 'default' | 'sidebar' | 'fill'
type NeoDepth = 'outer' | 'inner' | 'inner-deep' | 'track'

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

const surfaceClass = computed(() => {
  const classes = ['neo-surface']
  if (props.depth === 'outer') {
    classes.push(props.tone === 'sidebar' ? 'neo-surface--outer-sidebar' : 'neo-surface--outer')
  } else if (props.depth === 'inner') {
    classes.push('neo-surface--inner')
  } else if (props.depth === 'inner-deep') {
    classes.push('neo-surface--inner', 'neo-surface--inner-deep')
  } else if (props.depth === 'track') {
    classes.push('neo-surface--track')
  }
  if (props.tone === 'fill') classes.push('neo-surface--fill-bg')
  return classes
})
</script>

<template>
  <component
    :is="tag"
    :class="surfaceClass"
    :style="{ borderRadius: radius, padding, overflow }"
  >
    <span class="neo-surface__bg" aria-hidden="true" />
    <div class="neo-surface__content">
      <slot />
    </div>
    <span class="neo-surface__inset" aria-hidden="true" />
  </component>
</template>
