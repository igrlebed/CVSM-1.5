const DRAG_THRESHOLD_PX = 5

export function useHorizontalDragScroll() {
  const containerRef = ref<HTMLElement | null>(null)
  const isDragging = ref(false)

  let pointerActive = false
  let hasDragged = false
  let startX = 0
  let startScrollLeft = 0

  function onPointerDown(event: PointerEvent) {
    const el = containerRef.value
    if (!el || event.button !== 0 || event.pointerType !== 'mouse') return

    pointerActive = true
    hasDragged = false
    isDragging.value = false
    startX = event.pageX
    startScrollLeft = el.scrollLeft
    el.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent) {
    const el = containerRef.value
    if (!pointerActive || !el) return

    const deltaX = event.pageX - startX
    if (!hasDragged && Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return

    hasDragged = true
    isDragging.value = true
    el.scrollLeft = startScrollLeft - deltaX
    event.preventDefault()
  }

  function onPointerUp(event: PointerEvent) {
    const el = containerRef.value
    pointerActive = false
    isDragging.value = false

    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId)
    }
  }

  function onClickCapture(event: MouseEvent) {
    if (!hasDragged) return
    event.preventDefault()
    event.stopImmediatePropagation()
    hasDragged = false
  }

  return {
    containerRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onClickCapture,
  }
}
