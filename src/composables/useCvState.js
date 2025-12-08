import { ref, computed, watch } from "vue"
import { useLocalStorage } from "./useLocalStorage"
import cvType from "../resources/cvType.json"

const currentModel = ref(null)
const cvData = ref(null)
let cvStorage = null

export function useCvState() {
    const loadModel = (model) => {
        currentModel.value = model
        cvStorage = useLocalStorage(model, cvType)

        cvData.value = cvStorage.data.value

        console.log('Model loaded:', model)
        console.log('cvData:', cvData.value)
    }

    // Watch pour synchroniser les changements vers le storage
    // Ce watch est créé UNE FOIS au niveau du module
    watch(
        cvData,
        (newData) => {
            if (cvStorage && newData !== null) {
                cvStorage.data.value = newData
            }
        },
        { deep: true }
    )

    const initCV = () => {
        if (!cvStorage) return
        cvStorage.clear()
        cvData.value = structuredClone(cvType)
    }

    const defaultCvData = computed(() => cvType)

    return {
        cvData,
        defaultCvData,
        currentModel,
        loadModel,
        initCV
    }
}