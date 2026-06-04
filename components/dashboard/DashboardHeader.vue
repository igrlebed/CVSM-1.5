<script setup lang="ts">
import { dashboardTitle } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const { openUiVariantsModal } = useDashboardState()
</script>

<template>
  <header class="dashboard-header neo-shell-outer">
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="dashboard-header__inner neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content dashboard-header__content">
        <button
          type="button"
          class="dashboard-header__logo-btn neo-interactive"
          aria-label="Варианты интерфейса"
          @click="openUiVariantsModal"
        >
          <img
            src="/images/logo.svg"
            alt=""
            class="dashboard-header__logo"
            width="45"
            height="24"
          />
        </button>
        <h1 class="dashboard-header__title">{{ dashboardTitle }}</h1>
        <DashboardIconButton label="Выход" icon-src="/images/logout.svg" />
      </div>
      <span class="neo-shell-inner__inset" aria-hidden="true" />
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </header>
</template>

<style scoped>
.dashboard-header {
  flex-shrink: 0;
  height: 56px;
  border-radius: var(--radius-lg);
}

.dashboard-header__inner {
  height: 100%;
  border-radius: var(--radius-md);
}

.dashboard-header__content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
  padding: 0 16px;
}

.dashboard-header__logo-btn {
  display: flex;
  flex-shrink: 0;
  padding: 4px;
  margin: -4px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
}

.dashboard-header__logo-btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.dashboard-header__logo {
  display: block;
}

.dashboard-header__title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
