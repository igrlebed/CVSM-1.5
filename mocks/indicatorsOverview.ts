import type { DashboardProject } from '~/mocks/dashboard'

export interface IndicatorsOverviewMetric {
  id: string
  label: string
  /** Figma: строка 64px, подпись в 2 строки */
  multiline?: boolean
}

/** MOCK: replace with GET /api/v1/indicators/overview */
export const indicatorsOverviewMetrics: IndicatorsOverviewMetric[] = [
  { id: 'gdp', label: 'Вклад в ВВП, млрд руб.' },
  { id: 'invest', label: 'Инвестиции, млрд руб.' },
  { id: 'length', label: 'Протяженность, км' },
  { id: 'speed', label: 'Эксплуатационная скорость, км/ч' },
  { id: 'passenger', label: 'Пассажиропоток на ВСМ, млн пасс./год', multiline: true },
  { id: 'travel', label: 'Время в пути следования (Сокращение времени), чч:мм', multiline: true },
  { id: 'population', label: 'Охват населения, млн чел.' },
]

/** Figma 3847:46861 — проекты 1–7 */
const overviewValuesByProject: Record<string, string[]> = {
  '1': ['1 035,52', '342,49', '195', '360', '3,3', '1:05 (-1:00)', '23,1'],
  '2': ['16 952,55', '5 146,62', '1 919', '360', '17,1', '6:36 (-17:30)', '44,4'],
  '3': ['8 001,96', '1 996,81', '707', '360', '5,5', '3:00 (-4:00)', '25,4'],
  '4': ['919,00', '692,89', '697', '160', '5,3', '5:40 (-1:30)', '26,7'],
  '5': ['381,10', '291,91', '379', '160', '4,5', '3:20 (-0:40)', '24,3'],
  '6': ['541,63', '730,45', '282', '160', '4', '2:30 (-0:30)', '24,5'],
  '7': ['17 733,63', '6 294,22', '1 484', '360', '29', '8:00 (-15:00)', '49,6'],
}

function zeroCell(metricId: string): string {
  if (metricId === 'travel') {
    return '0:00 (-0:00)'
  }
  return '0'
}

export function getIndicatorsOverviewCell(
  project: DashboardProject,
  metricId: string,
): string {
  const values = overviewValuesByProject[project.id]
  if (!values) {
    return zeroCell(metricId)
  }
  const index = indicatorsOverviewMetrics.findIndex((metric) => metric.id === metricId)
  return values[index] ?? zeroCell(metricId)
}
