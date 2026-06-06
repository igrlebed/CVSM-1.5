<script setup lang="ts">
import type { DashboardProject } from '~/mocks/dashboard'
import type { ProjectsOverviewGroup, ProjectsOverviewRow } from '~/types/projectsOverview'
import {
  PROJECTS_OVERVIEW_METRIC_COL_INDICATORS,
  PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS,
  useProjectsOverviewColumns,
} from '~/composables/useProjectsOverviewColumns'

const props = withDefaults(
  defineProps<{
    projects: DashboardProject[]
    metricLabel: string
    rows?: ProjectsOverviewRow[]
    groups?: ProjectsOverviewGroup[]
    variant?: 'indicators' | 'ranking'
    metricColWidth?: number
    projectColMin?: number
    projectHeaderExtra?: (project: DashboardProject) => string | undefined
    ariaLabel: string
  }>(),
  {
    variant: 'indicators',
    metricColWidth: PROJECTS_OVERVIEW_METRIC_COL_INDICATORS,
    projectColMin: PROJECTS_OVERVIEW_PROJECT_COL_MIN_INDICATORS,
  },
)

const openGroups = ref<Record<string, boolean>>({})

watch(
  () => props.groups,
  (groups) => {
    if (!groups?.length) return
    openGroups.value = Object.fromEntries(groups.map((group) => [group.id, true]))
  },
  { immediate: true },
)

function toggleGroup(id: string) {
  openGroups.value[id] = !openGroups.value[id]
}

const { metricColWidth, projectColWidths, tableStyle, layoutStyle } =
  useProjectsOverviewColumns(
    () => props.projects,
    () => ({
      metricColWidth: props.metricColWidth,
      projectColMin: props.projectColMin,
      rows: props.rows,
      groups: props.groups,
      variant: props.variant,
      projectHeaderExtra: props.projectHeaderExtra,
    }),
  )
</script>

<template>
  <div
    class="projects-overview"
    role="region"
    :aria-label="ariaLabel"
  >
    <div class="projects-overview__x-scroll neo-scroll">
      <div class="projects-overview__layout" :style="layoutStyle">
        <div class="projects-overview__head-wrap">
          <table
            class="projects-overview__table projects-overview__table--head"
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
                <th scope="col" class="projects-overview__th-metric">
                  {{ metricLabel }}
                </th>
                <th
                  v-for="project in projects"
                  :key="`th-${project.id}`"
                  scope="col"
                  class="projects-overview__th-project"
                >
                  <span class="projects-overview__th-project-inner">
                    <DashboardProjectBadge :type="project.type" size="compact" />
                    <span class="projects-overview__th-title">
                      {{ project.title }}
                    </span>
                    <span
                      v-if="projectHeaderExtra?.(project)"
                      class="projects-overview__th-extra"
                    >
                      {{ projectHeaderExtra(project) }}
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
          </table>
        </div>

        <div class="projects-overview__body neo-shell-outer">
          <span class="neo-shell-outer__bg" aria-hidden="true" />
          <div class="projects-overview__body-inner neo-shell-inner">
            <span class="neo-shell-inner__bg" aria-hidden="true" />
            <div class="neo-shell-inner__content projects-overview__body-content">
              <div class="projects-overview__body-scroll neo-scroll">
              <table
                class="projects-overview__table projects-overview__table--body"
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
                <tbody v-if="groups?.length">
                  <template v-for="group in groups" :key="group.id">
                    <tr class="projects-overview__group-row">
                      <th scope="row" class="projects-overview__group-head" colspan="1">
                        <button
                          type="button"
                          class="projects-overview__group-toggle"
                          :aria-expanded="openGroups[group.id]"
                          @click="toggleGroup(group.id)"
                        >
                          <span class="projects-overview__group-toggle-label">{{ group.title }}</span>
                          <DashboardAccordionChevron :up="openGroups[group.id]" />
                        </button>
                      </th>
                      <td
                        v-for="project in projects"
                        :key="`${group.id}-spacer-${project.id}`"
                        class="projects-overview__group-spacer"
                        aria-hidden="true"
                      />
                    </tr>
                    <tr class="projects-overview__group-panel-row">
                      <td
                        :colspan="projects.length + 1"
                        class="projects-overview__group-panel-cell"
                      >
                        <UiNeoCollapse :open="!!openGroups[group.id]">
                          <table
                            class="projects-overview__table projects-overview__table--body projects-overview__table--group"
                            :style="tableStyle"
                          >
                            <colgroup>
                              <col :style="{ width: `${metricColWidth}px` }">
                              <col
                                v-for="(project, index) in projects"
                                :key="`${group.id}-col-${project.id}`"
                                :style="{ width: `${projectColWidths[index]}px` }"
                              >
                            </colgroup>
                            <tbody>
                              <tr
                                v-for="row in group.rows"
                                :key="row.id"
                                :class="{
                                  'projects-overview__row--multiline': row.multiline,
                                  'projects-overview__row--emphasis': row.emphasis,
                                }"
                              >
                                <th scope="row" class="projects-overview__metric">
                                  <span class="projects-overview__metric-label">{{ row.label }}</span>
                                </th>
                                <td
                                  v-for="project in projects"
                                  :key="`${row.id}-${project.id}`"
                                  class="projects-overview__cell"
                                >
                                  {{ row.values[project.id] ?? '—' }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </UiNeoCollapse>
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tbody v-else>
                  <tr
                    v-for="row in rows"
                    :key="row.id"
                    :class="{ 'projects-overview__row--multiline': row.multiline }"
                  >
                    <th scope="row" class="projects-overview__metric">
                      <span class="projects-overview__metric-label">{{ row.label }}</span>
                    </th>
                    <td
                      v-for="project in projects"
                      :key="`${row.id}-${project.id}`"
                      class="projects-overview__cell"
                    >
                      {{ row.values[project.id] ?? '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
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
.projects-overview {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.projects-overview__x-scroll {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.projects-overview__layout {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  min-width: 100%;
  overflow: hidden;
  padding: 0 0 var(--gap-3xs);
  box-sizing: border-box;
}

.projects-overview__body {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-4xl);
}

.projects-overview__body-inner {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-3xl);
}

.projects-overview__body-content {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: var(--gap-xs);
  box-sizing: border-box;
}

.projects-overview__body-scroll {
  flex: 1 1 0;
  width: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.projects-overview__table {
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

.projects-overview__head-wrap {
  flex-shrink: 0;
  width: 100%;
  margin-bottom: var(--gap-2xs);
  box-sizing: border-box;
  padding-left: var(--workspace-shell-head-inset);
}

.projects-overview__table--head {
  margin-left: 0;
}

.projects-overview__th-metric,
.projects-overview__th-project,
.projects-overview__metric,
.projects-overview__cell,
.projects-overview__group-head,
.projects-overview__group-spacer {
  padding: 12px;
}

.projects-overview__th-metric,
.projects-overview__th-project {
  padding: 8px 12px;
}

.projects-overview__th-metric {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  text-align: left;
  vertical-align: bottom;
  background: var(--background-primary);
}

.projects-overview__table--head th {
  overflow: hidden;
  box-sizing: border-box;
}

.projects-overview__th-project {
  text-align: left;
  vertical-align: bottom;
  background: var(--background-primary);
}

.projects-overview__th-project-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.projects-overview__th-title {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}

.projects-overview__th-extra {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: pre;
}

.projects-overview__table--body th,
.projects-overview__table--body td {
  overflow: hidden;
  box-sizing: border-box;
}

.projects-overview__metric,
.projects-overview__cell {
  font: var(--text-md-regular);
  color: var(--text-primary);
  text-align: left;
  vertical-align: middle;
}

.projects-overview__metric {
  background: var(--island-inner);
}

.projects-overview__metric-label {
  display: block;
  font-weight: 400;
  line-height: 20px;
  white-space: normal;
  overflow-wrap: break-word;
}

.projects-overview__row--multiline .projects-overview__metric-label {
  max-height: 40px;
  overflow: hidden;
}

.projects-overview__cell {
  white-space: nowrap;
}

.projects-overview__table--body tr {
  height: 44px;
}

.projects-overview__table--body tr.projects-overview__row--multiline {
  height: 64px;
}

.projects-overview__group-row {
  height: 44px;
}

.projects-overview__group-head {
  background: var(--island-inner);
}

.projects-overview__group-spacer {
  background: var(--island-inner);
}

.projects-overview__group-panel-row {
  height: auto;
}

.projects-overview__group-panel-cell {
  padding: 0;
  border: none;
  background: var(--island-inner);
  vertical-align: top;
}

.projects-overview__table--group {
  width: 100%;
}

.projects-overview__group-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font: var(--text-md-medium);
  font-weight: 400;
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  transition:
    color var(--transition-fast),
    font-weight var(--transition-fast);
}

.projects-overview__group-toggle:hover {
  color: var(--text-primary);
  font-weight: 500;
}

.projects-overview__group-toggle-label {
  min-width: 0;
}

.projects-overview__group-toggle :deep(.accordion-chevron) {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: currentColor;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.projects-overview__group-toggle:hover :deep(.accordion-chevron) {
  transform: scale(1.12);
}

.projects-overview__row--emphasis .projects-overview__metric,
.projects-overview__row--emphasis .projects-overview__cell {
  font: var(--text-md-medium);
}
</style>
