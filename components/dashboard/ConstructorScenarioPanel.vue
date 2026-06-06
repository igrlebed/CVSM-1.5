<script setup lang="ts">
import type { ConstructorScenarioId } from '~/mocks/constructor'
import { useDashboardState } from '~/composables/useDashboardState'

const {
  constructorScenarios,
  constructorActiveScenarioId,
  canCreateConstructorScenario,
  selectConstructorScenario,
  createConstructorAlternativeScenario,
  deleteConstructorScenario,
} = useDashboardState()

function pickScenario(id: ConstructorScenarioId) {
  selectConstructorScenario(id)
}

function removeScenario(id: ConstructorScenarioId) {
  deleteConstructorScenario(id)
}
</script>

<template>
  <aside class="constructor-scenario" aria-label="Сценарии">
    <DashboardWorkspaceSectionHeader title="Сценарии" size="compact">
      <template #actions>
        <DashboardIconButton
          label="Добавить сценарий"
          size="nav"
          :disabled="!canCreateConstructorScenario"
          @click="createConstructorAlternativeScenario"
        >
          <DashboardPlusIcon />
        </DashboardIconButton>
      </template>
    </DashboardWorkspaceSectionHeader>

    <div class="constructor-scenario__list">
      <div
        v-for="scenario in constructorScenarios"
        :key="scenario.id"
        role="button"
        tabindex="0"
        class="constructor-scenario__card neo-select-pill neo-interactive neo-button"
        :class="{ 'neo-select-pill--selected': constructorActiveScenarioId === scenario.id }"
        :aria-pressed="constructorActiveScenarioId === scenario.id"
        @click="pickScenario(scenario.id)"
        @keydown.enter="pickScenario(scenario.id)"
        @keydown.space.prevent="pickScenario(scenario.id)"
      >
        <span class="neo-select-pill__bg" aria-hidden="true" />
        <div class="constructor-scenario__card-content neo-select-pill__content">
          <div class="constructor-scenario__card-top">
            <span class="constructor-scenario__card-name neo-select-pill__title">{{ scenario.title }}</span>
            <span
              v-if="scenario.locked"
              class="constructor-scenario__action"
              aria-label="Только просмотр"
            >
              <DashboardLockIcon />
            </span>
            <button
              v-else
              type="button"
              class="constructor-scenario__action constructor-scenario__action--delete"
              aria-label="Удалить сценарий"
              @click.stop="removeScenario(scenario.id)"
            >
              <DashboardTrashIcon />
            </button>
          </div>
          <dl class="constructor-scenario__stats">
            <div class="constructor-scenario__stat">
              <dt>Сеть</dt>
              <dd>{{ scenario.networkKm.toLocaleString('ru-RU') }} км</dd>
            </div>
            <div class="constructor-scenario__stat">
              <dt>Проектов</dt>
              <dd>{{ scenario.projectsCount }} ед.</dd>
            </div>
          </dl>
        </div>
        <span class="neo-select-pill__inset" aria-hidden="true" />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.constructor-scenario {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--constructor-scenario-width);
  min-height: 0;
}

.constructor-scenario__list {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.constructor-scenario__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: var(--radius-3xl);
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
}

.constructor-scenario__card-content {
  display: flex;
  flex-direction: column;
  gap: var(--constructor-scenario-body-gap);
  padding-bottom: var(--constructor-scenario-body-padding-bottom);
}

.constructor-scenario__card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-md);
  padding: var(--constructor-scenario-head-padding);
}

.constructor-scenario__card-name {
  font: var(--text-md-medium);
}

.constructor-scenario__action {
  position: relative;
  z-index: 2;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--text-primary);
}

.constructor-scenario__action--delete {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.constructor-scenario__action--delete:hover {
  color: var(--accent-primary);
}

.constructor-scenario__action--delete:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.constructor-scenario__stats {
  display: flex;
  flex-direction: column;
  gap: var(--gap-3xs);
  margin: 0;
  padding-inline: var(--gap-lg);
}

.constructor-scenario__stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-md);
  margin: 0;
}

.constructor-scenario__stat dt {
  margin: 0;
  font: var(--text-sm-regular);
  color: var(--text-secondary);
}

.constructor-scenario__stat dd {
  margin: 0;
  font: var(--text-md-medium);
  color: var(--text-primary);
  text-align: right;
}
</style>
