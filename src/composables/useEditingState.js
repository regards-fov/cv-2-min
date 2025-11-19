import { ref } from 'vue'

const isEditing = ref(false)
const editingCount = ref(0)

export function useEditingState() {
    const startEditing = () => {
        editingCount.value++
        isEditing.value = true
    }

    const endEditing = () => {
        editingCount.value--
        if (editingCount.value <= 0) {
            editingCount.value = 0
            isEditing.value = false
        }
    }

    return {
        isEditing,
        startEditing,
        endEditing
    }
}