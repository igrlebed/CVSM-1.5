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

const { sidebarOpen } = useDashboardState()
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
        <DashboardProjectListButton
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </template>
      <template v-else-if="section.type === 'indicators'">
        <DashboardAccordionTextButton
          v-for="item in indicatorItems"
          :key="item"
          :label="item"
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
}

</style>
