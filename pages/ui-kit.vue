<script setup lang="ts">
import { kpiItems } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const { kpiLoading, modelYear } = useDashboardState()

useHead({ title: 'UI Kit — CVSM' })
</script>

<template>
  <div class="ui-kit">
    <header class="ui-kit__header">
      <h1>CVSM UI Kit</h1>
      <NuxtLink to="/">← Дашборд</NuxtLink>
    </header>

    <section class="ui-kit__section">
      <h2>NeoSurface</h2>
      <div class="ui-kit__row">
        <UiNeoSurface depth="outer" :radius="'var(--radius-xl)'" padding="16px" class="ui-kit__demo">
          Outer
        </UiNeoSurface>
        <UiNeoSurface depth="inner" :radius="'var(--radius-xl)'" padding="16px" class="ui-kit__demo">
          Inner
        </UiNeoSurface>
      </div>
    </section>

    <section class="ui-kit__section">
      <h2>KPI</h2>
      <label class="ui-kit__toggle">
        <input v-model="kpiLoading" type="checkbox" />
        Skeleton loading
      </label>
      <div class="ui-kit__kpi-row">
        <DashboardKpiCard :item="kpiItems[0]" :loading="kpiLoading" />
        <DashboardKpiCard :item="kpiItems[1]" :loading="kpiLoading" />
        <DashboardKpiCard :item="kpiItems[0]" size="sm" />
        <DashboardKpiCard :item="kpiItems[3]" size="sm" />
      </div>
    </section>

    <section class="ui-kit__section">
      <h2>Кнопки</h2>
      <div class="ui-kit__row">
        <DashboardIconButton label="Выход" icon-src="/images/logout.svg" />
        <DashboardIconButton label="Добавить сценарий" size="nav">
          <DashboardPlusIcon />
        </DashboardIconButton>
        <DashboardIconButton label="Скачать" size="nav">
          <DashboardDownloadIcon />
        </DashboardIconButton>
        <DashboardAccordionTextButton label="Пассажиропоток" />
      </div>
      <div class="ui-kit__primary-col">
        <DashboardPrimaryButton label="Модель развития сети СМ и ВСМ" size="lg" />
        <DashboardPrimaryButton label="Открыть конструктор" size="md" />
        <DashboardPrimaryButton label="Перейти к ранжированию" size="md" />
      </div>
    </section>

    <section class="ui-kit__section">
      <h2>Таймлайн ({{ modelYear }})</h2>
      <DashboardYearSlider />
    </section>

    <section class="ui-kit__section">
      <h2>Бейджи проектов</h2>
      <div class="ui-kit__row">
        <DashboardProjectBadge type="vsm" />
        <DashboardProjectBadge type="vsm-minsk" />
        <DashboardProjectBadge type="sm" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.ui-kit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ui-kit__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ui-kit__header h1 {
  margin: 0;
  font: var(--text-xl-medium);
}

.ui-kit__section h2 {
  margin: 0 0 12px;
  font: var(--text-md-medium);
}

.ui-kit__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.ui-kit__demo {
  min-width: 120px;
}

.ui-kit__kpi-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 12px;
  height: 116px;
}

.ui-kit__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font: var(--text-sm-regular);
}

.ui-kit__primary-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
  margin-top: 12px;
}
</style>
