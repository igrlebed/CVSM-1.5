<script setup lang="ts">
import type { SidebarSectionId } from '~/mocks/dashboard'
import {
  constructorSection,
  indicatorItems,
  projects,
  rankingSection,
  sidebarSections,
} from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

defineProps<{
  id?: string
}>()

const { sidebarOpen, openIndicatorFromSidebar } = useDashboardState()
const openId = ref<SidebarSectionId | null>('projects')

function toggle(id: SidebarSectionId) {
  openId.value = openId.value === id ? null : id
  if (import.meta.client && window.matchMedia('(max-width: 1024px)').matches) {
    sidebarOpen.value = true
  }
}

function infoSection(id: SidebarSectionId) {
  return id === 'ranking' ? rankingSection : constructorSection
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
        <div class="sidebar-projects-scroll neo-scroll" role="list">
          <DashboardProjectListButton
            v-for="project in projects"
            :key="project.id"
            :project="project"
            role="listitem"
          />
        </div>
      </template>
      <template v-else-if="section.type === 'indicators'">
        <DashboardAccordionTextButton
          v-for="item in indicatorItems"
          :key="item"
          :label="item"
          @click="openIndicatorFromSidebar(item)"
        />
      </template>
      <template v-else>
        <DashboardAccordionInfoPanel :section="infoSection(section.id)" />
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
  flex-shrink: 0;
  align-self: stretch;
  min-height: 0;
}

.sidebar :deep(.accordion-item) {
  flex-shrink: 0;
}

.sidebar :deep(.accordion-item--projects.accordion-item--open) {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

.sidebar-projects-scroll {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 10px;
  height: 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  -webkit-overflow-scrolling: touch;
}

.sidebar-projects-scroll :deep(.project-list-button) {
  flex-shrink: 0;
  min-height: 44px;
  height: 44px;
}
</style>
