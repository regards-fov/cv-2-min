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

  // Charger depuis localStorage
  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data.value = JSON.parse(item)
        return true
      }
    } catch (e) {
      console.error('Erreur de chargement localStorage:', e)
    }
    return false
  }

  // Sauvegarder dans localStorage
  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (e) {
      console.error('Erreur de sauvegarde localStorage:', e)
    }
  }

  // Réinitialiser aux valeurs par défaut
  const clear = () => {
    data.value = structuredClone(originalDefault)
    localStorage.removeItem(key)
  }

  // Charger les données au démarrage
  const hasLoadedData = load()

  // Si aucune donnée n'existe, sauvegarder les valeurs par défaut
  if (!hasLoadedData) {
    save()
  }

  // Sauvegarder automatiquement à chaque modification
  watch(data, save, { deep: true })

  return { data, save, clear }
}
