<script setup lang="ts">
import { rankingCriterionGroups } from '~/mocks/ranking'

const enabledByGroup = ref<Record<string, boolean>>(
  Object.fromEntries(rankingCriterionGroups.map((group) => [group.id, group.enabled])),
)
</script>

<template>
  <aside class="ranking-criteria-panel" aria-label="Настройка критериев">
    <DashboardWorkspaceSectionHeader title="Настройка критериев" size="compact" />
    <div class="ranking-criteria-panel__list neo-scroll">
      <div class="ranking-criteria-panel__cards">
        <DashboardRankingCriteriaCard
          v-for="group in rankingCriterionGroups"
          :key="group.id"
          :group="group"
          v-model:enabled="enabledByGroup[group.id]"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.ranking-criteria-panel {
  --panel-content-width: 416px;

  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  width: calc(var(--panel-content-width) + var(--scroll-thumb-width));
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.ranking-criteria-panel__list {
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.ranking-criteria-panel__cards {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  width: var(--panel-content-width);
  flex-shrink: 0;
  padding-bottom: 8px;
  box-sizing: border-box;
}
</style>
