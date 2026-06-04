import type { DashboardProject, ProjectType } from '~/mocks/dashboard'
import {
  getIndicatorsOverviewCell,
  indicatorsOverviewMetrics,
} from '~/mocks/indicatorsOverview'

export const INDICATORS_METRIC_COL_WIDTH = 269
export const INDICATORS_PROJECT_COL_MIN = 220

const CELL_PADDING_X = 24
const HEADER_TITLE_FONT = '400 14px Onest, system-ui, sans-serif'
const CELL_VALUE_FONT = '400 16px Onest, system-ui, sans-serif'
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

export function indicatorsProjectColumnWidth(project: DashboardProject) {
  const titleW = Math.ceil(measureUiText(project.title, HEADER_TITLE_FONT))
  const headerW = Math.max(titleW, projectBadgeWidth(project.type)) + CELL_PADDING_X

  const cellValues = indicatorsOverviewMetrics.map((metric) =>
    getIndicatorsOverviewCell(project, metric.id),
  )
  const maxCellW = Math.max(
    0,
    ...cellValues.map((value) => Math.ceil(measureUiText(value, CELL_VALUE_FONT))),
  )
  const bodyW = maxCellW + CELL_PADDING_X

  return Math.max(INDICATORS_PROJECT_COL_MIN, headerW, bodyW)
}

export function useIndicatorsOverviewColumns(
  projects: MaybeRefOrGetter<DashboardProject[]>,
) {
  const measureRevision = ref(0)

  onMounted(() => {
    measureRevision.value++
    document.fonts?.ready?.then(() => {
      measureRevision.value++
    })
  })

  watch(
    () => toValue(projects),
    () => {
      measureRevision.value++
    },
    { deep: true },
  )

  const projectColWidths = computed(() => {
    void measureRevision.value
    const list = toValue(projects)
    if (!import.meta.client) {
      return list.map(() => INDICATORS_PROJECT_COL_MIN)
    }
    return list.map((project) => indicatorsProjectColumnWidth(project))
  })

  const tableWidthPx = computed(
    () => INDICATORS_METRIC_COL_WIDTH + projectColWidths.value.reduce((sum, w) => sum + w, 0),
  )

  const tableStyle = computed(() => ({
    width: `${tableWidthPx.value}px`,
  }))

  const layoutStyle = computed(() => ({
    width: `${tableWidthPx.value + 48}px`,
  }))

  return {
    metricColWidth: INDICATORS_METRIC_COL_WIDTH,
    projectColWidths,
    tableStyle,
    layoutStyle,
  }
}
