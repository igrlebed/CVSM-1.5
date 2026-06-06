export function useLogoVariantHint(
  enabled: MaybeRefOrGetter<boolean>,
  contextId: Ref<string>,
) {
  const showHint = ref(false)
  const dismissedContexts = ref<string[]>([])

  function syncHint() {
    if (!toValue(enabled)) {
      showHint.value = false
      return
    }
    showHint.value = !dismissedContexts.value.includes(contextId.value)
  }

  function dismissHint() {
    const id = contextId.value
    if (!dismissedContexts.value.includes(id)) {
      dismissedContexts.value = [...dismissedContexts.value, id]
    }
    showHint.value = false
  }

  function onLogoClick(openModal: () => void) {
    dismissHint()
    openModal()
  }

  onMounted(() => {
    syncHint()
    watch([() => toValue(enabled), contextId], syncHint)
  })

  return {
    showHint,
    dismissHint,
    onLogoClick,
  }
}
