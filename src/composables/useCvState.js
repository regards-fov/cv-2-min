import { ref, computed, watch } from "vue"
import { useLocalStorage } from "./useLocalStorage"
import cvType from "../resources/cvType.json"

const currentModel = ref(null)
const cvData = ref(null)
const isDirty = ref(false)
const isSaving = ref(false)
const lastSyncedAt = ref(null)
const error = ref(null)
let cvStorage = null

export function useCvState() {
    const loadModel = (model, serverData = null, serverTimestamp = null) => {
        currentModel.value = model

        // Vérifier si localStorage existe et comparer les timestamps
        const localStorageKey = model
        const stored = localStorage.getItem(localStorageKey)

        let shouldUseLocalStorage = false
        let localTimestamp = null

        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                localTimestamp = parsed.lastModifiedAt

                // Si on a des données serveur, comparer les timestamps
                if (serverTimestamp && localTimestamp) {
                    shouldUseLocalStorage = localTimestamp > serverTimestamp

                    if (shouldUseLocalStorage) {
                        console.log('⚠️ LocalStorage plus récent que serveur')
                        console.log('Local:', new Date(localTimestamp))
                        console.log('Serveur:', new Date(serverTimestamp))
                    }
                } else if (localTimestamp) {
                    // Pas de timestamp serveur = utiliser localStorage
                    shouldUseLocalStorage = true
                }
            } catch (e) {
                console.error('Erreur parsing localStorage:', e)
            }
        }

        // Décider quelle source utiliser
        const initialData = shouldUseLocalStorage
            ? null  // useLocalStorage va charger automatiquement depuis localStorage
            : (serverData || cvType)

        cvStorage = useLocalStorage(model, initialData || cvType)
        cvData.value = cvStorage.data.value

        // Mettre à jour les états
        if (shouldUseLocalStorage) {
            // LocalStorage plus récent = données non sync avec serveur
            isDirty.value = true
            lastSyncedAt.value = null
        } else if (serverData) {
            // Données viennent du serveur = sync
            isDirty.value = false
            lastSyncedAt.value = serverTimestamp || Date.now()
        } else {
            // Données par défaut = pas encore sync
            isDirty.value = true
            lastSyncedAt.value = null
        }

        console.log('Model loaded:', model)
        console.log('Source:', shouldUseLocalStorage ? 'localStorage' : 'serveur')
        console.log('isDirty:', isDirty.value)
    }

    const saveToServer = async () => {
        if (!isDirty.value || isSaving.value) {
            return { success: false, reason: 'nothing_to_save' }
        }

        isSaving.value = true
        error.value = null

        try {
            const response = await fetch('http://localhost:3000/api/cv/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    data: cvData.value
                })
            })

            if (!response.ok) {
                throw new Error(`Erreur ${response.status}`)
            }

            const result = await response.json()

            isDirty.value = false
            lastSyncedAt.value = Date.now()

            console.log('Sauvegarde serveur réussie')

            return { success: true, data: result }
        } catch (err) {
            console.error('Erreur sauvegarde serveur:', err)
            error.value = err.message
            return { success: false, error: err.message }
        } finally {
            isSaving.value = false
        }
    }

    watch(
        cvData,
        () => {
            if (cvData.value !== null) {
                isDirty.value = true
            }
        },
        { deep: true }
    )

    const initCV = () => {
        if (!cvStorage) return
        cvStorage.clear()
        cvData.value = structuredClone(cvType)
        isDirty.value = true
    }

    const defaultCvData = computed(() => cvType)

    return {
        cvData,
        defaultCvData,
        currentModel,
        isDirty,
        isSaving,
        lastSyncedAt,
        error,
        loadModel,
        initCV,
        saveToServer
    }
}