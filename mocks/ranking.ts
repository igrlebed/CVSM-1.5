import { projects, type DashboardProject } from '~/mocks/dashboard'

export const rankingProjectIds = ['1', '2', '3', '4', '5', '6', '7'] as const

export const rankingProjects: DashboardProject[] = rankingProjectIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project): project is DashboardProject => !!project)

export const rankingProjectsSubtitle =
  '6 проектов (международный проект не учитывается)'

export interface RankingCriterionGroup {
  id: string
  title: string
  criteriaCount?: number
  criteria?: string[]
  weight: string
  enabled: boolean
}

export const rankingCriterionGroups: RankingCriterionGroup[] = [
  {
    id: 'transport',
    title: 'Транспортные критерии',
    criteriaCount: 3,
    criteria: [
      'Перспективный пассажиропоток',
      'Индуцированный пассажирооборот',
      'Сокращение времени поездки',
    ],
    weight: '0,25',
    enabled: true,
  },
  {
    id: 'capacity',
    title: 'Дополнительная пропускная способность',
    weight: '0,25',
    enabled: true,
  },
  {
    id: 'capital',
    title: 'Критерии капиталоемкости',
    criteriaCount: 2,
    criteria: [
      'Удельные инвестиции в проект на 1 пассажира',
      'Удельные инвестиции в проект на 1 км',
    ],
    weight: '0,25',
    enabled: true,
  },
  {
    id: 'socio',
    title: 'Критерии социально-экономической эффективности',
    criteriaCount: 5,
    criteria: [
      'Коэффициент социально-экономической эффективности проекта',
      'Коэффициент эффективности бюджетных вложений',
      'Доля бюджетного финансирования проекта',
      'Срок окупаемости бюджетных средств',
      'Суммарный вклад в ВВП РФ от реализации проектов',
    ],
    weight: '0,25',
    enabled: true,
  },
]

export interface RankingProjectScore {
  projectId: string
  rank: number
  score: string
}

/** MOCK: replace with GET /api/v1/ranking/scores */
const rankingScoresByProjectId: Record<string, { rank: number, score: string }> = {
  '1': { rank: 1, score: '6,7' },
  '2': { rank: 2, score: '6,5' },
  '3': { rank: 3, score: '6,3' },
  '4': { rank: 4, score: '6,1' },
  '5': { rank: 5, score: '5,9' },
  '6': { rank: 1, score: '6,7' },
  '7': { rank: 6, score: '5,8' },
  '8': { rank: 7, score: '5,6' },
  '9': { rank: 8, score: '5,4' },
  '10': { rank: 9, score: '5,3' },
  '11': { rank: 10, score: '5,1' },
  '12': { rank: 11, score: '4,9' },
  '13': { rank: 12, score: '4,8' },
  '14': { rank: 13, score: '4,6' },
  '15': { rank: 14, score: '4,5' },
  '16': { rank: 15, score: '4,3' },
  '17': { rank: 16, score: '4,2' },
  '18': { rank: 17, score: '4,0' },
  '19': { rank: 18, score: '3,8' },
}

export const rankingProjectScores: RankingProjectScore[] = projects.map((project) => {
  const mock = rankingScoresByProjectId[project.id] ?? { rank: 10, score: '5,0' }
  return {
    projectId: project.id,
    rank: mock.rank,
    score: mock.score,
  }
})

export interface RankingTableRow {
  id: string
  label: string
  emphasis?: boolean
  values: Record<string, string>
}

export interface RankingTableGroup {
  id: string
  title: string
  rows: RankingTableRow[]
}

const transportValues: Record<string, string[]> = {
  '1': ['342,49', '195', '360'],
  '2': ['5 146,62', '1919', '360'],
  '3': ['1 996,81', '707', '360'],
  '4': ['692,89', '697', '160'],
  '5': ['291,91', '379', '160'],
  '6': ['730,45', '282', '160'],
  '7': ['6 294,22', '1484', '360'],
}

export const rankingTableGroups: RankingTableGroup[] = [
  {
    id: 'transport',
    title: 'Транспортные критерии',
    rows: [
      {
        id: 'passenger-flow',
        label: 'Перспективный пассажиропоток, млн пасс.',
        values: Object.fromEntries(
          rankingProjectIds.map((id) => [id, transportValues[id]![0]!]),
        ),
      },
      {
        id: 'induced-traffic',
        label: 'Индуцированный пассажирооборот, млн пасс.-км',
        values: Object.fromEntries(
          rankingProjectIds.map((id, index) => [id, transportValues[id]![1]!]),
        ),
      },
      {
        id: 'travel-time',
        label: 'Сокращение времени поездки, ч',
        values: Object.fromEntries(
          rankingProjectIds.map((id) => [id, transportValues[id]![2]!]),
        ),
      },
    ],
  },
  {
    id: 'capacity',
    title: 'Дополнительная пропускная способность, млн т',
    rows: [
      {
        id: 'capacity-value',
        label: 'Дополнительная пропускная способность, млн т',
        emphasis: true,
        values: Object.fromEntries(
          rankingProjectIds.map((id) => [id, id === '4' || id === '5' || id === '6' ? '160' : '360']),
        ),
      },
    ],
  },
  {
    id: 'capital',
    title: 'Критерии капиталоемкости',
    rows: [
      {
        id: 'invest-passenger',
        label: 'Удельные инвестиции в проект на 1 пассажира',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
      {
        id: 'invest-km',
        label: 'Удельные инвестиции в проект на 1 км',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
    ],
  },
  {
    id: 'socio',
    title: 'Критерии социально-экономической эффективности',
    rows: [
      {
        id: 'socio-1',
        label: 'Коэффициент социально-экономической эффективности проекта',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
      {
        id: 'socio-2',
        label: 'Коэффициент эффективности бюджетных вложений',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
      {
        id: 'socio-3',
        label: 'Доля бюджетного финансирования проекта',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
      {
        id: 'socio-4',
        label: 'Срок окупаемости бюджетных средств',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
      {
        id: 'socio-5',
        label: 'Суммарный вклад в ВВП РФ от реализации проектов',
        values: Object.fromEntries(rankingProjectIds.map((id) => [id, '—'])),
      },
    ],
  },
]
