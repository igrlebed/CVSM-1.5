<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import {
  rankingProjectScores,
  rankingTableGroups,
} from '~/mocks/ranking'
import {
  PROJECTS_OVERVIEW_METRIC_COL_RANKING,
  PROJECTS_OVERVIEW_PROJECT_COL_MIN_RANKING,
} from '~/composables/useProjectsOverviewColumns'

const props = defineProps<{
  projects: DashboardProject[]
  expanded?: boolean
}>()

const emit = defineEmits<{
  toggleExpand: []
}>()

const projectsSubtitle = computed(() => {
  const rankedCount = props.projects.filter((project) => !project.international).length
  return `${rankedCount} проектов (международный проект не учитывается)`
})

function projectHeaderExtra(project: DashboardProject) {
  const score = rankingProjectScores.find((item) => item.projectId === project.id)
  if (!score) return undefined
  return `Ранг: ${score.rank} / Балл: ${score.score}`
}
</script>

<template>
  <section
    class="ranking-results"
    :class="{ 'ranking-results--expanded': props.expanded }"
    aria-label="Результаты ранжирования"
  >
    <DashboardWorkspaceSectionHeader
      title="Результаты ранжирования"
      :subtitle="projectsSubtitle"
    >
      <template #actions>
        <DashboardIconButton
          :label="props.expanded ? 'Свернуть таблицу' : 'Развернуть таблицу'"
          size="nav"
          :aria-pressed="props.expanded ?? false"
          @click.stop="emit('toggleExpand')"
        >
          <DashboardMinimizeIcon v-if="props.expanded" />
          <DashboardMaximizeIcon v-else />
        </DashboardIconButton>
      </template>
    </DashboardWorkspaceSectionHeader>

    <DashboardProjectsOverviewTable
      :projects="projects"
      metric-label="Критерий ранжирования"
      :groups="rankingTableGroups"
      variant="ranking"
      :metric-col-width="PROJECTS_OVERVIEW_METRIC_COL_RANKING"
      :project-col-min="PROJECTS_OVERVIEW_PROJECT_COL_MIN_RANKING"
      :project-header-extra="projectHeaderExtra"
      aria-label="Таблица результатов ранжирования"
    />
  </section>
</template>

<style scoped>
.ranking-results {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-self: stretch;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.ranking-results :deep(.workspace-section-head) {
  flex-shrink: 0;
}

.ranking-results--expanded {
  width: 100%;
}

</style>
