<script setup lang="ts">
import type { RankingCriterionGroup } from '~/mocks/ranking'

const props = defineProps<{
  group: RankingCriterionGroup
}>()

const enabled = defineModel<boolean>('enabled', { required: true })

const criteriaOpen = ref(false)

const criteriaCount = computed(
  () => props.group.criteria?.length ?? props.group.criteriaCount ?? 0,
)

const criteriaToggleLabel = computed(() => {
  const count = criteriaCount.value
  const mod10 = count % 10
  const mod100 = count % 100
  let word = 'критериев'
  if (mod10 === 1 && mod100 !== 11) word = 'критерий'
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = 'критерия'
  const label = word.charAt(0).toUpperCase() + word.slice(1)
  return `${count} ${label}`
})

watch(enabled, (isEnabled) => {
  if (!isEnabled) {
    criteriaOpen.value = false
  }
})
</script>

<template>
  <article
    class="ranking-criteria-card neo-shell-outer"
    :class="{ 'ranking-criteria-card--disabled': !enabled }"
  >
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="ranking-criteria-card__body neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content ranking-criteria-card__content">
        <header class="ranking-criteria-card__head">
          <h3 class="ranking-criteria-card__dimmable ranking-criteria-card__title">
            {{ group.title }}
          </h3>
          <UiNeoSwitch v-model="enabled" :label="`Включить ${group.title}`" />
        </header>

        <button
          v-if="group.criteria?.length"
          type="button"
          class="ranking-criteria-card__dimmable ranking-criteria-card__criteria-toggle"
          :aria-expanded="criteriaOpen"
          :disabled="!enabled"
          @click="criteriaOpen = !criteriaOpen"
        >
          <span>{{ criteriaToggleLabel }}</span>
          <DashboardAccordionChevron :up="criteriaOpen" />
        </button>

        <UiNeoCollapse
          v-if="group.criteria?.length"
          :open="enabled && criteriaOpen"
          class="ranking-criteria-card__dimmable"
        >
          <ul class="ranking-criteria-card__criteria-list">
            <li v-for="item in group.criteria" :key="item">{{ item }}</li>
          </ul>
        </UiNeoCollapse>

        <footer class="ranking-criteria-card__dimmable ranking-criteria-card__weight">
          <span>Вес группы:</span>
          <span>{{ group.weight }}</span>
        </footer>
      </div>
      <span class="neo-shell-inner__inset" aria-hidden="true" />
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </article>
</template>

<style scoped>
.ranking-criteria-card {
  --card-spring: cubic-bezier(0.34, 1.15, 0.64, 1);
  --card-duration: 0.38s;

  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border-radius: var(--radius-3xl);
}

.ranking-criteria-card__body {
  border-radius: var(--radius-2xl);
  transition: filter var(--card-duration) ease;
}

.ranking-criteria-card--disabled .ranking-criteria-card__body {
  filter: saturate(0.72);
}

.ranking-criteria-card__dimmable {
  transition:
    opacity var(--card-duration) var(--card-spring),
    color var(--card-duration) ease;
}

.ranking-criteria-card--disabled .ranking-criteria-card__dimmable {
  opacity: 0.52;
}

.ranking-criteria-card__content {
  --card-action-col: 38px;

  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.ranking-criteria-card__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--card-action-col);
  align-items: start;
  column-gap: 12px;
}

.ranking-criteria-card__head :deep(.neo-switch) {
  justify-self: end;
}

.ranking-criteria-card__title {
  margin: 0;
  min-width: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
}

.ranking-criteria-card__criteria-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-top: -4px;
  padding: 4px 0;
  border: none;
  background: transparent;
  font: var(--text-sm-regular);
  font-weight: 400;
  color: var(--accent-primary);
  cursor: pointer;
  transition:
    color var(--transition-fast),
    font-weight var(--transition-fast);
}

.ranking-criteria-card__criteria-toggle:hover:not(:disabled) {
  color: var(--text-primary);
  font-weight: 500;
}

.ranking-criteria-card__criteria-toggle:disabled {
  cursor: default;
  pointer-events: none;
}

.ranking-criteria-card__criteria-toggle :deep(.accordion-chevron) {
  width: 16px;
  height: 16px;
  color: currentColor;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.ranking-criteria-card__criteria-toggle:hover:not(:disabled) :deep(.accordion-chevron) {
  transform: scale(1.12);
}

@media (prefers-reduced-motion: reduce) {
  .ranking-criteria-card,
  .ranking-criteria-card__body,
  .ranking-criteria-card__dimmable {
    transition-duration: 0.01ms;
  }

}

.ranking-criteria-card__criteria-list {
  margin: -4px 0 0;
  padding: 0 0 2px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.ranking-criteria-card__criteria-list li {
  line-height: 18px;
}

.ranking-criteria-card__weight {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--card-action-col);
  align-items: baseline;
  column-gap: 12px;
  padding-top: 4px;
  font: var(--text-md-medium);
  line-height: 20px;
  color: var(--text-primary);
}

.ranking-criteria-card__weight span:last-child {
  justify-self: end;
  line-height: 20px;
}
</style>
