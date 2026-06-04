<script setup lang="ts">
import { dashboardTitle } from '~/mocks/dashboard'
</script>

<template>
  <header class="dashboard-header">
    <div class="dashboard-header__inner">
      <img
        src="/images/logo.svg"
        alt="РЖД"
        class="dashboard-header__logo"
        width="45"
        height="24"
      />
      <h1 class="dashboard-header__title">{{ dashboardTitle }}</h1>
      <DashboardIconButton label="Выход" icon-src="/images/logout.svg" />
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  flex-shrink: 0;
  height: 56px;
  padding: 4px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background: var(--island-external);
  box-shadow: var(--shadow-outer);
}

.dashboard-header__inner {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  background: var(--island-inner);
  box-shadow: var(--shadow-inner-raised);
}

.dashboard-header__logo {
  flex-shrink: 0;
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
