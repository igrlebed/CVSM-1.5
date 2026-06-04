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
  <div class="year-slider neo-shell-outer neo-shell-outer--fill">
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="neo-shell-inner__content year-slider__inner">
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
      <div class="year-slider__labels" aria-hidden="true">
        <span
          v-for="year in timelineYears"
          :key="year"
          class="year-slider__year"
          :class="{ 'year-slider__year--active': isActiveYear(year) }"
        >
          {{ year }}
        </span>
      </div>
    </div>
    <span class="neo-shell-outer__inset" aria-hidden="true" />
  </div>
</template>

<style scoped>
.year-slider {
  flex-shrink: 0;
  width: 100%;
  padding: 12px 20px;
  border-radius: var(--radius-xl);
}

.year-slider__inner {
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
  border-radius: var(--radius-xl);
  pointer-events: none;
}

.year-slider__track-line-bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--background-primary);
  border: 1px solid var(--border-secondary);
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
  box-shadow:
    -5px 5px 10px 0 rgba(228, 228, 228, 0.2),
    5px -5px 10px 0 rgba(228, 228, 228, 0.2),
    -5px -5px 10px 0 rgba(255, 255, 255, 0.9),
    5px 5px 13px 0 rgba(228, 228, 228, 0.9);
  pointer-events: none;
  transition: left var(--transition-base);
}

/* вдавленная центральная точка — как в Figma (filter innerShadow на Ellipse) */
.year-slider__thumb::after {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: var(--accent-muted-100);
  box-shadow:
    inset 1.5px 1.5px 3px 0 rgba(83, 103, 176, 0.5),
    inset -1px -1px 2px 0 rgba(185, 193, 225, 0.45),
    inset 0.5px 0.5px 1px 0 rgba(114, 131, 176, 0.35),
    inset -0.5px -0.5px 1px 0 rgba(220, 225, 245, 0.25);
}

.year-slider__labels {
  display: flex;
  justify-content: space-between;
  gap: 0;
  font: var(--text-xs-regular);
  line-height: 16px;
}

.year-slider__year {
  flex: 1 1 0;
  min-width: 0;
  color: var(--text-muted);
  text-align: center;
  transition: color var(--transition-fast);
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
}

.year-slider__track:has(.year-slider__input:focus-visible) .year-slider__thumb {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
</style>
