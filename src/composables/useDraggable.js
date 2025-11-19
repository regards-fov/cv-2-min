import { ref } from 'vue'
import { useEditingState } from './useEditingState'

export function useDraggable() {
    const isDragging = ref(false)
    const hoverDisabled = ref(false)

    const { isEditing } = useEditingState()

    const handleDragStart = () => {
        isDragging.value = true
        hoverDisabled.value = true
    }

    const handleDragEnd = () => {
        isDragging.value = false
    }

    const handleMouseMove = () => {
        if (hoverDisabled.value) {
            hoverDisabled.value = false
        }
    }

    return {
        isDragging,
        isEditing,
        hoverDisabled,
        handleDragStart,
        handleDragEnd,
        handleMouseMove
    }
}