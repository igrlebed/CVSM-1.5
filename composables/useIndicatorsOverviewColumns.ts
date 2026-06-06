import type { DashboardProject } from '~/mocks/dashboard'
import {
  getIndicatorsOverviewCell,
  indicatorsOverviewMetrics,
} from '~/mocks/indicatorsOverview'
import {
  PROJECTS_OVERVIEW_METRIC_COL_INDICATORS,
  PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS,
  projectsOverviewProjectColumnWidth,
  useProjectsOverviewColumns,
} from '~/composables/useProjectsOverviewColumns'

export const INDICATORS_METRIC_COL_WIDTH = PROJECTS_OVERVIEW_METRIC_COL_INDICATORS
export const INDICATORS_PROJECT_COL_MIN = PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS

export { projectsOverviewProjectColumnWidth as indicatorsProjectColumnWidth }

export function useIndicatorsOverviewColumns(
  projects: MaybeRefOrGetter<DashboardProject[]>,
) {
  const rows = computed(() =>
    indicatorsOverviewMetrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      multiline: metric.multiline,
      values: Object.fromEntries(
        toValue(projects).map((project) => [
          project.id,
          getIndicatorsOverviewCell(project, metric.id),
        ]),
      ),
    })),
  )

  return useProjectsOverviewColumns(projects, () => ({
    metricColWidth: PROJECTS_OVERVIEW_METRIC_COL_INDICATORS,
    projectColMin: PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS,
    rows: rows.value,
    variant: 'indicators' as const,
  }))
}
