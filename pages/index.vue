<script setup lang="ts">
import { kpiItems } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const { sidebarOpen, kpiLoading } = useDashboardState()

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="desktop-main">
    <DashboardHeader />
    <section class="desktop-main__kpi" aria-label="Ключевые показатели">
      <DashboardKpiCard
        v-for="(item, index) in kpiItems"
        :key="index"
        :item="item"
        :loading="kpiLoading"
      />
    </section>
    <div class="desktop-main__body">
      <button
        type="button"
        class="desktop-main__sidebar-toggle neo-interactive neo-button"
        :aria-expanded="sidebarOpen"
        aria-controls="dashboard-sidebar"
        @click="sidebarOpen = !sidebarOpen"
      >
        Меню
      </button>
      <div
        v-if="sidebarOpen"
        class="desktop-main__backdrop"
        aria-hidden="true"
        @click="closeSidebar"
      />
      <DashboardSidebarAccordion id="dashboard-sidebar" />
      <div class="desktop-main__content">
        <DashboardMapPanel />
        <DashboardMapModelButton />
      </div>
    </div>
    <DashboardYearSlider />
  </div>
</template>

<style scoped>
.desktop-main {
  display: flex;
  flex-direction: column;
  gap: var(--gap-section);
  height: 100vh;
  min-height: 100vh;
  min-width: 320px;
  padding: var(--gap-page);
  background: var(--background-primary);
  box-sizing: border-box;
}

.desktop-main__kpi {
  display: flex;
  gap: var(--gap-kpi);
  flex-shrink: 0;
  height: 116px;
  min-width: 0;
}

.desktop-main__body {
  display: flex;
  flex: 1;
  gap: var(--gap-section);
  min-height: 0;
  position: relative;
}

.desktop-main__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

.desktop-main__sidebar-toggle {
  display: none;
}

.desktop-main__backdrop {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-main__sidebar-toggle {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 16px;
    border-radius: var(--radius-md);
    font: var(--text-sm-regular);
    color: var(--text-primary);
  }

  .desktop-main__backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 4;
    background: rgba(28, 58, 115, 0.25);
  }

  .desktop-main :deep(.sidebar) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
    max-height: 100vh;
    padding: 12px;
    background: var(--background-primary);
    box-shadow: var(--shadow-outer-sidebar);
    transform: translateX(-110%);
    transition: transform var(--transition-base);
  }

  .desktop-main :deep(.sidebar--open) {
    transform: translateX(0);
  }
}

@media (max-width: 640px) {
  .desktop-main__kpi {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: var(--gap-kpi);
    padding-bottom: 4px;
  }

  .desktop-main__kpi :deep(.kpi-card) {
    flex: 0 0 min(280px, 85vw);
    scroll-snap-align: start;
  }
}
</style>
