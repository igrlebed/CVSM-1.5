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
  usesMultiProjectSelection,
  setActiveWorkspaceNav,
} = useDashboardState()

const selectedProject = computed(() =>
  projects.find((p) => p.id === selectedProjectId.value) ?? null,
)

const selectedProjects = computed(() =>
  projects.filter((project) => selectedProjectIds.value.has(project.id)),
)

const isRankingView = computed(() => activeWorkspaceNav.value === 'ranking')
const isConstructorView = computed(() => activeWorkspaceNav.value === 'constructor')

const navTitle = computed(() => {
  if (activeWorkspaceNav.value === 'indicators') {
    return 'Показатели'
  }
  if (activeWorkspaceNav.value === 'ranking') {
    return 'Ранжирование'
  }
  if (activeWorkspaceNav.value === 'constructor') {
    return 'Конструктор'
  }
  return selectedProject.value?.title ?? 'Проекты'
})

const showProjectSelection = computed(
  () =>
    activeWorkspaceNav.value === 'projects'
    || activeWorkspaceNav.value === 'indicators'
    || activeWorkspaceNav.value === 'ranking'
    || activeWorkspaceNav.value === 'constructor',
)

const usesProjectCards = computed(
  () =>
    !isConstructorView.value
    && showProjectSelection.value
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
  usesMultiProjectSelection.value ? 'Выбрать проекты' : 'Выбрать проект',
)

const hasSelection = computed(() => {
  if (usesMultiProjectSelection.value) {
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
    return usesMultiProjectSelection.value
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
          <DashboardWorkspacePillButton
            :label="chooseProjectsLabel"
            aria-haspopup="dialog"
            :aria-expanded="projectDrawerOpen"
            @click="projectDrawerOpen = true"
          />
        </div>
        <h1 v-else class="project-workspace__nav-title">{{ navTitle }}</h1>
      </div>

      <div class="project-workspace__nav-actions">
        <button
          v-for="tab in projectWorkspaceNavTabs"
          :key="tab.id"
          type="button"
          class="project-workspace__nav-pill neo-select-pill neo-interactive neo-button"
          :class="{ 'neo-select-pill--selected': activeWorkspaceNav === tab.id }"
          :aria-current="activeWorkspaceNav === tab.id ? 'page' : undefined"
          @click="setActiveWorkspaceNav(tab.id)"
        >
          <span class="neo-select-pill__bg" aria-hidden="true" />
          <span class="project-workspace__nav-pill-label neo-select-pill__title">{{ tab.label }}</span>
          <span class="neo-select-pill__inset" aria-hidden="true" />
        </button>
        <span class="project-workspace__nav-divider" aria-hidden="true" />
        <DashboardIconButton label="Скачать" size="nav">
          <DashboardDownloadIcon />
        </DashboardIconButton>
      </div>
    </header>

    <DashboardProjectCardsPanel v-if="usesProjectCards" />

    <DashboardProjectTabBar
      v-if="showProjectSelection && !isRankingView && !isConstructorView"
      v-model="activeProjectTab"
      :tabs="projectDetailTabs"
    />

    <DashboardProjectDrawer v-if="usesProjectDrawer" v-model="projectDrawerOpen" />

    <DashboardRankingWorkspace
      v-if="isRankingView && hasSelection"
      class="project-workspace__ranking"
      :projects="selectedProjects"
    />

    <DashboardConstructorWorkspace
      v-else-if="isConstructorView"
      class="project-workspace__constructor"
      :projects="selectedProjects"
    />

    <section
      v-else-if="isRankingView"
      class="project-workspace__body"
      aria-live="polite"
    >
      <p class="project-workspace__empty-title">Проекты не выбраны</p>
      <p class="project-workspace__empty-text">{{ emptyHint }}</p>
    </section>

    <template v-else>

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
    </template>
  </div>
</template>

<style scoped>
.project-workspace {
  --workspace-section-gap: var(--gap-lg);
  /* Совпадает с header: shell-gap + inner padding (Figma 3921:29529 / 29530) */
  --workspace-action-inset-inline: calc(var(--shell-gap) + var(--gap-lg));
  --workspace-nav-pad-block: var(--gap-xs);
  --workspace-nav-pad-inline: var(--workspace-action-inset-inline);
  --workspace-nav-gap: var(--gap-md);
  --workspace-nav-actions-gap: var(--gap-md);
  --workspace-nav-pill-height: var(--workspace-pill-height);
  --workspace-nav-pill-pad: var(--gap-xs);

  display: flex;
  flex-direction: column;
  gap: var(--workspace-section-gap);
  height: 100vh;
  min-height: 100vh;
  padding: var(--gap-page);
  background: var(--background-primary);
  box-sizing: border-box;
  overflow: visible;
}

.project-workspace__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--workspace-nav-gap);
  padding: var(--workspace-nav-pad-block) var(--workspace-nav-pad-inline);
  flex-shrink: 0;
}

.project-workspace__nav-start {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--workspace-nav-gap);
  min-width: 0;
}

.project-workspace__nav-heading {
  display: flex;
  align-items: center;
  gap: var(--workspace-nav-gap);
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

.project-workspace__nav-actions {
  display: flex;
  align-items: center;
  gap: var(--workspace-nav-actions-gap);
  flex-shrink: 0;
}

.project-workspace__nav-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: auto;
  min-width: 132px;
  height: var(--workspace-nav-pill-height);
  padding: var(--workspace-nav-pill-pad) var(--gap-md);
  border-radius: var(--radius-2xl);
  cursor: pointer;
  text-align: center;
}

.project-workspace__nav-pill-label {
  position: relative;
  z-index: 1;
  font: var(--text-md-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  gap: var(--gap-xs);
  min-height: 0;
  text-align: center;
}

.project-workspace__body--table {
  align-items: stretch;
  justify-content: flex-start;
  min-width: 0;
  overflow: hidden;
  text-align: left;
}

.project-workspace__ranking,
.project-workspace__constructor {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
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
    min-width: 112px;
  }
}
</style>
