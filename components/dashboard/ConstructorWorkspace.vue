<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import { constructorKpiItemsForProjects, getGanttSchedulesForProjects } from '~/mocks/constructor'

const props = defineProps<{
  projects: DashboardProject[]
}>()

const kpiItems = computed(() => constructorKpiItemsForProjects(props.projects.length))
const ganttSchedules = computed(() => getGanttSchedulesForProjects(props.projects))
const showGantt = computed(() => props.projects.length > 0)
</script>

<template>
  <div class="constructor-workspace">
    <DashboardConstructorScenarioPanel />
    <div class="constructor-workspace__main neo-scroll">
      <section class="constructor-workspace__params" aria-label="Параметры">
        <DashboardWorkspaceSectionHeader title="Параметры" size="compact" sticky />
        <div class="constructor-workspace__kpi">
          <DashboardKpiCard
            v-for="(item, index) in kpiItems"
            :key="index"
            :item="item"
            size="sm"
          />
        </div>
      </section>

      <DashboardConstructorProjectManagement />
      <DashboardConstructorGanttChart
        v-if="showGantt"
        class="constructor-workspace__gantt"
        :schedules="ganttSchedules"
      />
    </div>
  </div>
</template>

<style scoped>
.constructor-workspace {
  display: flex;
  flex: 1 1 0;
  gap: var(--gap-workspace);
  min-height: 0;
  overflow: hidden;
}

.constructor-workspace__main {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.constructor-workspace__params,
.constructor-workspace__gantt {
  flex-shrink: 0;
}

.constructor-workspace__params {
  display: flex;
  flex-direction: column;
}

.constructor-workspace__kpi {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-kpi-constructor);
  padding-inline-end: var(--gap-md);
  padding-bottom: var(--gap-md);
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .constructor-workspace__kpi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .constructor-workspace {
    flex-direction: column;
  }

  .constructor-workspace__kpi {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
