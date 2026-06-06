const DRAG_THRESHOLD_PX = 5

export function useHorizontalDragScroll() {
  const containerRef = ref<HTMLElement | null>(null)
  const isDragging = ref(false)

  let pointerActive = false
  let suppressClick = false
  let startX = 0
  let startScrollLeft = 0
  let activePointerId: number | null = null

  function onPointerDown(event: PointerEvent) {
    const el = containerRef.value
    if (!el || event.button !== 0 || event.pointerType !== 'mouse') return

    pointerActive = true
    suppressClick = false
    isDragging.value = false
    startX = event.pageX
    startScrollLeft = el.scrollLeft
    activePointerId = event.pointerId
  }

  function onPointerMove(event: PointerEvent) {
    const el = containerRef.value
    if (!pointerActive || !el || event.pointerId !== activePointerId) return

    const deltaX = event.pageX - startX
    if (!isDragging.value && Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return

    if (!isDragging.value) {
      isDragging.value = true
      suppressClick = true
      el.setPointerCapture(event.pointerId)
    }

    el.scrollLeft = startScrollLeft - deltaX
    event.preventDefault()
  }

  function onPointerUp(event: PointerEvent) {
    const el = containerRef.value
    if (!pointerActive || event.pointerId !== activePointerId) return

    pointerActive = false
    isDragging.value = false
    activePointerId = null

    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId)
    }
  }

  function onClickCapture(event: MouseEvent) {
    if (!suppressClick) return
    event.preventDefault()
    event.stopImmediatePropagation()
    suppressClick = false
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
