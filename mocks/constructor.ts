import type { DashboardProject, KpiItem, ProjectType } from '~/mocks/dashboard'
import { projects } from '~/mocks/dashboard'

/** Figma 3921:30089 — 6 KPI в блоке «Параметры» */
export const constructorKpiItems: KpiItem[] = [
  { value: 32, label: 'Прирост ВВП,', labelLines: ['трлн руб.'] },
  { value: 32, label: 'Потребный объем', labelLines: ['инвестиций, трлн руб.'] },
  { value: 32, label: 'Пассажиропоток,', labelLines: ['млн пасс. /год'] },
  {
    value: 32,
    suffix: '(22%)',
    label: 'Численность населения территорий, тяготеющих к проектам, млн чел.',
  },
  { value: 32, label: 'Протяженность сети,', labelLines: ['км'] },
  { value: 32, label: 'Потребный парк,', labelLines: ['вагоны'] },
]

export const constructorGanttYears = [2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038] as const

export const GANTT_START_YEAR = constructorGanttYears[0]
export const GANTT_END_YEAR = constructorGanttYears[constructorGanttYears.length - 1]

export type ConstructorScenarioId = 'base' | 'alternative'

export interface ConstructorScenario {
  id: ConstructorScenarioId
  title: string
  locked: boolean
  networkKm: number
  projectsCount: number
}

export const CONSTRUCTOR_BASE_NETWORK_KM = 5663

export const constructorBaseScenario: ConstructorScenario = {
  id: 'base',
  title: 'Базовый',
  locked: true,
  networkKm: CONSTRUCTOR_BASE_NETWORK_KM,
  projectsCount: projects.length,
}

export const constructorAlternativeScenarioTemplate: ConstructorScenario = {
  id: 'alternative',
  title: 'Альтернатива №1',
  locked: false,
  networkKm: 0,
  projectsCount: 0,
}

/** @deprecated используйте constructorBaseScenario */
export const constructorScenario = constructorBaseScenario

export function constructorNetworkKmForProjectsCount(count: number): number {
  if (count <= 0 || projects.length === 0) {
    return 0
  }
  return Math.round((CONSTRUCTOR_BASE_NETWORK_KM * count) / projects.length)
}

export function constructorKpiItemsForProjects(count: number): KpiItem[] {
  const value = count > 0 ? 32 : 0
  const suffix = count > 0 ? '(22%)' : undefined
  return [
    { value, label: 'Прирост ВВП,', labelLines: ['трлн руб.'] },
    { value, label: 'Потребный объем', labelLines: ['инвестиций, трлн руб.'] },
    { value, label: 'Пассажиропоток,', labelLines: ['млн пасс. /год'] },
    {
      value,
      suffix,
      label: 'Численность населения территорий, тяготеющих к проектам, млн чел.',
    },
    { value, label: 'Протяженность сети,', labelLines: ['км'] },
    { value, label: 'Потребный парк,', labelLines: ['вагоны'] },
  ]
}

export interface GanttPeriod {
  startLabel: string
  endLabel: string
  months: number
  /** Доля шкалы 2028–2038 (0–1) */
  start: number
  end: number
}

export interface GanttPhaseBar {
  type: 'pir' | 'smr'
  start: number
  end: number
  durationMonths: number
}

export interface GanttMilestone {
  type: 'commissioning'
  at: number
  durationMonths: number
}

export interface GanttSegment {
  id: string
  title: string
  depth: number
  expandable?: boolean
  period?: GanttPeriod
  phases?: Array<GanttPhaseBar | GanttMilestone>
  children?: GanttSegment[]
}

export interface GanttProjectSchedule {
  projectId: string
  title: string
  type: ProjectType
  segments: GanttSegment[]
}

function y(year: number, month = 1): number {
  return year + (month - 1) / 12
}

function period(
  startYear: number,
  startMonth: number,
  endYear: number,
  endMonth: number,
): GanttPeriod {
  const start = y(startYear, startMonth)
  const end = y(endYear, endMonth)
  const months = Math.round((end - start) * 12)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    startLabel: `01.${pad(startMonth)}.${startYear}`,
    endLabel: `01.${pad(endMonth)}.${endYear}`,
    months,
    start: (start - GANTT_START_YEAR) / (GANTT_END_YEAR - GANTT_START_YEAR),
    end: (end - GANTT_START_YEAR) / (GANTT_END_YEAR - GANTT_START_YEAR),
  }
}

function phaseBar(
  type: 'pir' | 'smr',
  startYear: number,
  startMonth: number,
  durationMonths: number,
): GanttPhaseBar {
  const start = y(startYear, startMonth)
  const end = start + durationMonths / 12
  return { type, start, end, durationMonths }
}

function milestone(atYear: number, atMonth: number, durationMonths = 1): GanttMilestone {
  return { type: 'commissioning', at: y(atYear, atMonth), durationMonths }
}

function projectTitle(project: DashboardProject): string {
  const prefix = project.type === 'sm' ? 'СМ' : 'ВСМ'
  return `${prefix} ${project.title}`
}

/** Эталонные графики из Figma + сегменты */
const figmaSchedules: Record<string, Omit<GanttProjectSchedule, 'projectId' | 'title' | 'type'>> = {
  '1': {
    segments: [
      {
        id: '1-root',
        title: 'ВСМ Москва – Рязань',
        depth: 0,
        expandable: true,
        period: period(2028, 1, 2034, 1),
        phases: [
          phaseBar('pir', 2028, 1, 27),
          phaseBar('smr', 2029, 4, 52),
          milestone(2034, 1, 1),
        ],
      },
    ],
  },
  '2': {
    segments: [
      {
        id: '2-root',
        title: 'ВСМ Москва – Екатеринбург',
        depth: 0,
        expandable: true,
        period: period(2028, 1, 2034, 1),
        phases: [phaseBar('pir', 2028, 1, 48)],
        children: [
          {
            id: '2-msk-kzn',
            title: 'Участок «Москва – Казань»',
            depth: 1,
            expandable: true,
            period: period(2028, 1, 2034, 1),
            phases: [
              phaseBar('pir', 2028, 1, 24),
              phaseBar('smr', 2029, 1, 52),
              milestone(2033, 6, 1),
            ],
          },
          {
            id: '2-kzn-ekb',
            title: 'Участок «Казань – Екатеринбург»',
            depth: 1,
            expandable: true,
            period: period(2029, 6, 2038, 1),
            phases: [
              phaseBar('pir', 2029, 6, 30),
              phaseBar('smr', 2031, 1, 60),
              milestone(2038, 1, 1),
            ],
          },
        ],
      },
    ],
  },
  '3': {
    segments: [
      {
        id: '3-root',
        title: 'ВСМ Москва – Минск',
        depth: 0,
        expandable: true,
        period: period(2029, 1, 2036, 1),
        phases: [
          phaseBar('pir', 2029, 1, 30),
          phaseBar('smr', 2030, 6, 54),
          milestone(2036, 1, 1),
        ],
      },
    ],
  },
  '4': {
    segments: [
      {
        id: '4-root',
        title: 'СМ Москва – Белгород',
        depth: 0,
        expandable: true,
        period: period(2028, 6, 2033, 1),
        phases: [
          phaseBar('pir', 2028, 6, 22),
          phaseBar('smr', 2030, 1, 40),
          milestone(2033, 1, 1),
        ],
      },
    ],
  },
  '5': {
    segments: [
      {
        id: '5-root',
        title: 'СМ Москва – Брянск',
        depth: 0,
        expandable: true,
        period: period(2028, 9, 2033, 6),
        phases: [
          phaseBar('pir', 2028, 9, 20),
          phaseBar('smr', 2030, 3, 38),
          milestone(2033, 6, 1),
        ],
      },
    ],
  },
  '6': {
    segments: [
      {
        id: '6-root',
        title: 'СМ Москва – Ярославль',
        depth: 0,
        expandable: true,
        period: period(2029, 1, 2034, 1),
        phases: [
          phaseBar('pir', 2029, 1, 24),
          phaseBar('smr', 2030, 9, 42),
          milestone(2034, 1, 1),
        ],
      },
    ],
  },
  '7': {
    segments: [
      {
        id: '7-root',
        title: 'ВСМ Москва – Адлер',
        depth: 0,
        expandable: true,
        period: period(2030, 1, 2038, 1),
        phases: [
          phaseBar('pir', 2030, 1, 36),
          phaseBar('smr', 2032, 1, 58),
          milestone(2038, 1, 1),
        ],
      },
    ],
  },
}

function generateSchedule(project: DashboardProject, index: number): GanttProjectSchedule {
  const startYear = 2028 + (index % 4)
  const durationYears = project.type === 'vsm' || project.type === 'vsm-minsk' ? 6 : 4
  const endYear = Math.min(GANTT_END_YEAR, startYear + durationYears)
  const pirMonths = project.type === 'sm' ? 20 + (index % 6) : 28 + (index % 8)
  const smrMonths = project.type === 'sm' ? 36 + (index % 10) : 48 + (index % 12)
  const pirStartMonth = 1 + (index % 3) * 3

  return {
    projectId: project.id,
    title: projectTitle(project),
    type: project.type,
    segments: [
      {
        id: `${project.id}-root`,
        title: projectTitle(project),
        depth: 0,
        expandable: true,
        period: period(startYear, pirStartMonth, endYear, 1),
        phases: [
          phaseBar('pir', startYear, pirStartMonth, pirMonths),
          phaseBar('smr', startYear + 1, ((pirStartMonth + 6) % 12) + 1, smrMonths),
          milestone(endYear, 1, 1),
        ],
      },
    ],
  }
}

export function getGanttSchedule(project: DashboardProject, index: number): GanttProjectSchedule {
  const figma = figmaSchedules[project.id]
  if (figma) {
    return {
      projectId: project.id,
      title: projectTitle(project),
      type: project.type,
      ...figma,
    }
  }
  return generateSchedule(project, index)
}

export function getGanttSchedulesForProjects(selected: DashboardProject[]): GanttProjectSchedule[] {
  return selected.map((project, index) => {
    const globalIndex = projects.findIndex((p) => p.id === project.id)
    return getGanttSchedule(project, globalIndex >= 0 ? globalIndex : index)
  })
}

export function timelineLeftPercent(value: number): number {
  const span = GANTT_END_YEAR - GANTT_START_YEAR
  return ((value - GANTT_START_YEAR) / span) * 100
}

export function timelineWidthPercent(start: number, end: number): number {
  const span = GANTT_END_YEAR - GANTT_START_YEAR
  return ((end - start) / span) * 100
}
