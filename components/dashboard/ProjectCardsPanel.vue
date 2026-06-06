<script setup lang="ts">
import { projects } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const CARD_GAP = 8
const CARD_MIN_WIDTH = 218
const {
  activeProjectSelectionVariant,
  selectedProjectId,
  isProjectSelected,
  selectProjectCard,
} = useDashboardState()

const viewportRef = ref<HTMLElement | null>(null)
const viewportWidth = ref(0)
const cardWidths = ref<number[]>(projects.map(() => CARD_MIN_WIDTH))
const carouselPage = ref(0)

const measureCardRefs = ref<(HTMLElement | null)[]>([])

function setMeasureCardRef(el: unknown, index: number) {
  measureCardRefs.value[index] = el instanceof HTMLElement ? el : null
}

function buildPages(widths: number[], availableWidth: number): number[][] {
  if (availableWidth <= 0) {
    return [projects.map((_, index) => index)]
  }

  const result: number[][] = []
  let index = 0

  while (index < projects.length) {
    const page: number[] = []
    let used = 0

    while (index < projects.length) {
      const cardWidth = widths[index] ?? CARD_MIN_WIDTH
      const gap = page.length > 0 ? CARD_GAP : 0
      const nextUsed = used + gap + cardWidth

      if (nextUsed > availableWidth && page.length > 0) {
        break
      }

      page.push(index)
      used = nextUsed
      index += 1

      if (used > availableWidth && page.length === 1) {
        break
      }
    }

    if (page.length > 0) {
      result.push(page)
    }
  }

  return result.length > 0 ? result : [[]]
}

const carouselPages = computed(() => buildPages(cardWidths.value, viewportWidth.value))

const visibleProjectIndices = computed(
  () => carouselPages.value[carouselPage.value] ?? [],
)

const visibleCardsWidth = computed(() => {
  let total = 0
  visibleProjectIndices.value.forEach((index, itemIndex) => {
    total += cardWidths.value[index] ?? CARD_MIN_WIDTH
    if (itemIndex > 0) {
      total += CARD_GAP
    }
  })
  return total
})

/** Равномерно заполняем слайд, если не хватает карточек (кроме последнего) */
const carouselSpreadCards = computed(() => {
  const count = visibleProjectIndices.value.length
  const isLastPage = carouselPage.value >= carouselPages.value.length - 1
  if (isLastPage || count <= 1 || viewportWidth.value <= 0) {
    return false
  }
  return visibleCardsWidth.value < viewportWidth.value - 1
})

const canCarouselPrev = computed(() => carouselPage.value > 0)
const canCarouselNext = computed(
  () => carouselPage.value < carouselPages.value.length - 1,
)

function updateCardWidths() {
  cardWidths.value = projects.map(
    (_, index) => measureCardRefs.value[index]?.offsetWidth ?? CARD_MIN_WIDTH,
  )
}

function syncCarouselPageToSelection() {
  if (!selectedProjectId.value) return
  const projectIndex = projects.findIndex((p) => p.id === selectedProjectId.value)
  if (projectIndex < 0) return

  const pageIndex = carouselPages.value.findIndex((page) => page.includes(projectIndex))
  if (pageIndex >= 0) {
    carouselPage.value = pageIndex
  }
}

function clampCarouselPage() {
  const lastPage = Math.max(0, carouselPages.value.length - 1)
  if (carouselPage.value > lastPage) {
    carouselPage.value = lastPage
  }
}

function refreshCarouselLayout() {
  if (!viewportRef.value) return
  const styles = getComputedStyle(viewportRef.value)
  const paddingX =
    Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
  viewportWidth.value = Math.max(0, viewportRef.value.clientWidth - paddingX)
  updateCardWidths()
  clampCarouselPage()
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  nextTick(() => {
    refreshCarouselLayout()
    if (!viewportRef.value || !import.meta.client) return
    resizeObserver = new ResizeObserver(() => refreshCarouselLayout())
    resizeObserver.observe(viewportRef.value)
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(selectedProjectId, syncCarouselPageToSelection)

watch(activeProjectSelectionVariant, (variant) => {
  if (variant === 'carousel') {
    nextTick(() => {
      refreshCarouselLayout()
      syncCarouselPageToSelection()
    })
  }
})

watch(carouselPages, () => {
  clampCarouselPage()
})

function carouselPrev() {
  if (!canCarouselPrev.value) return
  carouselPage.value -= 1
}

function carouselNext() {
  if (!canCarouselNext.value) return
  carouselPage.value += 1
}
</script>

<template>
  <div
    v-if="activeProjectSelectionVariant === 'scroll'"
    class="project-cards-panel project-cards-panel--scroll neo-scroll"
    role="list"
  >
    <DashboardProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      :selected="isProjectSelected(project.id)"
      role="listitem"
      @select="selectProjectCard"
    />
  </div>

  <div
    v-else-if="activeProjectSelectionVariant === 'carousel'"
    class="project-cards-panel project-cards-panel--carousel"
  >
    <div class="project-cards-carousel__measure" aria-hidden="true">
      <DashboardProjectCard
        v-for="(project, index) in projects"
        :key="`measure-${project.id}`"
        :ref="(el) => setMeasureCardRef(el, index)"
        :project="project"
        tabindex="-1"
      />
    </div>

    <UiNeoButtonShell
      class="project-cards-carousel__nav project-cards-carousel__nav--prev"
      aria-label="Предыдущие проекты"
      :disabled="!canCarouselPrev"
      @click="carouselPrev"
    >
      <DashboardChevronLeftIcon />
    </UiNeoButtonShell>

    <div
      ref="viewportRef"
      class="project-cards-carousel__viewport"
      :class="{ 'project-cards-carousel__viewport--spread': carouselSpreadCards }"
      role="list"
    >
      <DashboardProjectCard
        v-for="index in visibleProjectIndices"
        :key="projects[index]!.id"
        :project="projects[index]!"
        :selected="isProjectSelected(projects[index]!.id)"
        role="listitem"
        @select="selectProjectCard"
      />
    </div>

    <UiNeoButtonShell
      class="project-cards-carousel__nav project-cards-carousel__nav--next"
      aria-label="Следующие проекты"
      :disabled="!canCarouselNext"
      @click="carouselNext"
    >
      <DashboardChevronRightIcon />
    </UiNeoButtonShell>
  </div>
</template>

<style scoped>
.project-cards-panel--scroll {
  display: flex;
  gap: var(--gap-xs);
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.project-cards-panel--carousel {
  position: relative;
  display: grid;
  grid-template-columns: 46px 1fr 46px;
  align-items: stretch;
  gap: var(--gap-xs);
  width: 100%;
  box-sizing: border-box;
  padding: 0 var(--gap-xl);
  flex-shrink: 0;
}

.project-cards-carousel__measure {
  position: absolute;
  width: max-content;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
  display: flex;
  gap: var(--gap-xs);
}

.project-cards-carousel__viewport {
  display: flex;
  gap: var(--gap-xs);
  align-items: stretch;
  min-height: 108px;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.project-cards-carousel__viewport--spread {
  justify-content: space-between;
}

.project-cards-carousel__nav {
  align-self: stretch;
  box-sizing: border-box;
  width: 46px;
  min-height: 108px;
  padding: 0;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.project-cards-carousel__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.project-cards-carousel__nav :deep(.chevron-left-icon),
.project-cards-carousel__nav :deep(.chevron-right-icon) {
  position: relative;
  z-index: 1;
  color: var(--text-primary);
}
</style>
