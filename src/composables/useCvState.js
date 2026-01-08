import { ref, computed, watch, nextTick } from "vue"
import { useLocalStorage } from "./useLocalStorage"
import cvType from "../resources/cvType.json"
import { API_URL } from '@config/urls'


const currentModel = ref(null)
const cvData = ref(null)
const isSaving = ref(false)
const lastSyncedAt = ref(null)
const error = ref(null)
let cvStorage = null
let unwatchCvData = null

export function useCvState() {
    const hasPendingSync = computed(() => cvStorage?.needsSync.value || false)

    const loadModel = async (model, serverData = null, serverTimestamp = null) => {
        currentModel.value = model

        if (unwatchCvData) {
            unwatchCvData()
            unwatchCvData = null
        }

        const localStorageKey = model
        const stored = localStorage.getItem(localStorageKey)

        let shouldUseLocalStorage = false
        let localTimestamp = null

        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                localTimestamp = parsed.lastModifiedAt

                if (serverTimestamp && localTimestamp) {
                    shouldUseLocalStorage = localTimestamp > serverTimestamp

                    if (shouldUseLocalStorage) {
                        console.log('⚠️ LocalStorage plus récent que serveur')
                        console.log('Local:', new Date(localTimestamp))
                        console.log('Serveur:', new Date(serverTimestamp))
                    }
                } else if (localTimestamp) {
                    shouldUseLocalStorage = true
                }
            } catch (e) {
                console.error('Erreur parsing localStorage:', e)
                localStorage.removeItem(localStorageKey)
            }
        }

        const initialData = shouldUseLocalStorage
            ? null
            : (serverData || cvType)

        cvStorage = useLocalStorage(model, initialData || cvType)
        cvData.value = cvStorage.data.value

        if (shouldUseLocalStorage) {
            lastSyncedAt.value = null
        } else if (serverData) {
            lastSyncedAt.value = serverTimestamp || Date.now()
        } else {
            lastSyncedAt.value = null
        }

        console.log('Model loaded:', model)
        console.log('Source:', shouldUseLocalStorage ? 'localStorage' : 'serveur')
        console.log('needsSync:', cvStorage.needsSync.value)

        if (cvStorage.needsSync.value) {
            console.log('📤 Données non sync détectées, sync automatique...')
            await saveToServer()
        }

        await nextTick()

        unwatchCvData = watch(cvData, () => { }, { deep: true })
    }

    const saveToServer = async () => {
        if (isSaving.value) {
            return { success: false, reason: 'already_saving' }
        }

        isSaving.value = true
        error.value = null

        try {
            const response = await fetch(`${API_URL}/api/cv/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    data: cvData.value
                })
            })

            if (response.status === 401 || response.status === 403) {
                error.value = 'session_expired'
                return { success: false, error: 'session_expired' }
            }

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`)
            }

            const result = await response.json()

            cvStorage.markAsSynced()
            lastSyncedAt.value = Date.now()

            console.log('✅ Sauvegarde serveur réussie')

            return { success: true, data: result }
        } catch (err) {
            console.error('⚠️ Erreur sauvegarde serveur:', err)
            error.value = err.message
            return { success: false, error: err.message }
        } finally {
            isSaving.value = false
        }
    }

    const initCV = () => {
        if (!cvStorage) return

        if (hasPendingSync.value) {
            throw new Error('unsaved_changes')
        }

        cvStorage.clear()
        cvData.value = structuredClone(cvType)
    }

    const defaultCvData = computed(() => cvType)

    return {
        cvData,
        defaultCvData,
        currentModel,
        hasPendingSync,
        isSaving,
        lastSyncedAt,
        error,
        loadModel,
        initCV,
        saveToServer
    }
}