const LOGO_VARIANT_HINT_KEY_PREFIX = 'cvsm-logo-variant-hint-dismissed:'

function hintStorageKey(contextId: string) {
  return `${LOGO_VARIANT_HINT_KEY_PREFIX}${contextId}`
}

export function useLogoVariantHint(
  enabled: Ref<boolean> | boolean,
  contextId: Ref<string>,
) {
  const showHint = ref(false)

  function syncHintVisibility() {
    if (!import.meta.client || !toValue(enabled)) {
      showHint.value = false
      return
    }
    showHint.value = localStorage.getItem(hintStorageKey(contextId.value)) !== '1'
  }

  function dismissHint() {
    showHint.value = false
    if (import.meta.client) {
      localStorage.setItem(hintStorageKey(contextId.value), '1')
    }
  }

  function onLogoClick(openModal: () => void) {
    dismissHint()
    openModal()
  }

  watch(contextId, syncHintVisibility)

  onMounted(syncHintVisibility)

  return {
    showHint,
    dismissHint,
    onLogoClick,
  }
}
