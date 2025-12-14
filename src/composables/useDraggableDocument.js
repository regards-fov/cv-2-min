import { ref, watch, nextTick } from 'vue'

export function useDraggableDocument(zoom, zoomable) {
    const position = ref({ x: 0, y: 0 })
    const isDragging = ref(false)
    const dragOffset = ref({ x: 0, y: 0 })

    const centerContainer = () => {
        const container = document.getElementById('a4-container')
        if (!container) return

        const scale = zoom.value / 100
        const scaledWidth = container.offsetWidth * scale
        const scaledHeight = container.offsetHeight * scale

        position.value = {
            x: (window.innerWidth - scaledWidth) / 2,
            y: (window.innerHeight - scaledHeight) / 2
        }
    }

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('drag-area')) {
            isDragging.value = true
            dragOffset.value = {
                x: e.clientX - position.value.x,
                y: e.clientY - position.value.y
            }
        }
    }

    const handleMouseMove = (e) => {
        if (isDragging.value) {
            position.value = {
                x: e.clientX - dragOffset.value.x,
                y: e.clientY - dragOffset.value.y
            }
        }
    }

    const handleMouseUp = () => {
        isDragging.value = false
    }

    const initializeZoomWatcher = (cvData) => {
        watch(
            () => cvData.value,
            () => {
                if (cvData.value) {
                    nextTick(() => {
                        if (zoomable.value?._zoom) {
                            zoomable.value._zoom.onChange((z) => {
                                zoom.value = Math.round(z * 100)
                            })
                        }
                        centerContainer()
                    })
                }
            },
            { immediate: true }
        )
    }

    return {
        position,
        centerContainer,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        initializeZoomWatcher
    }
}