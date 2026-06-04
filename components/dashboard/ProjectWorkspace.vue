<script setup lang="ts">
import { projectDetailTabs, projectWorkspaceNavTabs, projects } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  selectedProjectId,
  selectedProjectIds,
  closeProjectWorkspace,
  activeProjectTab,
  activeWorkspaceNav,
  workspaceContext,
  activeProjectSelectionVariant,
  setActiveWorkspaceNav,
} = useDashboardState()

const selectedProject = computed(() =>
  projects.find((p) => p.id === selectedProjectId.value) ?? null,
)

const selectedProjects = computed(() =>
  projects.filter((project) => selectedProjectIds.value.has(project.id)),
)

const navTitle = computed(() => {
  if (activeWorkspaceNav.value === 'indicators') {
    return 'Показатели'
  }
  return selectedProject.value?.title ?? 'Проекты'
})

const showProjectSelection = computed(
  () =>
    activeWorkspaceNav.value === 'projects' || activeWorkspaceNav.value === 'indicators',
)

const usesProjectCards = computed(
  () =>
    showProjectSelection.value
    && (activeProjectSelectionVariant.value === 'scroll'
      || activeProjectSelectionVariant.value === 'carousel'),
)

const usesNavSelector = computed(
  () =>
    showProjectSelection.value
    && (activeProjectSelectionVariant.value === 'dropdown'
      || activeProjectSelectionVariant.value === 'stepper'
      || activeProjectSelectionVariant.value === 'dropdownStepper'),
)

const usesProjectDrawer = computed(
  () =>
    showProjectSelection.value && activeProjectSelectionVariant.value === 'drawer',
)

const projectDrawerOpen = ref(false)

const chooseProjectsLabel = computed(() =>
  workspaceContext.value === 'indicators' ? 'Выбрать проекты' : 'Выбрать проект',
)

const hasSelection = computed(() => {
  if (activeWorkspaceNav.value === 'indicators') {
    return selectedProjectIds.value.size > 0
  }
  return !!selectedProjectId.value
})

const showIndicatorsOverview = computed(
  () =>
    activeWorkspaceNav.value === 'indicators'
    && activeProjectTab.value === 'overview'
    && selectedProjects.value.length > 0,
)

const activeTabLabel = computed(
  () => projectDetailTabs.find((tab) => tab.id === activeProjectTab.value)?.label ?? '',
)

watch(activeProjectSelectionVariant, () => {
  projectDrawerOpen.value = false
})

const emptyHint = computed(() => {
  if (usesProjectDrawer.value) {
    return workspaceContext.value === 'indicators'
      ? 'Нажмите «Выбрать проекты» и отметьте нужные в панели'
      : 'Нажмите «Выбрать проект» и выберите из списка в панели'
  }
  if (usesNavSelector.value) {
    return 'Выберите проект в элементе управления в шапке'
  }
  return 'Выберите интересующий вас проект из списка выше'
})
</script>

<template>
  <div class="project-workspace">
    <DashboardHeader />

    <header class="project-workspace__nav">
      <div class="project-workspace__nav-start">
        <DashboardIconButton
          label="Назад к карте"
          size="nav"
          @click="closeProjectWorkspace"
        >
          <DashboardArrowLeftIcon />
        </DashboardIconButton>
        <DashboardProjectSelector v-if="usesNavSelector" />
        <div v-else-if="usesProjectDrawer" class="project-workspace__nav-heading">
          <h1 class="project-workspace__nav-title">{{ navTitle }}</h1>
          <button
            type="button"
            class="project-workspace__choose-btn neo-interactive neo-button"
            aria-haspopup="dialog"
            :aria-expanded="projectDrawerOpen"
            @click="projectDrawerOpen = true"
          >
            <span class="project-workspace__choose-btn-bg" aria-hidden="true" />
            <span class="project-workspace__choose-btn-label">{{ chooseProjectsLabel }}</span>
            <span class="project-workspace__choose-btn-inset neo-button-inset" aria-hidden="true" />
          </button>
        </div>
        <h1 v-else class="project-workspace__nav-title">{{ navTitle }}</h1>
      </div>

      <div class="project-workspace__nav-actions">
        <button
          v-for="tab in projectWorkspaceNavTabs"
          :key="tab.id"
          type="button"
          class="project-workspace__nav-pill neo-interactive neo-button"
          :class="{ 'project-workspace__nav-pill--active': activeWorkspaceNav === tab.id }"
          :aria-current="activeWorkspaceNav === tab.id ? 'page' : undefined"
          @click="setActiveWorkspaceNav(tab.id)"
        >
          <span class="project-workspace__nav-pill-bg" aria-hidden="true" />
          <span class="project-workspace__nav-pill-label">{{ tab.label }}</span>
          <span class="project-workspace__nav-pill-inset neo-button-inset" aria-hidden="true" />
        </button>
        <span class="project-workspace__nav-divider" aria-hidden="true" />
        <DashboardIconButton label="Скачать" size="nav">
          <DashboardDownloadIcon />
        </DashboardIconButton>
      </div>
    </header>

    <DashboardProjectCardsPanel v-if="usesProjectCards" />

    <DashboardProjectTabBar
      v-if="showProjectSelection"
      v-model="activeProjectTab"
      :tabs="projectDetailTabs"
    />

    <DashboardProjectDrawer v-if="usesProjectDrawer" v-model="projectDrawerOpen" />

    <section
      class="project-workspace__body"
      :class="{ 'project-workspace__body--table': showIndicatorsOverview }"
      aria-live="polite"
    >
      <DashboardIndicatorsOverviewTable
        v-if="showIndicatorsOverview"
        :projects="selectedProjects"
      />
      <template v-else-if="!hasSelection">
        <p class="project-workspace__empty-title">Проекты не выбраны</p>
        <p class="project-workspace__empty-text">{{ emptyHint }}</p>
      </template>
      <template v-else-if="activeWorkspaceNav === 'projects'">
        <p class="project-workspace__empty-title">{{ selectedProject?.title }}</p>
        <p class="project-workspace__empty-text">
          {{ activeTabLabel }} — контент появится после подключения API.
        </p>
      </template>
      <template v-else>
        <p class="project-workspace__empty-title">{{ activeTabLabel }}</p>
        <p class="project-workspace__empty-text">
          Сводка по {{ selectedProjects.length }}
          {{
            selectedProjects.length === 1 ? 'проекту' : 'проектам'
          }}
          — контент появится после подключения API.
        </p>
      </template>
    </section>
  </div>
</template>

<style scoped>
.project-workspace {
  display: flex;
  flex-direction: column;
  gap: var(--gap-section);
  height: 100vh;
  min-height: 100vh;
  padding: var(--gap-page);
  background: var(--background-primary);
  box-sizing: border-box;
}

.project-workspace__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  flex-shrink: 0;
}

.project-workspace__nav-start {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.project-workspace__nav-pill-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-workspace__nav-pill-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-workspace__nav-heading {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;
}

.project-workspace__nav-title {
  margin: 0;
  font: var(--text-xl-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-workspace__choose-btn {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-xl);
  border-color: var(--border-secondary);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.project-workspace__choose-btn-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-workspace__choose-btn-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-workspace__choose-btn-label {
  position: relative;
  z-index: 1;
  font: var(--text-sm-regular);
  color: var(--accent-primary);
  white-space: nowrap;
}

.project-workspace__nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.project-workspace__nav-pill {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 145px;
  height: 46px;
  padding: 12px;
  border-radius: var(--radius-2xl);
  border-color: var(--border-secondary);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.project-workspace__nav-pill--active {
  border-color: var(--accent-muted-100);
}

.project-workspace__nav-pill--active .project-workspace__nav-pill-bg {
  background: var(--accent-muted-300);
}

.project-workspace__nav-pill--active .project-workspace__nav-pill-inset {
  box-shadow: var(--shadow-inner-deep);
}

.project-workspace__nav-pill-label {
  position: relative;
  z-index: 1;
  font: var(--text-md-medium);
  color: var(--accent-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-workspace__nav-pill--active .project-workspace__nav-pill-label {
  color: var(--text-primary);
}

.project-workspace__nav-divider {
  width: 1px;
  height: 26px;
  border-radius: 999px;
  background: var(--border-primary);
}

.project-workspace__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 0;
  text-align: center;
}

.project-workspace__body--table {
  align-items: stretch;
  justify-content: flex-start;
  text-align: left;
}

.project-workspace__empty-title {
  margin: 0;
  font: var(--text-2xl-medium);
  color: var(--text-primary);
}

.project-workspace__empty-text {
  margin: 0;
  font: var(--text-md-regular);
  color: var(--text-secondary);
}

@media (max-width: 1280px) {
  .project-workspace__nav {
    flex-wrap: wrap;
  }

  .project-workspace__nav-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .project-workspace__nav-pill {
    width: auto;
    min-width: 120px;
  }
}
</style>
