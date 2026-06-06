<script setup lang="ts">
import type { SidebarSectionId } from '~/mocks/dashboard'
import {
  constructorSection,
  indicatorItems,
  projects,
  rankingSection,
  referenceSection,
  sidebarSections,
} from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

defineProps<{
  id?: string
}>()

const { sidebarOpen, openIndicatorFromSidebar, openRankingWorkspace, openConstructorWorkspace } =
  useDashboardState()
const openId = ref<SidebarSectionId | null>(null)

function toggle(id: SidebarSectionId) {
  openId.value = openId.value === id ? null : id
  if (import.meta.client && window.matchMedia('(max-width: 1024px)').matches) {
    sidebarOpen.value = true
  }
}

function onInfoAction(id: SidebarSectionId) {
  if (id === 'ranking') {
    openRankingWorkspace()
  }
  if (id === 'constructor') {
    openConstructorWorkspace()
  }
}

function infoSection(id: SidebarSectionId) {
  switch (id) {
    case 'ranking':
      return rankingSection
    case 'reference':
      return referenceSection
    default:
      return constructorSection
  }
}
</script>

<template>
  <aside
    :id="id"
    class="sidebar"
    :class="{ 'sidebar--open': sidebarOpen }"
    aria-label="Панель навигации"
  >
    <DashboardAccordionItem
      v-for="section in sidebarSections"
      :key="section.id"
      :title="section.title"
      :type="section.type"
      :open="openId === section.id"
      @toggle="toggle(section.id)"
    >
      <template v-if="section.type === 'projects'">
        <div class="sidebar-projects-viewport neo-scroll-viewport">
          <div class="sidebar-projects-scroll neo-scroll">
            <div class="sidebar-projects-list" role="list">
              <DashboardProjectListButton
                v-for="project in projects"
                :key="project.id"
                :project="project"
                role="listitem"
              />
            </div>
          </div>
          <span
            class="neo-scroll-fade neo-scroll-fade--bottom sidebar-projects-fade"
            aria-hidden="true"
          />
        </div>
      </template>
      <template v-else-if="section.type === 'indicators'">
        <div class="sidebar-section-content sidebar-section-content--indicators">
          <DashboardAccordionTextButton
            v-for="item in indicatorItems"
            :key="item"
            :label="item"
            @click="openIndicatorFromSidebar(item)"
          />
        </div>
      </template>
      <template v-else>
        <div class="sidebar-section-content sidebar-section-content--info">
          <DashboardAccordionInfoPanel
            :section="infoSection(section.id)"
            @action="onInfoAction(section.id)"
          />
        </div>
      </template>
    </DashboardAccordionItem>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: var(--sidebar-width);
  max-width: var(--sidebar-width);
  flex-shrink: 0;
  align-self: stretch;
  min-height: 0;
}

.sidebar :deep(.accordion-item) {
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
}

.sidebar :deep(.accordion-item--projects.accordion-item--open) {
  flex: 1 1 0;
  min-height: 0;
}

.sidebar-projects-viewport {
  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
}

.sidebar-projects-scroll {
  flex: 1 1 0;
  height: 0;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.sidebar-projects-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  /* Figma 3764:22214 — body px 8px + запас под fade */
  padding: 0 8px 24px;
}

.sidebar-projects-fade {
  --scroll-fade-color: var(--background-primary);
  border-radius: 0 0 calc(var(--radius-3xl) - 1px) calc(var(--radius-3xl) - 1px);
}

.sidebar-projects-list :deep(.project-list-button) {
  flex-shrink: 0;
  min-height: 44px;
  height: 44px;
}

.sidebar-section-content--indicators {
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  padding: 0 var(--gap-xs) var(--gap-md);
}

.sidebar-section-content--info {
  display: flex;
  flex-direction: column;
  gap: var(--gap-lg);
  padding: 0 var(--gap-lg) var(--gap-2xl);
  align-items: center;
}
</style>
