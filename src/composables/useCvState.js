import { ref, computed, watch } from 'vue'
import { useLocalStorage } from "./useLocalStorage";
import cvType1 from "../resources/cvType1.json";
import cvType2 from "../resources/cvType2.json";

const cvModels = {
    'cvType1': cvType1,
    'cvType2': cvType2
};

const currentModel = ref('cvType1');

// Fonction pour créer une nouvelle instance de storage
const createStorage = (modelKey) => {
    return useLocalStorage(modelKey, cvModels[modelKey]);
};

let localStorage = createStorage(currentModel.value);

// Reactive ref pour les données
const cvData = ref(localStorage.data.value);

// Watch pour synchroniser les changements de données avec le localStorage
watch(cvData, (newData) => {
    localStorage.data.value = newData;
}, { deep: true });

export function useCvState() {
    const loadModel = (model) => {
        currentModel.value = model;
        // Créer une nouvelle instance de storage
        localStorage = createStorage(model);
        // Mettre à jour les données réactives
        cvData.value = localStorage.data.value;
    };

    const initCV = () => {
        localStorage.clear()
        cvData.value = structuredClone(cvModels[currentModel.value])
    }

    const defaultCvData = computed(() => cvModels[currentModel.value])

    return {
        cvData,
        defaultCvData,
        currentModel,
        loadModel,
        initCV
    }
}