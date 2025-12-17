export const required = (key: string): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${key}`)
  }
  return value
}