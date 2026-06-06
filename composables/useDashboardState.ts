import type { InjectionKey } from 'vue'
import {
  dashboardMeta,
  projects,
  timelineActiveYear,
  type IndicatorItemLabel,
  type ProjectDetailTabId,
  type ProjectWorkspaceNavId,
  indicatorTabByLabel,
} from '~/mocks/dashboard'
import {
  constructorAlternativeScenarioTemplate,
  constructorBaseScenario,
  constructorNetworkKmForProjectsCount,
  type ConstructorScenario,
  type ConstructorScenarioId,
} from '~/mocks/constructor'
import {
  getEffectiveProjectSelectionVariant,
  type ConstructorProjectsVariant,
  type ProjectWorkspaceCardsVariant,
} from '~/mocks/uiVariants'

export type WorkspaceContext = 'projects' | 'indicators'

function allProjectIds() {
  return projects.map((project) => project.id)
}

export function createDashboardState() {
  const modelYear = ref(timelineActiveYear)
  const selectedProjectId = ref<string | null>(null)
  const selectedProjectIds = ref<Set<string>>(new Set(allProjectIds()))
  const sidebarOpen = ref(false)
  const kpiLoading = ref(false)

  const projectWorkspaceOpen = ref(false)
  const workspaceContext = ref<WorkspaceContext>('projects')
  const activeProjectTab = ref<ProjectDetailTabId>('overview')
  const activeWorkspaceNav = ref<ProjectWorkspaceNavId>('projects')
  const uiVariantsOpen = ref(false)
  const projectWorkspaceCardsVariant = ref<ProjectWorkspaceCardsVariant>('scroll')
  const constructorProjectsVariant = ref<ConstructorProjectsVariant>('grid')
  const constructorBaselineProjectIds = ref<Set<string>>(new Set(allProjectIds()))
  const constructorActiveScenarioId = ref<ConstructorScenarioId>('base')
  const constructorAlternativeCreated = ref(false)
  const constructorAlternativeProjectIds = ref<Set<string>>(new Set())

  const isConstructorWorkspace = computed(
    () => activeWorkspaceNav.value === 'constructor',
  )

  const isConstructorScenarioLocked = computed(
    () => constructorActiveScenarioId.value === 'base',
  )

  const constructorScenarios = computed<ConstructorScenario[]>(() => {
    const list: ConstructorScenario[] = [
      {
        ...constructorBaseScenario,
        projectsCount: projects.length,
        networkKm: constructorBaseScenario.networkKm,
      },
    ]

    if (constructorAlternativeCreated.value) {
      const count =
        constructorActiveScenarioId.value === 'alternative'
          ? selectedProjectIds.value.size
          : constructorAlternativeProjectIds.value.size

      list.push({
        ...constructorAlternativeScenarioTemplate,
        projectsCount: count,
        networkKm: constructorNetworkKmForProjectsCount(count),
      })
    }

    return list
  })

  const canCreateConstructorScenario = computed(
    () => !constructorAlternativeCreated.value,
  )

  const constructorProjectsSelectionChanged = computed(() => {
    if (isConstructorScenarioLocked.value) {
      return false
    }
    const baseline = constructorBaselineProjectIds.value
    const current = selectedProjectIds.value
    if (baseline.size !== current.size) {
      return true
    }
    for (const id of baseline) {
      if (!current.has(id)) {
        return true
      }
    }
    return false
  })

  function snapshotConstructorProjectBaseline() {
    constructorBaselineProjectIds.value = new Set(selectedProjectIds.value)
  }

  function resetConstructorProjectsToBaseline() {
    if (isConstructorScenarioLocked.value) {
      return
    }
    selectedProjectIds.value = new Set(constructorBaselineProjectIds.value)
    selectedProjectId.value = null
    if (constructorActiveScenarioId.value === 'alternative') {
      constructorAlternativeProjectIds.value = new Set(selectedProjectIds.value)
    }
  }

  function persistAlternativeProjectSelection() {
    if (constructorActiveScenarioId.value === 'alternative') {
      constructorAlternativeProjectIds.value = new Set(selectedProjectIds.value)
    }
  }

  function selectConstructorScenario(id: ConstructorScenarioId) {
    if (id === 'alternative' && !constructorAlternativeCreated.value) {
      return
    }

    if (constructorActiveScenarioId.value === 'alternative') {
      constructorAlternativeProjectIds.value = new Set(selectedProjectIds.value)
    }

    constructorActiveScenarioId.value = id

    if (id === 'base') {
      selectAllProjects()
    } else {
      selectedProjectIds.value = new Set(constructorAlternativeProjectIds.value)
      selectedProjectId.value = null
    }

    snapshotConstructorProjectBaseline()
  }

  function createConstructorAlternativeScenario() {
    if (!canCreateConstructorScenario.value) {
      return
    }
    constructorAlternativeCreated.value = true
    constructorAlternativeProjectIds.value = new Set()
    selectConstructorScenario('alternative')
  }

  function deleteConstructorScenario(id: ConstructorScenarioId) {
    if (id !== 'alternative' || !constructorAlternativeCreated.value) {
      return
    }
    constructorAlternativeCreated.value = false
    constructorAlternativeProjectIds.value = new Set()
    selectConstructorScenario('base')
  }

  const isIndicatorsWorkspace = computed(
    () =>
      workspaceContext.value === 'indicators'
      || activeWorkspaceNav.value === 'indicators',
  )

  const usesMultiProjectSelection = computed(
    () =>
      workspaceContext.value === 'indicators'
      || activeWorkspaceNav.value === 'indicators'
      || activeWorkspaceNav.value === 'ranking'
      || activeWorkspaceNav.value === 'constructor',
  )

  const activeProjectSelectionVariant = computed(() =>
    getEffectiveProjectSelectionVariant(
      projectWorkspaceCardsVariant.value,
      usesMultiProjectSelection.value,
    ),
  )

  const selectedProjectsCount = computed(() => selectedProjectIds.value.size)

  const indicatorsAllProjectsSelected = computed(
    () => selectedProjectIds.value.size === projects.length,
  )

  watch(
    projectWorkspaceCardsVariant,
    (variant) => {
      const legacy = variant as string
      if (
        legacy === 'search'
        || legacy === 'grid'
        || legacy === 'chips'
        || legacy === 'sidebar'
        || legacy === 'picker'
      ) {
        projectWorkspaceCardsVariant.value = 'drawer'
      }
    },
    { immediate: true },
  )

  function selectAllProjects() {
    selectedProjectIds.value = new Set(allProjectIds())
    selectedProjectId.value = null
    persistAlternativeProjectSelection()
  }

  function toggleSelectAllProjects() {
    if (isConstructorWorkspace.value && isConstructorScenarioLocked.value) {
      return
    }
    if (indicatorsAllProjectsSelected.value) {
      selectedProjectIds.value = new Set()
      selectedProjectId.value = null
      persistAlternativeProjectSelection()
      return
    }
    selectAllProjects()
  }

  function setSelectedProjectIds(ids: string[]) {
    selectedProjectIds.value = new Set(ids)
    selectedProjectId.value = ids.length === 1 ? ids[0]! : null
  }

  function toggleIndicatorProject(id: string) {
    if (isConstructorWorkspace.value && isConstructorScenarioLocked.value) {
      return
    }
    const next = new Set(selectedProjectIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedProjectIds.value = next
    selectedProjectId.value = next.size === 1 ? [...next][0]! : null
    persistAlternativeProjectSelection()
  }

  function isProjectSelected(id: string) {
    if (usesMultiProjectSelection.value) {
      return selectedProjectIds.value.has(id)
    }
    return selectedProjectId.value === id
  }

  function openUiVariantsModal() {
    uiVariantsOpen.value = true
  }

  function closeUiVariantsModal() {
    uiVariantsOpen.value = false
  }

  function openIndicatorsWorkspace(
    tabId: ProjectDetailTabId,
    options?: { allProjects?: boolean; projectId?: string },
  ) {
    workspaceContext.value = 'indicators'
    projectWorkspaceOpen.value = true
    activeWorkspaceNav.value = 'indicators'
    activeProjectTab.value = tabId

    if (options?.allProjects) {
      selectAllProjects()
    } else if (options?.projectId) {
      setSelectedProjectIds([options.projectId])
    }
  }

  function openIndicatorFromSidebar(label: IndicatorItemLabel) {
    const tabId = indicatorTabByLabel[label]
    openIndicatorsWorkspace(tabId, { allProjects: true })
  }

  function openProjectWorkspace() {
    workspaceContext.value = 'projects'
    projectWorkspaceOpen.value = true
    activeProjectTab.value = 'overview'
    activeWorkspaceNav.value = 'projects'
  }

  function openRankingWorkspace() {
    workspaceContext.value = 'projects'
    projectWorkspaceOpen.value = true
    activeWorkspaceNav.value = 'ranking'
    activeProjectTab.value = 'overview'
    if (selectedProjectIds.value.size === 0) {
      selectAllProjects()
    }
  }

  function openConstructorWorkspace() {
    workspaceContext.value = 'projects'
    projectWorkspaceOpen.value = true
    activeWorkspaceNav.value = 'constructor'
    activeProjectTab.value = 'overview'
    if (selectedProjectIds.value.size === 0) {
      selectAllProjects()
    }
    constructorActiveScenarioId.value = 'base'
    snapshotConstructorProjectBaseline()
  }

  function openProject(id: string) {
    workspaceContext.value = 'projects'
    projectWorkspaceOpen.value = true
    activeProjectTab.value = 'overview'
    activeWorkspaceNav.value = 'projects'
    setSelectedProjectIds([id])
  }

  function selectProjectCard(id: string) {
    if (usesMultiProjectSelection.value) {
      toggleIndicatorProject(id)
      return
    }
    selectedProjectId.value = selectedProjectId.value === id ? null : id
    selectedProjectIds.value = selectedProjectId.value
      ? new Set([selectedProjectId.value])
      : new Set()
  }

  function selectProject(id: string) {
    setSelectedProjectIds([id])
  }

  function setActiveWorkspaceNav(navId: ProjectWorkspaceNavId) {
    activeWorkspaceNav.value = navId
    projectWorkspaceOpen.value = true

    if (navId === 'indicators') {
      workspaceContext.value = 'indicators'
      if (selectedProjectIds.value.size === 0) {
        selectAllProjects()
      }
      return
    }

    if (navId === 'ranking') {
      workspaceContext.value = 'projects'
      if (selectedProjectIds.value.size === 0) {
        selectAllProjects()
      }
      return
    }

    if (navId === 'constructor') {
      workspaceContext.value = 'projects'
      if (selectedProjectIds.value.size === 0 && constructorActiveScenarioId.value === 'base') {
        selectAllProjects()
      }
      snapshotConstructorProjectBaseline()
      return
    }

    if (navId === 'projects') {
      workspaceContext.value = 'projects'
      if (selectedProjectId.value) {
        setSelectedProjectIds([selectedProjectId.value])
      } else {
        selectedProjectIds.value = new Set()
      }
    }
  }

  function closeProjectWorkspace() {
    selectedProjectId.value = null
    selectAllProjects()
    projectWorkspaceOpen.value = false
    workspaceContext.value = 'projects'
    activeWorkspaceNav.value = 'projects'
    activeProjectTab.value = 'overview'
  }

  return {
    modelYear,
    selectedProjectId,
    selectedProjectIds,
    isIndicatorsWorkspace,
    usesMultiProjectSelection,
    activeProjectSelectionVariant,
    selectedProjectsCount,
    indicatorsAllProjectsSelected,
    isProjectSelected,
    toggleIndicatorProject,
    selectAllProjects,
    toggleSelectAllProjects,
    openIndicatorFromSidebar,
    openIndicatorsWorkspace,
    openProject,
    openProjectWorkspace,
    openRankingWorkspace,
    openConstructorWorkspace,
    selectProjectCard,
    selectProject,
    closeProjectWorkspace,
    setActiveWorkspaceNav,
    projectWorkspaceOpen,
    workspaceContext,
    activeProjectTab,
    activeWorkspaceNav,
    uiVariantsOpen,
    openUiVariantsModal,
    closeUiVariantsModal,
    projectWorkspaceCardsVariant,
    constructorProjectsVariant,
    constructorProjectsSelectionChanged,
    resetConstructorProjectsToBaseline,
    constructorActiveScenarioId,
    constructorScenarios,
    constructorAlternativeCreated,
    canCreateConstructorScenario,
    isConstructorScenarioLocked,
    selectConstructorScenario,
    createConstructorAlternativeScenario,
    deleteConstructorScenario,
    isConstructorWorkspace,
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
