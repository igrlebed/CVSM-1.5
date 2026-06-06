<script setup lang="ts">
import { projects } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const open = defineModel<boolean>({ required: true })

const {
  selectedProjectId,
  selectedProjectIds,
  selectedProjectsCount,
  usesMultiProjectSelection,
  selectProject,
  toggleSelectAllProjects,
  toggleIndicatorProject,
} = useDashboardState()

const allProjectsCheckState = computed(() => {
  const count = selectedProjectsCount.value
  if (count === 0) {
    return { checked: false, indeterminate: false }
  }
  if (count === projects.length) {
    return { checked: true, indeterminate: false }
  }
  return { checked: false, indeterminate: true }
})

function isDrawerItemActive(projectId: string) {
  if (usesMultiProjectSelection.value) {
    return selectedProjectIds.value.has(projectId)
  }
  return selectedProjectId.value === projectId
}

function close() {
  open.value = false
}

function pickProject(id: string) {
  if (usesMultiProjectSelection.value) {
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

        <nav
          class="project-drawer__list neo-scroll"
          role="listbox"
          :aria-multiselectable="usesMultiProjectSelection || undefined"
          :aria-label="usesMultiProjectSelection ? 'Список проектов (множественный выбор)' : 'Список проектов'"
        >
          <button
            v-if="usesMultiProjectSelection"
            type="button"
            role="option"
            class="project-drawer__item neo-select-pill neo-interactive neo-button"
            :class="{ 'neo-select-pill--selected': allProjectsCheckState.checked }"
            :aria-selected="allProjectsCheckState.checked"
            @click="pickAllProjects"
          >
            <span class="neo-select-pill__bg" aria-hidden="true" />
            <DashboardProjectMultiSelectCheck
              class="project-drawer__item-check"
              :checked="allProjectsCheckState.checked"
              :indeterminate="allProjectsCheckState.indeterminate"
            />
            <span class="project-drawer__item-title neo-select-pill__title">Все проекты</span>
            <span class="neo-select-pill__inset" aria-hidden="true" />
          </button>
          <button
            v-for="project in projects"
            :key="project.id"
            type="button"
            role="option"
            class="project-drawer__item neo-select-pill neo-interactive neo-button"
            :class="{
              'neo-select-pill--selected': isDrawerItemActive(project.id),
            }"
            :aria-selected="isDrawerItemActive(project.id)"
            @click="pickProject(project.id)"
          >
            <span class="neo-select-pill__bg" aria-hidden="true" />
            <DashboardProjectMultiSelectCheck
              v-if="usesMultiProjectSelection"
              class="project-drawer__item-check"
              :checked="isDrawerItemActive(project.id)"
            />
            <span class="project-drawer__item-leading">
              <DashboardProjectBadge :type="project.type" />
            </span>
            <span class="project-drawer__item-title neo-select-pill__title">{{ project.title }}</span>
            <span class="neo-select-pill__inset" aria-hidden="true" />
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
  background: var(--overlay-backdrop);
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
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
}

.project-drawer__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap-md);
  width: 100%;
  height: 44px;
  min-height: 44px;
  padding: 0 var(--gap-md);
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: left;
  background: transparent;
  isolation: isolate;
}

.project-drawer__item:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.project-drawer__item-check,
.project-drawer__item-leading,
.project-drawer__item-title {
  position: relative;
  z-index: 1;
}

.project-drawer__item-check {
  flex-shrink: 0;
}

.project-drawer__item-leading {
  display: inline-flex;
  flex-shrink: 0;
}

.project-drawer__item-title {
  flex: 1;
  min-width: 0;
  font: var(--text-md-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
