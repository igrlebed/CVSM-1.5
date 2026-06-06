<script setup lang="ts">
import { dashboardTitle } from '~/mocks/dashboard'
import { useDashboardState } from '~/composables/useDashboardState'

const props = withDefaults(
  defineProps<{
    logoInteractive?: boolean
  }>(),
  { logoInteractive: true },
)

const { openUiVariantsModal, activeWorkspaceNav } = useDashboardState()
const { showHint, dismissHint, onLogoClick } = useLogoVariantHint(
  computed(() => props.logoInteractive),
  activeWorkspaceNav,
)
</script>

<template>
  <header class="dashboard-header neo-shell-outer">
    <span class="neo-shell-outer__bg" aria-hidden="true" />
    <div class="dashboard-header__inner neo-shell-inner">
      <span class="neo-shell-inner__bg" aria-hidden="true" />
      <div class="neo-shell-inner__content dashboard-header__content">
        <div
          v-if="logoInteractive"
          class="dashboard-header__logo-wrap"
        >
          <button
            type="button"
            class="dashboard-header__logo-btn neo-interactive"
            :class="{ 'dashboard-header__logo-btn--hint': showHint }"
            aria-label="Варианты интерфейса"
            :aria-describedby="showHint ? 'logo-variant-hint' : undefined"
            @click="onLogoClick(openUiVariantsModal)"
          >
            <img
              src="/images/logo.svg"
              alt=""
              class="dashboard-header__logo"
              width="45"
              height="24"
            />
          </button>
          <div
            v-if="showHint"
            id="logo-variant-hint"
            class="dashboard-header__logo-hint"
            role="status"
          >
            <p class="dashboard-header__logo-hint-text">
              Чтобы сменить вариант отображения, нажмите на логотип
            </p>
            <button
              type="button"
              class="dashboard-header__logo-hint-dismiss neo-interactive neo-interactive--flat"
              @click="dismissHint"
            >
              Понятно
            </button>
          </div>
        </div>
        <span v-else class="dashboard-header__logo-mark" aria-hidden="true">
          <img
            src="/images/logo.svg"
            alt=""
            class="dashboard-header__logo"
            width="45"
            height="24"
          />
        </span>
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
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  height: 56px;
  border-radius: var(--radius-lg);
  overflow: visible;
}

.dashboard-header__inner {
  height: 100%;
  border-radius: var(--radius-md);
  overflow: visible;
}

.dashboard-header__content {
  display: flex;
  align-items: center;
  gap: var(--gap-lg);
  height: 100%;
  box-sizing: border-box;
  padding-inline: var(--gap-lg);
  overflow: visible;
}

.dashboard-header__logo-wrap {
  position: relative;
  flex-shrink: 0;
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

.dashboard-header__logo-btn--hint {
  animation: dashboard-header-logo-pulse 1.6s ease-in-out infinite;
}

.dashboard-header__logo-mark {
  display: flex;
  flex-shrink: 0;
  padding: 4px;
  margin: -4px;
}

.dashboard-header__logo-btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.dashboard-header__logo {
  display: block;
}

.dashboard-header__logo-hint {
  position: absolute;
  top: calc(100% + var(--gap-xs));
  left: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  width: max-content;
  max-width: min(280px, 70vw);
  padding: var(--gap-md) var(--gap-lg);
  border: var(--border-width) solid var(--border-stroke);
  border-radius: var(--radius-lg);
  background: var(--select-pill-surface);
  box-shadow: var(--shadow-modal-outer);
}

.dashboard-header__logo-hint-text {
  margin: 0;
  font: var(--text-sm-regular);
  line-height: 18px;
  color: var(--text-primary);
}

.dashboard-header__logo-hint-dismiss {
  align-self: flex-start;
  padding: var(--gap-3xs) var(--gap-sm);
  border-radius: var(--radius-sm);
  font: var(--text-sm-medium);
  color: var(--accent-primary);
  cursor: pointer;
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

@keyframes dashboard-header-logo-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(78 91 166 / 0%);
  }

  50% {
    box-shadow: 0 0 0 6px rgb(78 91 166 / 22%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-header__logo-btn--hint {
    animation: none;
    box-shadow: 0 0 0 2px rgb(78 91 166 / 35%);
  }
}
</style>
