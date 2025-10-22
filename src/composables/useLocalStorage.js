import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const originalDefault = structuredClone(defaultValue)
  const data = ref(structuredClone(defaultValue))

  const load = () => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        data.value = JSON.parse(item)
      }
    } catch (e) {
      console.error('Erreur de chargement:', e)
    }
  }

  const save = () => {
    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (e) {
      console.error('Erreur de sauvegarde:', e)
    }
  }

  const clear = () => {
    data.value = structuredClone(originalDefault)
    localStorage.removeItem(key)
  }

  watch(data, save, { deep: true })
  load()

  return { data, load, save, clear }
}