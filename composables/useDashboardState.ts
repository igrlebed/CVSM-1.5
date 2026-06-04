import type { InjectionKey } from 'vue'
import { dashboardMeta, timelineActiveYear } from '~/mocks/dashboard'

export function createDashboardState() {
  const modelYear = ref(timelineActiveYear)
  const selectedProjectId = ref<string | null>(null)
  const sidebarOpen = ref(false)
  const kpiLoading = ref(false)

  function selectProject(id: string) {
    selectedProjectId.value = selectedProjectId.value === id ? null : id
  }

  return {
    modelYear,
    selectedProjectId,
    selectProject,
    sidebarOpen,
    kpiLoading,
    meta: dashboardMeta,
  }
}

export type DashboardState = ReturnType<typeof createDashboardState>

export const dashboardStateKey: InjectionKey<DashboardState> = Symbol('dashboard-state')

export function useDashboardState() {
  const state = inject(dashboardStateKey)
  if (!state) {
    throw new Error('useDashboardState must be used within dashboard provider')
  }
  return state
}
