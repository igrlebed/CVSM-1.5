<script setup lang="ts">
import { projects } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const open = defineModel<boolean>({ required: true })

const {
  workspaceContext,
  selectedProjectId,
  selectedProjectIds,
  indicatorsAllProjectsSelected,
  selectProject,
  toggleSelectAllProjects,
  toggleIndicatorProject,
} = useDashboardState()

const isIndicatorsMode = computed(() => workspaceContext.value === 'indicators')

function isDrawerItemActive(projectId: string) {
  if (isIndicatorsMode.value) {
    return selectedProjectIds.value.has(projectId)
  }
  return selectedProjectId.value === projectId
}

function close() {
  open.value = false
}

function pickProject(id: string) {
  if (isIndicatorsMode.value) {
    toggleIndicatorProject(id)
    return
  }
  selectProject(id)
  close()
}

function pickAllProjects() {
  toggleSelectAllProjects()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(open, (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="project-drawer-overlay"
      role="presentation"
      @click="close"
      @keydown="onKeydown"
    >
      <aside
        class="project-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-drawer-title"
        @click.stop
      >
        <header class="project-drawer__head">
          <h2 id="project-drawer-title" class="project-drawer__title">Все проекты</h2>
          <DashboardIconButton label="Закрыть" size="nav" @click="close">
            <DashboardCloseIcon />
          </DashboardIconButton>
        </header>

        <nav class="project-drawer__list neo-scroll" role="listbox" aria-label="Список проектов">
          <button
            v-if="isIndicatorsMode"
            type="button"
            role="option"
            class="project-drawer__item neo-interactive neo-button"
            :class="{ 'project-drawer__item--active': indicatorsAllProjectsSelected }"
            :aria-selected="indicatorsAllProjectsSelected"
            @click="pickAllProjects"
          >
            <span class="project-drawer__item-bg" aria-hidden="true" />
            <span class="project-drawer__item-inset neo-button-inset" aria-hidden="true" />
            <span class="project-drawer__item-title">Все проекты</span>
          </button>
          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            role="option"
            class="project-drawer__item neo-interactive neo-button"
            :class="{ 'project-drawer__item--active': isDrawerItemActive(project.id) }"
            :aria-selected="isDrawerItemActive(project.id)"
            @click="pickProject(project.id)"
          >
            <span class="project-drawer__item-bg" aria-hidden="true" />
            <span class="project-drawer__item-inset neo-button-inset" aria-hidden="true" />
            <span class="project-drawer__item-leading">
              <DashboardProjectBadge :type="project.type" />
            </span>
            <span class="project-drawer__item-title">{{ project.title }}</span>
          </button>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.project-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgb(13 23 76 / 40%);
  backdrop-filter: blur(2px);
}

.project-drawer {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: min(var(--sidebar-width), 100vw);
  height: 100%;
  max-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  background: var(--background-primary);
  box-shadow: var(--shadow-drawer-outer);
  animation: project-drawer-in var(--transition-base) ease forwards;
}

@keyframes project-drawer-in {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

.project-drawer__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
  margin-bottom: 12px;
}

.project-drawer__title {
  margin: 0;
  font: var(--text-xl-medium);
  color: var(--text-primary);
}

.project-drawer__list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow-y: auto;
}

.project-drawer__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-xl);
  border-color: var(--border-secondary);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.project-drawer__item-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-drawer__item-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-drawer__item--active {
  border-color: var(--accent-muted-100);
}

.project-drawer__item--active .project-drawer__item-bg {
  background: var(--accent-muted-300);
}

.project-drawer__item--active .project-drawer__item-inset {
  box-shadow: var(--shadow-inner-deep);
}

.project-drawer__item:hover:not(:disabled) .project-drawer__item-bg {
  background: rgb(78 91 166 / 14%);
}

.project-drawer__item--active:hover:not(:disabled) .project-drawer__item-bg {
  background: rgb(78 91 166 / 18%);
}

.project-drawer__item-leading,
.project-drawer__item-title {
  position: relative;
  z-index: 1;
}

.project-drawer__item-leading {
  display: inline-flex;
  flex-shrink: 0;
}

.project-drawer__item-title {
  flex: 1;
  min-width: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
}
</style>
