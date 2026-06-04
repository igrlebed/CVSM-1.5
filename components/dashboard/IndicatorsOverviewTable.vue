<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import {
  getIndicatorsOverviewCell,
  indicatorsOverviewMetrics,
} from '~/mocks/indicatorsOverview'

const props = defineProps<{
  projects: DashboardProject[]
}>()

const { metricColWidth, projectColWidths, tableStyle, layoutStyle } =
  useIndicatorsOverviewColumns(() => props.projects)
</script>

<template>
  <div
    class="indicators-overview"
    role="region"
    aria-label="Сводная таблица показателей"
  >
    <div class="indicators-overview__scroll neo-scroll">
      <div class="indicators-overview__layout" :style="layoutStyle">
        <div class="indicators-overview__head-wrap">
          <table
            class="indicators-overview__table indicators-overview__table--head"
            :style="tableStyle"
          >
            <colgroup>
              <col :style="{ width: `${metricColWidth}px` }">
              <col
                v-for="(project, index) in projects"
                :key="`col-head-${project.id}`"
                :style="{ width: `${projectColWidths[index]}px` }"
              >
            </colgroup>
            <thead>
              <tr>
                <th scope="col" class="indicators-overview__th-metric">
                  Показатель
                </th>
                <th
                  v-for="project in projects"
                  :key="`th-${project.id}`"
                  scope="col"
                  class="indicators-overview__th-project"
                >
                  <span class="indicators-overview__th-project-inner">
                    <DashboardProjectBadge :type="project.type" size="compact" />
                    <span class="indicators-overview__th-title">{{ project.title }}</span>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <div class="indicators-overview__body neo-shell-outer">
          <span class="neo-shell-outer__bg" aria-hidden="true" />
          <div class="indicators-overview__body-inner neo-shell-inner">
            <span class="neo-shell-inner__bg" aria-hidden="true" />
            <div class="neo-shell-inner__content indicators-overview__body-content">
              <table
                class="indicators-overview__table indicators-overview__table--body"
                :style="tableStyle"
              >
                <colgroup>
                  <col :style="{ width: `${metricColWidth}px` }">
                  <col
                    v-for="(project, index) in projects"
                    :key="`col-body-${project.id}`"
                    :style="{ width: `${projectColWidths[index]}px` }"
                  >
                </colgroup>
                <tbody>
                  <tr
                    v-for="metric in indicatorsOverviewMetrics"
                    :key="metric.id"
                    :class="{ 'indicators-overview__row--multiline': metric.multiline }"
                  >
                    <th scope="row" class="indicators-overview__metric">
                      <span class="indicators-overview__metric-label">{{ metric.label }}</span>
                    </th>
                    <td
                      v-for="project in projects"
                      :key="`${metric.id}-${project.id}`"
                      class="indicators-overview__cell"
                    >
                      {{ getIndicatorsOverviewCell(project, metric.id) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <span class="neo-shell-inner__inset" aria-hidden="true" />
          </div>
          <span class="neo-shell-outer__inset" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.indicators-overview {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.indicators-overview__scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.indicators-overview__layout {
  min-width: 100%;
  padding: 0 12px 4px;
  box-sizing: border-box;
}

.indicators-overview__table {
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

.indicators-overview__head-wrap {
  margin-bottom: 6px;
}

.indicators-overview__table--head {
  margin-left: calc(var(--shell-gap) + 8px);
}

.indicators-overview__th-metric,
.indicators-overview__th-project {
  padding: 8px 12px;
}

.indicators-overview__metric,
.indicators-overview__cell {
  padding: 12px;
}

.indicators-overview__body {
  border-radius: var(--radius-4xl);
}

.indicators-overview__body-inner {
  border-radius: var(--radius-3xl);
}

.indicators-overview__body-content {
  padding: 8px;
  box-sizing: border-box;
}

.indicators-overview__th-metric {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  text-align: left;
  vertical-align: bottom;
  background: var(--background-primary);
}

.indicators-overview__table--head th {
  overflow: hidden;
  box-sizing: border-box;
}

.indicators-overview__th-project {
  text-align: left;
  vertical-align: bottom;
  background: var(--background-primary);
}

.indicators-overview__th-project-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.indicators-overview__th-title {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}

.indicators-overview__table--body th,
.indicators-overview__table--body td {
  overflow: hidden;
  box-sizing: border-box;
}

.indicators-overview__metric,
.indicators-overview__cell {
  font: var(--text-md-regular);
  color: var(--text-primary);
  text-align: left;
  vertical-align: middle;
}

.indicators-overview__metric {
  max-width: 269px;
  background: var(--island-inner);
}

.indicators-overview__metric-label {
  display: block;
  font-weight: 400;
  line-height: 20px;
  white-space: normal;
  overflow-wrap: break-word;
}

.indicators-overview__row--multiline .indicators-overview__metric-label {
  max-height: 40px;
  overflow: hidden;
}

.indicators-overview__cell {
  white-space: nowrap;
}

.indicators-overview__table--body tr {
  height: 44px;
}

.indicators-overview__table--body tr.indicators-overview__row--multiline {
  height: 64px;
}
</style>
