import { onBeforeUnmount } from 'vue'

export function useAutoSave(cvState, options = {}) {
    const {
        intervalMs = 30000,
        saveOnUnload = true,
        saveOnVisibilityChange = true,
        saveOnBlur = true
    } = options

    let saveInterval = null

    const startAutoSave = () => {
        if (saveInterval) {
            clearInterval(saveInterval)
        }

        //Auto-save périodique
        saveInterval = setInterval(() => {
            if (cvState.isDirty.value) {
                cvState.saveToServer()
            }
        }, intervalMs)
    }

    const stopAutoSave = () => {
        if (saveInterval) {
            clearInterval(saveInterval)
            saveInterval = null
        }
    }

    const handleBeforeUnload = (event) => {
        if (cvState.isDirty.value) {
            const blob = new Blob([JSON.stringify({
                data: cvState.cvData.value
            })], { type: 'application/json' })

            navigator.sendBeacon('/api/cv/save', blob)
        }
    }

    const handleVisibilityChange = () => {
        if (document.hidden && cvState.isDirty.value) {
            cvState.saveToServer()
        }
    }

    //Save on input blur
    const handleBlur = () => {
        if (cvState.isDirty.value) {
            cvState.saveToServer()
        }
    }

    if (saveOnUnload) {
        window.addEventListener('beforeunload', handleBeforeUnload)
    }

    if (saveOnVisibilityChange) {
        document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    if (saveOnBlur) {
        window.addEventListener('blur', handleBlur)
    }

    startAutoSave()

    onBeforeUnmount(() => {
        stopAutoSave()

        if (saveOnUnload) {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }

        if (saveOnVisibilityChange) {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }

        if (saveOnBlur) {
            window.removeEventListener('blur', handleBlur)
        }

        if (cvState.isDirty.value) {
            cvState.saveToServer()
        }
    })

    return {
        startAutoSave,
        stopAutoSave
    }
}