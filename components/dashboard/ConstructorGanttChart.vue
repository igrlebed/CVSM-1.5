<script setup lang="ts">
import type {
  GanttMilestone,
  GanttPhaseBar,
  GanttProjectSchedule,
  GanttSegment,
} from '~/mocks/constructor'
import {
  constructorGanttYears,
  GANTT_START_YEAR,
  timelineLeftPercent,
  timelineWidthPercent,
} from '~/mocks/constructor'
import type { ProjectType } from '~/mocks/dashboard'

const props = defineProps<{
  schedules: GanttProjectSchedule[]
}>()

const expandedIds = ref<Set<string>>(new Set())

watch(
  () => props.schedules,
  (list) => {
    const ids = new Set<string>()
    for (const schedule of list) {
      collectSegmentIds(schedule.segments, ids)
    }
    expandedIds.value = ids
  },
  { immediate: true },
)

function collectSegmentIds(segments: GanttSegment[], ids: Set<string>) {
  for (const segment of segments) {
    ids.add(segment.id)
    if (segment.children) {
      collectSegmentIds(segment.children, ids)
    }
  }
}

function toggleSegment(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

const allExpandableIds = computed(() => {
  const ids = new Set<string>()
  for (const schedule of props.schedules) {
    collectSegmentIds(schedule.segments, ids)
  }
  return ids
})

const allCollapsed = computed(() => expandedIds.value.size === 0)

function collapseAll() {
  expandedIds.value = new Set()
}

function expandAll() {
  expandedIds.value = new Set(allExpandableIds.value)
}

function toggleAllSegments() {
  if (allCollapsed.value) {
    expandAll()
  } else {
    collapseAll()
  }
}

function projectLineColor(type: ProjectType) {
  if (type === 'sm') return 'var(--project-sm)'
  if (type === 'vsm-minsk') return 'var(--project-vsm-minsk)'
  return 'var(--project-vsm)'
}

function phaseLabel(item: GanttPhaseBar | GanttMilestone) {
  if (item.type === 'pir') return 'ПИР'
  if (item.type === 'smr') return 'СМР'
  return 'Ввод в эксплуатацию'
}

function labelClass(depth: number, isPhase: boolean) {
  return {
    'constructor-gantt__label--phase': isPhase,
    'constructor-gantt__label--header': !isPhase,
    [`constructor-gantt__label--depth-${depth}`]: true,
  }
}

function titleClass(depth: number) {
  return {
    'constructor-gantt__row-title--sub': depth > 0,
  }
}

function showInternationalTag(schedule: GanttProjectSchedule, segment: GanttSegment) {
  return schedule.type === 'vsm-minsk' && segment.depth === 0
}

function barStyle(bar: GanttPhaseBar) {
  return {
    left: `${timelineLeftPercent(bar.start)}%`,
    width: `${timelineWidthPercent(bar.start, bar.end)}%`,
  }
}

function lastSmrBar(phases: Array<GanttPhaseBar | GanttMilestone> | undefined) {
  if (!phases) return undefined
  const smrBars = phases.filter((phase): phase is GanttPhaseBar => phase.type === 'smr')
  return smrBars[smrBars.length - 1]
}

/** Ввод в эксплуатацию — сразу после последнего бара СМР (Figma 3931:32700) */
function milestoneStyle(phases: Array<GanttPhaseBar | GanttMilestone> | undefined) {
  const smr = lastSmrBar(phases)
  const at = smr?.end ?? GANTT_START_YEAR
  return {
    left: `${timelineLeftPercent(at)}%`,
  }
}

function periodLineStyle(period: GanttSegment['period']) {
  if (!period) return {}
  return {
    left: `${period.start * 100}%`,
    width: `${(period.end - period.start) * 100}%`,
  }
}
</script>

<template>
  <section class="constructor-gantt" aria-label="График реализации проектов">
    <DashboardWorkspaceSectionHeader title="График реализации проектов" size="spacious">
      <template #actions>
        <span class="constructor-gantt__expert">Экспертная оценка</span>
      </template>
    </DashboardWorkspaceSectionHeader>

    <div class="constructor-gantt__chart">
      <div class="constructor-gantt__head-wrap">
        <div class="constructor-gantt__head-row">
          <span class="constructor-gantt__head-spacer" aria-hidden="true" />
          <div class="constructor-gantt__label-head">
            <span class="constructor-gantt__head-title">Проекты</span>
            <button
              v-if="schedules.length > 0"
              type="button"
              class="constructor-gantt__collapse-all"
              @click="toggleAllSegments"
            >
              <DashboardAccordionChevron :up="!allCollapsed" />
              <span>{{ allCollapsed ? 'Развернуть все' : 'Свернуть все' }}</span>
            </button>
          </div>
          <div class="constructor-gantt__years" role="presentation">
            <span
              v-for="year in constructorGanttYears"
              :key="year"
              class="constructor-gantt__year"
            >{{ year }}</span>
          </div>
        </div>
      </div>

      <div class="constructor-gantt__panel neo-shell-outer">
        <span class="neo-shell-outer__bg" aria-hidden="true" />
        <div class="constructor-gantt__inner neo-shell-inner">
          <span class="neo-shell-inner__bg" aria-hidden="true" />
          <div class="neo-shell-inner__content constructor-gantt__body-content">
            <div v-if="schedules.length === 0" class="constructor-gantt__empty">
              Выберите проекты в блоке «Управление проектами»
            </div>

            <div v-else class="constructor-gantt__table-inner neo-scroll">
              <div
                v-for="schedule in schedules"
                :key="schedule.projectId"
                class="constructor-gantt__section"
              >
                <template v-for="segment in schedule.segments" :key="segment.id">
                  <div class="constructor-gantt__segment">
                    <div class="constructor-gantt__row constructor-gantt__row--header neo-data-table__grid-row">
                      <button
                        v-if="segment.expandable"
                        type="button"
                        class="constructor-gantt__label constructor-gantt__label--toggle"
                        :class="labelClass(segment.depth, false)"
                        :aria-expanded="isExpanded(segment.id)"
                        @click="toggleSegment(segment.id)"
                      >
                        <DashboardAccordionChevron :up="isExpanded(segment.id)" />
                        <span
                          class="constructor-gantt__title-group"
                          :class="{ 'constructor-gantt__title-group--tagged': showInternationalTag(schedule, segment) }"
                        >
                          <span
                            class="constructor-gantt__row-title"
                            :class="titleClass(segment.depth)"
                          >{{ segment.title }}</span>
                          <span
                            v-if="showInternationalTag(schedule, segment)"
                            class="constructor-gantt__row-tag"
                          >Международный</span>
                        </span>
                      </button>
                      <div
                        v-else
                        class="constructor-gantt__label"
                        :class="labelClass(segment.depth, false)"
                      >
                        <span
                          class="constructor-gantt__title-group"
                          :class="{ 'constructor-gantt__title-group--tagged': showInternationalTag(schedule, segment) }"
                        >
                          <span
                            class="constructor-gantt__row-title"
                            :class="titleClass(segment.depth)"
                          >{{ segment.title }}</span>
                          <span
                            v-if="showInternationalTag(schedule, segment)"
                            class="constructor-gantt__row-tag"
                          >Международный</span>
                        </span>
                      </div>
                      <div class="constructor-gantt__track constructor-gantt__track--header">
                        <div class="constructor-gantt__track-canvas">
                          <div
                            v-if="segment.period"
                            class="constructor-gantt__period"
                            :style="periodLineStyle(segment.period)"
                          >
                            <span class="constructor-gantt__period-text">
                              <span class="constructor-gantt__period-range">
                                {{ segment.period.startLabel }} – {{ segment.period.endLabel }}
                              </span>
                              <span class="constructor-gantt__period-months">
                                ({{ segment.period.months }} мес.)
                              </span>
                            </span>
                            <span
                              class="constructor-gantt__period-line"
                              :style="{ background: projectLineColor(schedule.type) }"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <UiNeoCollapse v-if="segment.expandable" :open="isExpanded(segment.id)">
                      <div class="constructor-gantt__stages">
                      <div
                        v-for="(phase, phaseIndex) in segment.phases"
                        :key="`${segment.id}-phase-${phaseIndex}`"
                        class="constructor-gantt__row neo-data-table__grid-row"
                      >
                        <div
                          class="constructor-gantt__label"
                          :class="labelClass(segment.depth, true)"
                        >
                          <span class="constructor-gantt__phase-name">{{ phaseLabel(phase) }}</span>
                        </div>
                        <div class="constructor-gantt__track constructor-gantt__track--phase">
                          <div class="constructor-gantt__track-inner" />
                          <div class="constructor-gantt__track-canvas">
                            <div
                              v-if="phase.type === 'pir' || phase.type === 'smr'"
                              class="constructor-gantt__bar"
                              :class="`constructor-gantt__bar--${phase.type}`"
                              :style="barStyle(phase)"
                            >
                              <span class="constructor-gantt__bar-chip">
                                <span class="constructor-gantt__bar-label">{{ phase.durationMonths }} мес.</span>
                              </span>
                            </div>
                            <div
                              v-else
                              class="constructor-gantt__milestone"
                              :style="milestoneStyle(segment.phases)"
                            >
                              <span class="constructor-gantt__milestone-marker" />
                              <span class="constructor-gantt__bar-label">{{ phase.durationMonths }} мес.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <template v-if="segment.children">
                        <div
                          v-for="child in segment.children"
                          :key="child.id"
                          class="constructor-gantt__child"
                        >
                          <div class="constructor-gantt__row constructor-gantt__row--header neo-data-table__grid-row">
                            <button
                              v-if="child.expandable"
                              type="button"
                              class="constructor-gantt__label constructor-gantt__label--toggle"
                              :class="labelClass(child.depth, false)"
                              :aria-expanded="isExpanded(child.id)"
                              @click="toggleSegment(child.id)"
                            >
                              <DashboardAccordionChevron :up="isExpanded(child.id)" />
                              <span
                                class="constructor-gantt__row-title"
                                :class="titleClass(child.depth)"
                              >{{ child.title }}</span>
                            </button>
                            <div
                              v-else
                              class="constructor-gantt__label"
                              :class="labelClass(child.depth, false)"
                            >
                              <span
                                class="constructor-gantt__row-title"
                                :class="titleClass(child.depth)"
                              >{{ child.title }}</span>
                            </div>
                            <div class="constructor-gantt__track constructor-gantt__track--header">
                              <div class="constructor-gantt__track-canvas">
                                <div
                                  v-if="child.period"
                                  class="constructor-gantt__period"
                                  :style="periodLineStyle(child.period)"
                                >
                                  <span class="constructor-gantt__period-text">
                                    <span class="constructor-gantt__period-range">
                                      {{ child.period.startLabel }} – {{ child.period.endLabel }}
                                    </span>
                                    <span class="constructor-gantt__period-months">
                                      ({{ child.period.months }} мес.)
                                    </span>
                                  </span>
                                  <span
                                    class="constructor-gantt__period-line"
                                    :style="{ background: projectLineColor(schedule.type) }"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <UiNeoCollapse v-if="child.expandable" :open="isExpanded(child.id)">
                            <div class="constructor-gantt__stages">
                            <div
                              v-for="(phase, phaseIndex) in child.phases"
                              :key="`${child.id}-phase-${phaseIndex}`"
                              class="constructor-gantt__row neo-data-table__grid-row"
                            >
                              <div
                                class="constructor-gantt__label"
                                :class="labelClass(child.depth, true)"
                              >
                                <span class="constructor-gantt__phase-name">{{ phaseLabel(phase) }}</span>
                              </div>
                              <div class="constructor-gantt__track constructor-gantt__track--phase">
                                <div class="constructor-gantt__track-inner" />
                                <div class="constructor-gantt__track-canvas">
                                  <div
                                    v-if="phase.type === 'pir' || phase.type === 'smr'"
                                    class="constructor-gantt__bar"
                                    :class="`constructor-gantt__bar--${phase.type}`"
                                    :style="barStyle(phase)"
                                  >
                                    <span class="constructor-gantt__bar-chip">
                                      <span class="constructor-gantt__bar-label">{{ phase.durationMonths }} мес.</span>
                                    </span>
                                  </div>
                                  <div
                                    v-else
                                    class="constructor-gantt__milestone"
                                    :style="milestoneStyle(child.phases)"
                                  >
                                    <span class="constructor-gantt__milestone-marker" />
                                    <span class="constructor-gantt__bar-label">{{ phase.durationMonths }} мес.</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            </div>
                          </UiNeoCollapse>
                        </div>
                      </template>
                      </div>
                    </UiNeoCollapse>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <span class="neo-shell-inner__inset" aria-hidden="true" />
        </div>
        <span class="neo-shell-outer__inset" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.constructor-gantt {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  height: var(--constructor-gantt-min-height);
  min-height: var(--constructor-gantt-min-height);
  overflow: hidden;
  box-sizing: border-box;
  background: var(--background-primary);
  isolation: isolate;
}

.constructor-gantt__expert {
  font: var(--text-md-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}

.constructor-gantt__chart {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--gap-3xs);
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 0 var(--shell-gap);
  margin: 0;
}

.constructor-gantt__head-wrap {
  flex-shrink: 0;
  width: 100%;
}

.constructor-gantt__panel {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-4xl);
}

.constructor-gantt__inner {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-3xl);
}

.constructor-gantt__body-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: var(--gap-xs);
  box-sizing: border-box;
}

.constructor-gantt__head-row,
.constructor-gantt__row {
  display: grid;
  grid-template-columns: var(--gantt-label-width) minmax(0, 1fr);
  gap: var(--gantt-column-gap);
  align-items: center;
  min-height: 32px;
}

.constructor-gantt__row.neo-data-table__grid-row {
  border-radius: var(--radius-sm);
}

.constructor-gantt__head-row {
  min-height: 48px;
  grid-template-columns: var(--gantt-subhead-inset) var(--gantt-label-width) minmax(0, 1fr);
}

.constructor-gantt__head-spacer {
  display: block;
}

.constructor-gantt__label-head {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--gap-xs);
  box-sizing: border-box;
  width: var(--gantt-label-width);
  padding: var(--gap-xs) var(--gap-md) var(--gap-xs) var(--gantt-label-indent);
}

.constructor-gantt__head-title {
  flex: 1;
  min-width: 0;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.constructor-gantt__collapse-all {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--gap-3xs);
  padding: 0;
  border: none;
  background: none;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    color var(--transition-fast),
    font-weight var(--transition-fast);
}

.constructor-gantt__collapse-all:hover {
  color: var(--text-primary);
  font-weight: 500;
}

.constructor-gantt__collapse-all :deep(.accordion-chevron) {
  width: 14px;
  height: 14px;
  color: currentColor;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.constructor-gantt__collapse-all:hover :deep(.accordion-chevron) {
  transform: scale(1.12);
}

.constructor-gantt__years {
  display: grid;
  grid-template-columns: repeat(11, minmax(0, 1fr));
  gap: 1px;
  box-sizing: border-box;
  padding-inline: var(--gantt-track-inset);
}

.constructor-gantt__year {
  padding: var(--gap-md) var(--gap-xs);
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.constructor-gantt__table-inner {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--gap-xs);
  min-height: 0;
  overflow: auto;
}

.constructor-gantt__empty {
  padding: var(--gap-2xl);
  font: var(--text-md-regular);
  color: var(--text-secondary);
  text-align: center;
}

.constructor-gantt__section {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  background: var(--background-primary);
}

.constructor-gantt__stages {
  display: flex;
  flex-direction: column;
  gap: var(--gap-3xs);
}

.constructor-gantt__row--header {
  min-height: 36px;
}

.constructor-gantt__label {
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
  min-width: 0;
}

.constructor-gantt__label--header.constructor-gantt__label--depth-0 {
  padding: var(--gap-xs) var(--gap-md);
}

.constructor-gantt__label--header:not(.constructor-gantt__label--depth-0) {
  padding: var(--gap-xs) var(--gap-md) var(--gap-xs) var(--gantt-label-indent);
}

.constructor-gantt__label--phase.constructor-gantt__label--depth-0 {
  padding: var(--gap-xs) var(--gap-md) var(--gap-xs) var(--gantt-label-indent);
}

.constructor-gantt__label--phase.constructor-gantt__label--depth-1 {
  padding: var(--gap-xs) var(--gap-md) var(--gap-xs) var(--gantt-label-indent-deep);
}

.constructor-gantt__label--toggle {
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: var(--text-secondary);
  transition:
    color var(--transition-fast),
    font-weight var(--transition-fast);
}

.constructor-gantt__label--toggle:hover {
  color: var(--text-primary);
}

.constructor-gantt__label--toggle .constructor-gantt__row-title:not(.constructor-gantt__row-title--sub) {
  color: var(--text-primary);
}

.constructor-gantt__label--toggle .constructor-gantt__row-title {
  transition:
    color var(--transition-fast),
    font-weight var(--transition-fast);
}

.constructor-gantt__label--toggle:hover .constructor-gantt__row-title--sub {
  color: var(--text-primary);
  font-weight: 500;
}

.constructor-gantt__label--toggle :deep(.accordion-chevron) {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: currentColor;
  transition:
    color var(--transition-fast),
    transform var(--transition-fast);
}

.constructor-gantt__label--toggle:hover :deep(.accordion-chevron) {
  transform: scale(1.12);
}

.constructor-gantt__title-group {
  display: flex;
  min-width: 0;
  align-items: center;
}

.constructor-gantt__title-group--tagged {
  gap: var(--gap-md);
}

.constructor-gantt__row-title {
  font: var(--text-md-medium);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.constructor-gantt__row-title--sub {
  font: var(--text-sm-regular);
  font-weight: 400;
  color: var(--text-secondary);
}

.constructor-gantt__row-tag {
  flex-shrink: 0;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.constructor-gantt__phase-name {
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.constructor-gantt__track {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

.constructor-gantt__track-canvas {
  position: absolute;
  inset: 4px var(--gantt-track-inset);
  overflow: hidden;
}

.constructor-gantt__track--header {
  height: 36px;
  overflow: hidden;
}

.constructor-gantt__track--header .constructor-gantt__track-canvas {
  inset: 4px var(--gantt-track-inset) 0;
}

.constructor-gantt__track--phase {
  height: 32px;
  padding: 1px;
  border-radius: var(--gantt-track-radius);
  background: var(--gantt-track-border);
  overflow: hidden;
}

.constructor-gantt__track-inner {
  width: 100%;
  height: 100%;
  border-radius: calc(var(--gantt-track-radius) - 1px);
  background-color: var(--background-primary);
  background-image: repeating-linear-gradient(
    to right,
    transparent,
    transparent calc(100% / 22 - 1px),
    var(--gantt-track-border) calc(100% / 22 - 1px),
    var(--gantt-track-border) calc(100% / 22)
  );
}

.constructor-gantt__period {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--gap-3xs);
  min-width: 0;
}

.constructor-gantt__period-text {
  display: flex;
  gap: var(--gap-3xs);
  font: var(--text-xs-regular);
  line-height: 12px;
  white-space: nowrap;
}

.constructor-gantt__period-range {
  color: var(--text-primary);
}

.constructor-gantt__period-months {
  color: var(--text-secondary);
}

.constructor-gantt__period-line {
  display: block;
  width: 100%;
  height: 4px;
  border-radius: var(--gap-3xs);
}

.constructor-gantt__bar {
  position: absolute;
  top: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  height: var(--gantt-bar-height);
  min-width: 48px;
  padding: 0 var(--gap-xs);
  border-radius: var(--gantt-bar-radius);
}

.constructor-gantt__bar--pir {
  background: var(--gantt-pir);
}

.constructor-gantt__bar--smr {
  background: var(--gantt-smr);
}

.constructor-gantt__bar-chip {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: 0 var(--gap-xs);
  border-radius: var(--gantt-bar-radius);
  background: var(--gantt-bar-chip-bg);
}

.constructor-gantt__bar-label {
  font: var(--text-xs-regular);
  line-height: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.constructor-gantt__milestone {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  gap: var(--gap-3xs);
  height: var(--gantt-bar-height);
  max-width: calc(100% - var(--gantt-track-inset));
}

.constructor-gantt__milestone .constructor-gantt__bar-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.constructor-gantt__milestone-marker {
  width: 18px;
  height: var(--gantt-bar-height);
  border-radius: var(--gantt-bar-radius);
  background: var(--gantt-commissioning);
  flex-shrink: 0;
}
</style>
