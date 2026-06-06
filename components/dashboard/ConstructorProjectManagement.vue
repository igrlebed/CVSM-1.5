<script setup lang="ts">
import { projects } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  constructorProjectsVariant,
  isProjectSelected,
  isConstructorScenarioLocked,
  constructorProjectsSelectionChanged,
  resetConstructorProjectsToBaseline,
} = useDashboardState()

const drawerOpen = ref(false)

const activeVariant = computed(() => constructorProjectsVariant.value)

const selectedProjects = computed(() =>
  projects.filter((project) => isProjectSelected(project.id)),
)

const isDrawerVariant = computed(() => activeVariant.value === 'drawer')
const isReadonlyView = computed(() => isConstructorScenarioLocked.value || isDrawerVariant.value)

const gridProjects = computed(() => {
  if (isDrawerVariant.value) {
    return isConstructorScenarioLocked.value ? projects : selectedProjects.value
  }
  return projects
})

const showDrawerEmpty = computed(
  () => isDrawerVariant.value && !isConstructorScenarioLocked.value && selectedProjects.value.length === 0,
)

const showDrawerActions = computed(
  () => isDrawerVariant.value && !isConstructorScenarioLocked.value,
)

function openDrawer() {
  drawerOpen.value = true
}
</script>

<template>
  <section class="constructor-projects" aria-label="Управление проектами">
    <DashboardWorkspaceSectionHeader title="Управление проектами" size="spacious" sticky>
      <template v-if="showDrawerActions && !showDrawerEmpty" #actions>
        <div class="constructor-projects__actions">
          <DashboardWorkspacePillButton
            label="Добавить проект"
            @click="openDrawer"
          >
            <DashboardPlusIcon />
          </DashboardWorkspacePillButton>
          <DashboardWorkspacePillButton
            v-if="constructorProjectsSelectionChanged"
            label="Сбросить"
            tone="muted"
            @click="resetConstructorProjectsToBaseline"
          />
        </div>
      </template>
    </DashboardWorkspaceSectionHeader>

    <div
      v-if="showDrawerEmpty"
      class="constructor-projects__empty-panel neo-shell-outer"
      role="status"
    >
      <span class="neo-shell-outer__bg" aria-hidden="true" />
      <div class="constructor-projects__empty-inner neo-shell-inner">
        <span class="neo-shell-inner__bg" aria-hidden="true" />
        <div class="neo-shell-inner__content constructor-projects__empty-content">
          <p class="constructor-projects__empty-title">Проекты не добавлены</p>
          <p class="constructor-projects__empty-text">
            Нажмите «Добавить проект» и выберите нужные в дровере
          </p>
          <DashboardWorkspacePillButton
            class="constructor-projects__empty-cta"
            label="Добавить проект"
            @click="openDrawer"
          >
            <DashboardPlusIcon />
          </DashboardWorkspacePillButton>
        </div>
        <span class="neo-shell-inner__inset" aria-hidden="true" />
      </div>
      <span class="neo-shell-outer__inset" aria-hidden="true" />
    </div>

    <div
      v-else
      class="constructor-projects__grid"
      role="list"
    >
      <DashboardConstructorProjectCard
        v-for="project in gridProjects"
        :key="project.id"
        :project="project"
        :selected="isProjectSelected(project.id)"
        :readonly="isReadonlyView"
        compact
        role="listitem"
      />
    </div>

    <DashboardProjectDrawer
      v-if="showDrawerActions"
      v-model="drawerOpen"
    />
  </section>
</template>

<style scoped>
.constructor-projects {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.constructor-projects__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--gap-md);
}

.constructor-projects__empty-cta {
  margin-top: var(--gap-xs);
}

.constructor-projects__empty-panel {
  margin-inline-end: var(--gap-md);
  margin-bottom: var(--gap-md);
  border-radius: var(--radius-4xl);
}

.constructor-projects__empty-inner {
  border-radius: var(--radius-3xl);
}

.constructor-projects__empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-md);
  min-height: var(--constructor-empty-min-height);
  padding: var(--gap-2xl);
  text-align: center;
  box-sizing: border-box;
}

.constructor-projects__empty-title {
  margin: 0;
  font: var(--text-xl-medium);
  color: var(--text-primary);
}

.constructor-projects__empty-text {
  margin: 0;
  max-width: var(--constructor-empty-text-max-width);
  font: var(--text-md-regular);
  color: var(--text-secondary);
}

.constructor-projects__grid {
  display: grid;
  grid-template-columns: repeat(var(--constructor-projects-grid-columns), minmax(0, 1fr));
  gap: var(--gap-kpi-constructor);
  padding-inline-end: var(--gap-md);
  padding-bottom: var(--gap-md);
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .constructor-projects__grid {
    --constructor-projects-grid-columns: 2;
  }
}

@media (max-width: 640px) {
  .constructor-projects__grid {
    --constructor-projects-grid-columns: 1;
  }
}
</style>
