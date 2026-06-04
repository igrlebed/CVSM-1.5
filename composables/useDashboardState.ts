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
  getEffectiveProjectSelectionVariant,
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

  const isIndicatorsWorkspace = computed(
    () =>
      workspaceContext.value === 'indicators'
      || activeWorkspaceNav.value === 'indicators',
  )

  const activeProjectSelectionVariant = computed(() =>
    getEffectiveProjectSelectionVariant(
      projectWorkspaceCardsVariant.value,
      isIndicatorsWorkspace.value,
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
  }

  function toggleSelectAllProjects() {
    if (indicatorsAllProjectsSelected.value) {
      selectedProjectIds.value = new Set()
      selectedProjectId.value = null
      return
    }
    selectAllProjects()
  }

  function setSelectedProjectIds(ids: string[]) {
    selectedProjectIds.value = new Set(ids)
    selectedProjectId.value = ids.length === 1 ? ids[0]! : null
  }

  function toggleIndicatorProject(id: string) {
    const next = new Set(selectedProjectIds.value)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    selectedProjectIds.value = next
    selectedProjectId.value = next.size === 1 ? [...next][0]! : null
  }

  function isProjectSelected(id: string) {
    if (workspaceContext.value === 'indicators') {
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

  function openProject(id: string) {
    workspaceContext.value = 'projects'
    projectWorkspaceOpen.value = true
    activeProjectTab.value = 'overview'
    activeWorkspaceNav.value = 'projects'
    setSelectedProjectIds([id])
  }

  function selectProjectCard(id: string) {
    if (workspaceContext.value === 'indicators') {
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

    if (navId === 'indicators') {
      workspaceContext.value = 'indicators'
      if (selectedProjectIds.value.size === 0) {
        selectAllProjects()
      }
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
