<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'

defineProps<{
  projects: DashboardProject[]
}>()

const tableExpanded = ref(false)

function toggleTableExpanded() {
  tableExpanded.value = !tableExpanded.value
}
</script>

<template>
  <div
    class="ranking-workspace"
    :class="{ 'ranking-workspace--table-expanded': tableExpanded }"
  >
    <div class="ranking-workspace__body">
      <div
        class="ranking-workspace__criteria-slot"
        :class="{ 'ranking-workspace__criteria-slot--collapsed': tableExpanded }"
        :aria-hidden="tableExpanded"
      >
        <div class="ranking-workspace__criteria-fade">
          <DashboardRankingCriteriaPanel />
        </div>
      </div>
      <DashboardRankingResultsTable
        :projects="projects"
        :expanded="tableExpanded"
        @toggle-expand="toggleTableExpanded"
      />
    </div>
  </div>
</template>

<style scoped>
.ranking-workspace {
  --criteria-panel-width: calc(416px + var(--scroll-thumb-width));

  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--gap-section);
  min-height: 0;
  overflow: hidden;
}

.ranking-workspace__body {
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  gap: var(--gap-workspace);
  min-height: 0;
  overflow: hidden;
  transition: gap 320ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ranking-workspace--table-expanded .ranking-workspace__body {
  gap: 0;
}

.ranking-workspace__criteria-slot {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--criteria-panel-width);
  min-height: 0;
  overflow: hidden;
  transition: width 320ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ranking-workspace__criteria-slot--collapsed {
  width: 0;
  pointer-events: none;
}

.ranking-workspace__criteria-fade {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  width: var(--criteria-panel-width);
  min-height: 0;
  opacity: 1;
  transition: opacity 320ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ranking-workspace__criteria-slot--collapsed .ranking-workspace__criteria-fade {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ranking-workspace__body,
  .ranking-workspace__criteria-slot,
  .ranking-workspace__criteria-fade {
    transition: none;
  }
}
</style>
