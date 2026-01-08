import { onBeforeUnmount } from 'vue'

export function useAutoSave(cvState, options = {}) {
    const { intervalMs = 30000 } = options

    let saveInterval = null

    const startAutoSave = () => {
        if (saveInterval) {
            clearInterval(saveInterval)
        }

        saveInterval = setInterval(() => {
            if (cvState.hasPendingSync.value) {
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

    const handleBeforeUnload = () => {
        if (cvState.hasPendingSync.value && cvState.cvData.value) {
            fetch(`${API_URL}/api/cv/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                keepalive: true,
                body: JSON.stringify({
                    data: cvState.cvData.value
                })
            }).then(response => {
                if (response.ok) {
                    console.log('✅ Sync beforeunload réussie')
                }
            }).catch(err => {
                console.warn('⚠️ Sync beforeunload échouée (sera retry au reload)', err)
            })
        }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    startAutoSave()

    onBeforeUnmount(() => {
        stopAutoSave()
        window.removeEventListener('beforeunload', handleBeforeUnload)

        if (cvState.hasPendingSync.value) {
            cvState.saveToServer()
        }
    })

    return {
        startAutoSave,
        stopAutoSave
    }
}