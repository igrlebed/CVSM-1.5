<script setup lang="ts">
import { projects, type DashboardProject, type ProjectType } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  activeProjectSelectionVariant,
  workspaceContext,
  selectedProjectId,
  selectedProjectIds,
  selectedProjectsCount,
  indicatorsAllProjectsSelected,
  selectProject,
  toggleSelectAllProjects,
  toggleIndicatorProject,
} = useDashboardState()

const dropdownOpen = ref(false)
const dropdownRootRef = ref<HTMLElement | null>(null)

const selectedProject = computed(() =>
  projects.find((p) => p.id === selectedProjectId.value) ?? null,
)

const selectedIndex = computed(() =>
  projects.findIndex((p) => p.id === selectedProjectId.value),
)

const isIndicatorsMode = computed(() => workspaceContext.value === 'indicators')

const stepperLabel = computed(() => {
  if (isIndicatorsMode.value && indicatorsAllProjectsSelected.value) {
    return 'Все проекты'
  }
  return selectedProject.value?.title ?? 'Выберите проект'
})

const stepperCounter = computed(() => {
  if (isIndicatorsMode.value && indicatorsAllProjectsSelected.value) {
    return `${projects.length} / ${projects.length}`
  }
  if (selectedIndex.value < 0) return `— / ${projects.length}`
  return `${selectedIndex.value + 1} / ${projects.length}`
})

const allProjectsCheckState = computed(() => {
  const count = selectedProjectsCount.value
  if (count === 0) {
    return { checked: false, indeterminate: false }
  }
  if (count === projects.length) {
    return { checked: true, indeterminate: false }
  }
  return { checked: false, indeterminate: true }
})

const dropdownTriggerLabel = computed(() => {
  if (isIndicatorsMode.value) {
    if (indicatorsAllProjectsSelected.value) {
      return 'Все проекты'
    }
    if (selectedProjectsCount.value === 0) {
      return 'Выберите проекты'
    }
    return `Выбрано: ${selectedProjectsCount.value}`
  }
  return selectedProject.value?.title ?? 'Выберите проект'
})

const showSelectionCountBadge = computed(
  () =>
    isIndicatorsMode.value
    && selectedProjectsCount.value > 0
    && !indicatorsAllProjectsSelected.value,
)

function isMenuItemActive(projectId: string) {
  if (isIndicatorsMode.value) {
    return selectedProjectIds.value.has(projectId)
  }
  return selectedProjectId.value === projectId
}

const canStepPrev = computed(() => selectedIndex.value > 0)
const canStepNext = computed(
  () => selectedIndex.value < projects.length - 1 && projects.length > 0,
)

const mode = computed(() => {
  const variant = activeProjectSelectionVariant.value
  if (variant === 'dropdown') return 'dropdown'
  if (variant === 'stepper') return 'stepper'
  if (variant === 'dropdownStepper') return 'dropdownStepper'
  return null
})

const isComboMode = computed(() => mode.value === 'dropdownStepper')

const STEPPER_HEADING_GAP = 10
const STEPPER_BLOCK_GAP = 10
const STEPPER_CONTROLS_WIDTH = 36 + 6 + 36
const STEPPER_TITLE_FONT = '500 20px Onest, system-ui, sans-serif'
const STEPPER_COUNTER_FONT = '400 14px Onest, system-ui, sans-serif'

const DROPDOWN_LABEL_FONT = '500 16px Onest, system-ui, sans-serif'
const DROPDOWN_BADGE_FONT = '700 12px Onest, system-ui, sans-serif'
const DROPDOWN_TRIGGER_GAP = 12
const DROPDOWN_TRIGGER_PADDING_X = 32
const DROPDOWN_CHEVRON_WIDTH = 16
const DROPDOWN_MENU_ITEM_GAP = 10
const DROPDOWN_MENU_ITEM_PADDING_X = 24
const DROPDOWN_MENU_PADDING_X = 16
const DROPDOWN_BADGE_PADDING_X = 12
const DROPDOWN_BADGE_SM_WIDTH = 40
const DROPDOWN_CHECKBOX_WIDTH = 18
const DROPDOWN_WIDTH_BUFFER = 8

const projectTitleCandidates = [
  ...projects.map((project) => project.title),
  'Выберите проект',
  'Выберите проекты',
  'Все проекты',
  `Выбрано: ${projects.length}`,
]

let uiMeasureCanvas: HTMLCanvasElement | undefined

function measureUiText(text: string, font: string) {
  if (!import.meta.client) return 0
  uiMeasureCanvas ??= document.createElement('canvas')
  const ctx = uiMeasureCanvas.getContext('2d')
  if (!ctx) return 0
  ctx.font = font
  return ctx.measureText(text).width
}

function projectBadgeWidth(type: ProjectType) {
  if (type === 'sm') return DROPDOWN_BADGE_SM_WIDTH
  return Math.ceil(measureUiText('ВСМ', DROPDOWN_BADGE_FONT)) + DROPDOWN_BADGE_PADDING_X
}

function dropdownMenuRowExtra(withCheckbox: boolean) {
  return withCheckbox ? DROPDOWN_CHECKBOX_WIDTH + DROPDOWN_MENU_ITEM_GAP : 0
}

function dropdownMenuItemWidth(project: DashboardProject, withCheckbox = false) {
  const titleWidth = Math.ceil(measureUiText(project.title, DROPDOWN_LABEL_FONT))
  return (
    dropdownMenuRowExtra(withCheckbox)
    + projectBadgeWidth(project.type)
    + DROPDOWN_MENU_ITEM_GAP
    + titleWidth
    + DROPDOWN_MENU_ITEM_PADDING_X
    + DROPDOWN_MENU_PADDING_X
  )
}

function dropdownAllProjectsRowWidth(withCheckbox: boolean) {
  const titleWidth = Math.ceil(measureUiText('Все проекты', DROPDOWN_LABEL_FONT))
  return (
    dropdownMenuRowExtra(withCheckbox)
    + titleWidth
    + DROPDOWN_MENU_ITEM_PADDING_X
    + DROPDOWN_MENU_PADDING_X
  )
}

const uiMeasureRevision = ref(0)

const dropdownLayout = computed(() => {
  void uiMeasureRevision.value

  const maxLabel = Math.max(
    0,
    ...projectTitleCandidates.map((title) => measureUiText(title, DROPDOWN_LABEL_FONT)),
  )

  const labelWidth = Math.ceil(maxLabel)
  const triggerOnlyWidth =
    labelWidth + DROPDOWN_TRIGGER_GAP + DROPDOWN_CHEVRON_WIDTH + DROPDOWN_TRIGGER_PADDING_X

  const withCheckbox = isIndicatorsMode.value
  const maxMenuWidth = Math.max(
    dropdownAllProjectsRowWidth(withCheckbox),
    0,
    ...projects.map((project) => dropdownMenuItemWidth(project, withCheckbox)),
  )

  const blockWidth = Math.ceil(
    Math.max(triggerOnlyWidth, maxMenuWidth) + DROPDOWN_WIDTH_BUFFER,
  )

  return { labelWidth, blockWidth }
})

const dropdownStyle = computed(() => ({
  width: `${dropdownLayout.value.blockWidth}px`,
}))

const stepperLayout = computed(() => {
  void uiMeasureRevision.value

  const maxTitle = Math.max(
    0,
    ...projectTitleCandidates.map((title) => measureUiText(title, STEPPER_TITLE_FONT)),
  )

  const counterCandidates = [
    `${projects.length} / ${projects.length}`,
    `— / ${projects.length}`,
  ]

  const maxCounter = Math.max(
    0,
    ...counterCandidates.map((text) => measureUiText(text, STEPPER_COUNTER_FONT)),
  )

  const titleWidth = Math.ceil(maxTitle)
  const counterWidth = Math.ceil(maxCounter)
  const headingWidth = titleWidth + STEPPER_HEADING_GAP + counterWidth

  return {
    titleWidth,
    headingWidth,
    blockMinWidth: headingWidth + STEPPER_BLOCK_GAP + STEPPER_CONTROLS_WIDTH,
  }
})

const stepperHeadingStyle = computed(() => ({
  width: `${stepperLayout.value.headingWidth}px`,
}))

const stepperTitleStyle = computed(() => ({
  width: `${stepperLayout.value.titleWidth}px`,
}))

const stepperBlockStyle = computed(() => ({
  minWidth: `${stepperLayout.value.blockMinWidth}px`,
}))

function stepPrev() {
  if (isIndicatorsMode.value && indicatorsAllProjectsSelected.value) {
    if (projects[projects.length - 1]) {
      selectProject(projects[projects.length - 1]!.id)
    }
    return
  }
  if (!canStepPrev.value) return
  selectProject(projects[selectedIndex.value - 1]!.id)
}

function stepNext() {
  if (isIndicatorsMode.value && indicatorsAllProjectsSelected.value) {
    if (projects[0]) selectProject(projects[0].id)
    return
  }
  if (selectedIndex.value < 0) {
    if (projects[0]) selectProject(projects[0].id)
    return
  }
  if (!canStepNext.value) return
  selectProject(projects[selectedIndex.value + 1]!.id)
}

function pickProject(id: string) {
  if (isIndicatorsMode.value) {
    toggleIndicatorProject(id)
    return
  }
  selectProject(id)
  dropdownOpen.value = false
}

function pickAllProjects() {
  toggleSelectAllProjects()
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function onDocumentClick(event: MouseEvent) {
  if (!dropdownOpen.value || !dropdownRootRef.value) return
  if (!dropdownRootRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    dropdownOpen.value = false
  }
}

watch(activeProjectSelectionVariant, () => {
  dropdownOpen.value = false
})

watch(isIndicatorsMode, () => {
  uiMeasureRevision.value += 1
})

onMounted(() => {
  if (!import.meta.client) return
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
  if (!document.fonts?.ready) return
  document.fonts.ready.then(() => {
    uiMeasureRevision.value += 1
  })
})

onUnmounted(() => {
  if (!import.meta.client) return
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div
    v-if="mode === 'dropdown' || mode === 'dropdownStepper'"
    ref="dropdownRootRef"
    class="project-selector"
    :class="
      isComboMode ? 'project-selector--combo' : 'project-selector--dropdown'
    "
    :style="isComboMode ? undefined : dropdownStyle"
  >
    <div
      class="project-selector__dropdown-panel"
      :style="dropdownStyle"
    >
    <button
      type="button"
      class="project-selector__trigger neo-interactive neo-button"
      :aria-expanded="dropdownOpen"
      aria-haspopup="listbox"
      @click.stop="toggleDropdown"
    >
      <span class="project-selector__trigger-bg" aria-hidden="true" />
      <span class="project-selector__trigger-label">
        {{ dropdownTriggerLabel }}
      </span>
      <span
        v-if="showSelectionCountBadge"
        class="project-selector__trigger-count"
      >
        {{ selectedProjectsCount }}
      </span>
      <DashboardAccordionChevron :up="dropdownOpen" class="project-selector__trigger-chevron" />
      <span class="project-selector__trigger-inset neo-button-inset" aria-hidden="true" />
    </button>

    <div v-if="dropdownOpen" class="project-selector__menu">
      <div
        class="project-selector__menu-scroll neo-scroll"
        role="listbox"
        :aria-multiselectable="isIndicatorsMode || undefined"
        :aria-label="isIndicatorsMode ? 'Список проектов (множественный выбор)' : 'Список проектов'"
      >
        <button
          v-if="isIndicatorsMode"
          type="button"
          role="option"
          class="project-selector__menu-item"
          :aria-selected="allProjectsCheckState.checked"
          @click="pickAllProjects"
        >
          <DashboardProjectMultiSelectCheck
            :checked="allProjectsCheckState.checked"
            :indeterminate="allProjectsCheckState.indeterminate"
          />
          <span class="project-selector__menu-title">Все проекты</span>
        </button>
        <button
          v-for="project in projects"
          :key="project.id"
          type="button"
          role="option"
          class="project-selector__menu-item"
          :aria-selected="isMenuItemActive(project.id)"
          @click="pickProject(project.id)"
        >
          <DashboardProjectMultiSelectCheck
            v-if="isIndicatorsMode"
            :checked="isMenuItemActive(project.id)"
          />
          <DashboardProjectBadge :type="project.type" />
          <span class="project-selector__menu-title">{{ project.title }}</span>
        </button>
      </div>
    </div>
    </div>

    <div v-if="isComboMode" class="project-selector__combo-stepper">
      <div class="project-selector__stepper-controls">
        <button
          type="button"
          class="project-selector__step neo-interactive neo-button"
          aria-label="Предыдущий проект"
          :disabled="!canStepPrev"
          @click="stepPrev"
        >
          <span class="project-selector__step-bg" aria-hidden="true" />
          <DashboardChevronLeftIcon />
          <span class="project-selector__step-inset neo-button-inset" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="project-selector__step neo-interactive neo-button"
          aria-label="Следующий проект"
          :disabled="selectedIndex >= 0 && !canStepNext"
          @click="stepNext"
        >
          <span class="project-selector__step-bg" aria-hidden="true" />
          <DashboardChevronRightIcon />
          <span class="project-selector__step-inset neo-button-inset" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="mode === 'stepper'"
    class="project-selector project-selector--stepper"
    :style="stepperBlockStyle"
  >
    <div class="project-selector__stepper-heading" :style="stepperHeadingStyle">
      <p class="project-selector__stepper-title" :style="stepperTitleStyle">{{ stepperLabel }}</p>
      <p class="project-selector__stepper-counter">{{ stepperCounter }}</p>
    </div>

    <div class="project-selector__stepper-controls">
      <button
        type="button"
        class="project-selector__step neo-interactive neo-button"
        aria-label="Предыдущий проект"
        :disabled="!canStepPrev"
        @click="stepPrev"
      >
        <span class="project-selector__step-bg" aria-hidden="true" />
        <DashboardChevronLeftIcon />
        <span class="project-selector__step-inset neo-button-inset" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="project-selector__step neo-interactive neo-button"
        aria-label="Следующий проект"
        :disabled="selectedIndex >= 0 && !canStepNext"
        @click="stepNext"
      >
        <span class="project-selector__step-bg" aria-hidden="true" />
        <DashboardChevronRightIcon />
        <span class="project-selector__step-inset neo-button-inset" aria-hidden="true" />
      </button>
    </div>
  </div>

</template>

<style scoped>
.project-selector--dropdown,
.project-selector__dropdown-panel {
  position: relative;
  flex-shrink: 0;
}

.project-selector--combo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
}

.project-selector__combo-stepper {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}

.project-selector--combo .project-selector__step {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-2xl);
}

.project-selector__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  height: 46px;
  padding: 0 16px;
  border-radius: var(--radius-2xl);
  border-color: var(--border-secondary);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  background: transparent;
}

.project-selector__trigger-bg,
.project-selector__step-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--island-external);
  border-radius: inherit;
  pointer-events: none;
}

.project-selector__trigger-inset,
.project-selector__step-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
}

.project-selector__trigger-label {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-selector__trigger-chevron {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-left: 12px;
  color: var(--text-primary);
}

.project-selector__menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  width: max(100%, max-content);
  min-width: 100%;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-xl);
  background: var(--island-inner);
  box-shadow: var(--shadow-modal-outer);
  overflow: hidden;
}

.project-selector__menu-scroll {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: max-content;
  min-width: 100%;
  max-height: 280px;
  padding: 8px;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.project-selector__trigger-count {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--radius-pill, 999px);
  background: var(--accent-muted-300);
  font: 500 14px/16px var(--font-family);
  color: var(--accent-primary);
}

.project-selector__menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.project-selector__menu-item:hover {
  background: rgb(78 91 166 / 14%);
}

.project-selector__menu-title {
  flex-shrink: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
  white-space: nowrap;
}

.project-selector--stepper {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
}

.project-selector__stepper-controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
}

.project-selector__step {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-lg);
  border-color: var(--border-secondary);
  overflow: hidden;
  cursor: pointer;
  background: transparent;
}

.project-selector__step:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.project-selector__step :deep(.chevron-left-icon),
.project-selector__step :deep(.chevron-right-icon) {
  position: relative;
  z-index: 1;
  color: var(--text-primary);
}

.project-selector__stepper-heading {
  display: flex;
  flex-shrink: 0;
  align-items: baseline;
  gap: 10px;
  box-sizing: border-box;
}

.project-selector__stepper-title {
  margin: 0;
  flex-shrink: 0;
  font: var(--text-xl-medium);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-selector__stepper-counter {
  margin: 0;
  flex-shrink: 0;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
  white-space: nowrap;
}

</style>
