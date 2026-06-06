<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import {
  getIndicatorsOverviewCell,
  indicatorsOverviewMetrics,
} from '~/mocks/indicatorsOverview'

const props = defineProps<{
  projects: DashboardProject[]
}>()

const rows = computed(() =>
  indicatorsOverviewMetrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    multiline: metric.multiline,
    values: Object.fromEntries(
      props.projects.map((project) => [
        project.id,
        getIndicatorsOverviewCell(project, metric.id),
      ]),
    ),
  })),
)
</script>

<template>
  <DashboardProjectsOverviewTable
    :projects="projects"
    metric-label="Показатель"
    :rows="rows"
    variant="indicators"
    aria-label="Сводная таблица показателей"
  />
</template>
