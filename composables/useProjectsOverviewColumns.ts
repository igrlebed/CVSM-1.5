import type { DashboardProject, ProjectType } from '~/mocks/dashboard'
import type { ProjectsOverviewGroup, ProjectsOverviewRow } from '~/types/projectsOverview'

export const PROJECTS_OVERVIEW_METRIC_COL_INDICATORS = 269
export const PROJECTS_OVERVIEW_METRIC_COL_RANKING = 284
export const PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS = 220
export const PROJECTS_OVERVIEW_PROJECT_COL_MIN_RANKING = 152

const CELL_PADDING_X = 24
const HEADER_TITLE_FONT = '400 14px Onest, system-ui, sans-serif'
const HEADER_EXTRA_FONT = '400 14px Onest, system-ui, sans-serif'
const CELL_VALUE_FONT = '400 16px Onest, system-ui, sans-serif'
const CELL_VALUE_FONT_EMPHASIS = '500 16px Onest, system-ui, sans-serif'
const BADGE_FONT = '700 10px Onest, system-ui, sans-serif'
const BADGE_SM_WIDTH = 32
const BADGE_PADDING_X = 8

let measureCanvas: HTMLCanvasElement | undefined

function measureUiText(text: string, font: string) {
  if (!import.meta.client) return 0
  measureCanvas ??= document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return 0
  ctx.font = font
  return ctx.measureText(text).width
}

function projectBadgeWidth(type: ProjectType) {
  if (type === 'sm') return BADGE_SM_WIDTH
  return Math.ceil(measureUiText('ВСМ', BADGE_FONT)) + BADGE_PADDING_X
}

function flattenRows(
  rows: ProjectsOverviewRow[] | undefined,
  groups: ProjectsOverviewGroup[] | undefined,
) {
  if (rows?.length) return rows
  return groups?.flatMap((group) => group.rows) ?? []
}

export function projectsOverviewProjectColumnWidth(
  project: DashboardProject,
  tableRows: ProjectsOverviewRow[],
  options: {
    projectColMin: number
    variant: 'indicators' | 'ranking'
    projectHeaderExtra?: (project: DashboardProject) => string | undefined
  },
) {
  const titleW = Math.ceil(measureUiText(project.title, HEADER_TITLE_FONT))
  const extraLine = options.projectHeaderExtra?.(project)
  const extraW = extraLine
    ? Math.ceil(measureUiText(extraLine, HEADER_EXTRA_FONT))
    : 0
  const headerW =
    Math.max(titleW, projectBadgeWidth(project.type), extraW) + CELL_PADDING_X

  const maxCellW = Math.max(
    0,
    ...tableRows.map((row) => {
      const value = row.values[project.id] ?? '—'
      const font = row.emphasis ? CELL_VALUE_FONT_EMPHASIS : CELL_VALUE_FONT
      return Math.ceil(measureUiText(value, font))
    }),
  )
  const bodyW = maxCellW + CELL_PADDING_X

  return Math.max(options.projectColMin, headerW, bodyW)
}

export function useProjectsOverviewColumns(
  projects: MaybeRefOrGetter<DashboardProject[]>,
  options: MaybeRefOrGetter<{
    metricColWidth: number
    projectColMin: number
    rows?: ProjectsOverviewRow[]
    groups?: ProjectsOverviewGroup[]
    variant?: 'indicators' | 'ranking'
    projectHeaderExtra?: (project: DashboardProject) => string | undefined
  }>,
) {
  const measureRevision = ref(0)

  onMounted(() => {
    measureRevision.value++
    document.fonts?.ready?.then(() => {
      measureRevision.value++
    })
  })

  watch(
    () => {
      const list = toValue(projects)
      const value = toValue(options)
      return [
        list.length,
        list.map((project) => project.id).join(','),
        value.metricColWidth,
        value.projectColMin,
        value.variant,
        value.rows?.length ?? 0,
        value.groups?.length ?? 0,
      ] as const
    },
    () => {
      measureRevision.value++
    },
  )

  const resolvedOptions = computed(() => {
    const value = toValue(options)
    return {
      metricColWidth: value.metricColWidth,
      projectColMin: value.projectColMin,
      rows: value.rows,
      groups: value.groups,
      variant: value.variant ?? 'indicators',
      projectHeaderExtra: value.projectHeaderExtra,
    }
  })

  const tableRows = computed(() =>
    flattenRows(resolvedOptions.value.rows, resolvedOptions.value.groups),
  )

  const projectColWidths = computed(() => {
    void measureRevision.value
    const list = toValue(projects)
    const opts = resolvedOptions.value
    if (!import.meta.client) {
      return list.map(() => opts.projectColMin)
    }
    return list.map((project) =>
      projectsOverviewProjectColumnWidth(project, tableRows.value, {
        projectColMin: opts.projectColMin,
        variant: opts.variant,
        projectHeaderExtra: opts.projectHeaderExtra,
      }),
    )
  })

  const tableWidthPx = computed(
    () =>
      resolvedOptions.value.metricColWidth
      + projectColWidths.value.reduce((sum, width) => sum + width, 0),
  )

  const tableStyle = computed(() => ({
    width: `${tableWidthPx.value}px`,
  }))

  const layoutStyle = computed(() => ({
    width: `${tableWidthPx.value + 48}px`,
  }))

  return {
    metricColWidth: computed(() => resolvedOptions.value.metricColWidth),
    projectColWidths,
    tableStyle,
    layoutStyle,
  }
}
