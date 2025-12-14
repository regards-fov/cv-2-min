import { ref, computed } from 'vue'

const user = ref(null)
const isAuthenticated = computed(() => user.value !== null)

export function useAuth() {
    const getUser = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/me", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (!response.ok) {
                user.value = null
                return null
            }

            const userData = await response.json()

            user.value = userData

            return userData
        } catch (error) {
            console.error('Erreur getUser:', error)
            user.value = null
            return null
        }
    }

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erreur login')
            }

            const data = await response.json()
            user.value = data.user
            return data.user
        } catch (error) {
            console.error('Erreur login:', error)
            throw error
        }
    }

    const register = async (email, password, name) => {
        try {
            const response = await fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, name })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erreur register')
            }

            const data = await response.json()
            user.value = data.user
            return data.user
        } catch (error) {
            console.error('Erreur register:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
        } finally {
            user.value = null
        }
    }

    return {
        user,
        isAuthenticated,
        getUser,
        login,
        register,
        logout
    }
}