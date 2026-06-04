<script setup lang="ts">
import { timelineYears } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const { modelYear } = useDashboardState()

const fillPercent = computed(() => {
  const min = timelineYears[0]
  const max = timelineYears[timelineYears.length - 1]
  return ((modelYear.value - min) / (max - min)) * 100
})

const thumbLeft = computed(() => `calc(${fillPercent.value}% - 14px)`)

function isActiveYear(year: number) {
  const min = timelineYears[0]
  const max = timelineYears[timelineYears.length - 1]
  if (year === min || year === max) return true
  return year >= modelYear.value - 4 && year <= modelYear.value
}
</script>

<template>
  <div class="year-slider">
    <span class="year-slider__shell-bg" aria-hidden="true" />
    <div class="year-slider__inner">
      <div class="year-slider__track">
        <div class="year-slider__track-line" aria-hidden="true">
          <span class="year-slider__track-line-bg" />
          <span class="year-slider__track-line-inset" />
        </div>
        <div
          class="year-slider__track-fill"
          :style="{ width: `${fillPercent}%` }"
          aria-hidden="true"
        />
        <span
          class="year-slider__thumb"
          :style="{ left: thumbLeft }"
          aria-hidden="true"
        />
        <input
          v-model.number="modelYear"
          type="range"
          class="year-slider__input"
          :min="timelineYears[0]"
          :max="timelineYears[timelineYears.length - 1]"
          step="1"
          aria-label="Год модели"
          :aria-valuetext="`${modelYear}`"
        />
      </div>
      <div class="year-slider__labels">
        <span
          v-for="year in timelineYears"
          :key="year"
          :class="{ 'year-slider__year--active': isActiveYear(year) }"
        >
          {{ year }}
        </span>
      </div>
    </div>
    <span class="year-slider__shell-inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.year-slider {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  padding: 12px 20px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  isolation: isolate;
  box-shadow: var(--shadow-outer);
}

.year-slider__shell-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--background-primary);
  border-radius: inherit;
  pointer-events: none;
}

.year-slider__shell-inset {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-inset-soft);
}

.year-slider__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.year-slider__track {
  position: relative;
  height: 28px;
}

.year-slider__track-line {
  position: absolute;
  top: 7px;
  left: 0;
  right: 0;
  height: 14px;
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  pointer-events: none;
}

.year-slider__track-line-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--background-primary);
}

.year-slider__track-line-inset {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--shadow-track-inset);
}

.year-slider__track-fill {
  position: absolute;
  top: 7px;
  left: 0;
  height: 14px;
  border-radius: 24px 0 0 24px;
  background: var(--accent-muted-100);
  pointer-events: none;
  transition: width var(--transition-base);
}

.year-slider__thumb {
  position: absolute;
  top: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--island-external);
  border: 1.17px solid var(--accent-muted-100);
  box-shadow: var(--shadow-outer-sidebar), var(--shadow-inset-soft-sidebar);
  pointer-events: none;
  transition: left var(--transition-base);
}

.year-slider__thumb::after {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: var(--accent-muted-100);
}

.year-slider__labels {
  display: flex;
  justify-content: space-between;
  font: var(--text-xs-regular);
  line-height: 16px;
  white-space: nowrap;
}

.year-slider__labels span {
  color: var(--text-muted);
}

.year-slider__year--active {
  color: var(--text-primary);
}

.year-slider__input {
  position: absolute;
  top: 7px;
  left: 0;
  width: 100%;
  height: 14px;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
}

.year-slider__track:has(.year-slider__input:hover) .year-slider__thumb,
.year-slider__track:has(.year-slider__input:focus-visible) .year-slider__thumb {
  border-color: var(--accent-muted);
  box-shadow:
    -6px 6px 12px 0 rgba(228, 228, 228, 0.28),
    6px -6px 12px 0 rgba(228, 228, 228, 0.28),
    -6px -6px 12px 0 rgba(255, 255, 255, 0.95),
    6px 6px 16px 0 rgba(228, 228, 228, 0.95),
    var(--shadow-inset-soft-sidebar);
}

.year-slider__track:has(.year-slider__input:focus-visible) .year-slider__thumb {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
