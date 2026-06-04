export type ProjectType = 'vsm' | 'vsm-minsk' | 'sm'

export interface DashboardProject {
  id: string
  title: string
  type: ProjectType
  international?: boolean
}

export interface KpiItem {
  value: number
  suffix?: string
  label: string
  labelLines?: string[]
}

export interface LegendItem {
  color: string
  label: string
  group?: string
}

export const dashboardMeta = {
  breadcrumb: 'Главная / Модель развития сети',
  modelStatus: 'Черновик сценария',
  dataUpdatedAt: '04.06.2026, 14:30',
}

export const dashboardTitle =
  'Модель развития сети высокоскоростных железнодорожных магистралей Российской Федерации'

export const kpiItems: KpiItem[] = [
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

export const projects: DashboardProject[] = [
  { id: '1', title: 'Москва – Рязань', type: 'vsm' },
  { id: '2', title: 'Москва – Екатеринбург', type: 'vsm' },
  { id: '3', title: 'Москва – Минск', type: 'vsm-minsk', international: true },
  { id: '4', title: 'Москва – Белгород', type: 'sm' },
  { id: '5', title: 'Москва – Брянск', type: 'sm' },
  { id: '6', title: 'Москва – Ярославль', type: 'sm' },
  { id: '7', title: 'Москва – Адлер', type: 'vsm' },
]

export type SidebarSectionId = 'projects' | 'indicators' | 'constructor' | 'ranking'
export type SidebarSectionType = 'projects' | 'indicators' | 'info'

export interface SidebarInfoSection {
  description: string
  buttonLabel: string
}

export const sidebarSections: Array<{
  id: SidebarSectionId
  title: string
  type: SidebarSectionType
}> = [
  { id: 'projects', title: 'Проекты', type: 'projects' },
  { id: 'indicators', title: 'Показатели', type: 'indicators' },
  { id: 'constructor', title: 'Конструктор', type: 'info' },
  { id: 'ranking', title: 'Ранжирование', type: 'info' },
]

export const indicatorItems = [
  'Пассажиропоток',
  'Социально-экономические эффекты',
  'Инвестиции',
  'Размеры движения',
  'Охват населения',
  'Технические параметры',
]

export const constructorSection: SidebarInfoSection = {
  description: 'Моделирование параметров реализации проектов и оценка эффектов',
  buttonLabel: 'Открыть конструктор',
}

export const rankingSection: SidebarInfoSection = {
  description: 'Приоритизация проектов с учетом параметров реализации и эффектов',
  buttonLabel: 'Перейти к ранжированию',
}

export const mapLegendRows: LegendItem[] = [
  { color: 'var(--project-vsm)', label: 'ВСМ проекты' },
  { color: 'var(--project-vsm-minsk)', label: 'ВСМ Москва – Минск' },
  { color: 'var(--project-sm)', label: 'СМ проекты' },
]

export const mapLegendImplementation = {
  group: 'Проект в реализации',
  item: {
    color: 'var(--project-msk-spb)',
    label: 'ВСМ Москва – Санкт-Петербург',
  },
}

export const timelineYears = Array.from({ length: 23 }, (_, i) => 2028 + i)

export const timelineActiveYear = 2038
