import { createDashboardState, dashboardStateKey } from '~/composables/useDashboardState'

export default defineNuxtPlugin((nuxtApp) => {
  const state = createDashboardState()
  nuxtApp.vueApp.provide(dashboardStateKey, state)
})
