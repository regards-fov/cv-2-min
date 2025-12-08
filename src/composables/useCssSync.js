import { watch, nextTick } from 'vue'

export function useCssSync(dataRef, mappings) {
    const applyCssVars = () => {
        if (!dataRef.value) return

        mappings.forEach(({ path, cssVar, transform }) => {
            const value = getNestedValue(dataRef.value, path)
            if (value !== undefined) {
                const finalValue = transform ? transform(value) : value
                document.documentElement.style.setProperty(cssVar, finalValue)
            }
        })
    }

    // Helper pour accéder aux propriétés imbriquées
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
    }

    // Appliquer immédiatement si les données sont disponibles
    if (dataRef.value) {
        nextTick(() => applyCssVars())
    }

    // Synchroniser les changements
    watch(dataRef, applyCssVars, { deep: true })

    return { applyCssVars }
}