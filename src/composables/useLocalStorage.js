import { ref, watch } from 'vue'

/**
 * Crée une référence réactive synchronisée avec localStorage
 * @param {string} key - Clé de stockage dans localStorage
 * @param {any} defaultValue - Valeur par défaut si aucune donnée n'existe
 * @returns {object} - Objet contenant la ref réactive `data` et les méthodes `save`, `clear`
 */
export function useLocalStorage(key, defaultValue) {
  const originalDefault = structuredClone(defaultValue)
  const data = ref(structuredClone(defaultValue))

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        data.value = parsed.data
        return true
      }
    } catch (e) {
      console.error('Erreur de chargement localStorage:', e)
    }
    return false
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data: data.value,
        lastModifiedAt: Date.now()
      }))
    } catch (e) {
      console.error('Erreur de sauvegarde localStorage:', e)
    }
  }

  const clear = () => {
    data.value = structuredClone(originalDefault)
    localStorage.removeItem(key)
  }

  const hasLoadedData = load()

  if (!hasLoadedData) {
    save()
  }

  watch(data, save, { deep: true })

  return { data, save, clear }
}