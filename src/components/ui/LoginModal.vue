<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginModal } from '@composables/useLoginModal'
import { API_URL } from '@config/urls'


const router = useRouter()
const { close, redirectTo } = useLoginModal()

const email = ref('')
const password = ref('')
const error = ref('')
const isLogin = ref(true)

const toggleMode = () => {
    isLogin.value = !isLogin.value
    error.value = ''
    email.value = ''
    password.value = ''
}

const handleGoogleLogin = async () => {
    console.log('Google login')
}

const handleSubmit = async () => {
    error.value = ''

    const endpoint = isLogin.value
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/signup`

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            error.value =
                isLogin.value
                    ? 'Identifiants incorrects'
                    : data.error
            return
        }

        const targetRedirect = redirectTo.value

        close()

        if (!isLogin.value) {
            await router.push(
                {
                    name: 'cv.setup',
                    state: { email: email.value }
                })
            return
        }

        if (redirectTo.value) {
            await router.push(targetRedirect)
        } else if (data.slug) {
            await router.push(`/cv/edit/${data.slug}`)
        } else {
            await router.push('/cv')
        }

    } catch (err) {
        error.value = err
    }
}
</script>
<template>
    <div class="modal-overlay">
        <div class="login-container">
            <button
                class="close-btn"
                @click="close"
            >×</button>

            <h1>{{ isLogin ? 'Connexion' : 'Créer un compte' }}</h1>

            <button
                class="google-btn"
                @click="handleGoogleLogin"
                disabled
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                        fill="#4285F4"
                    />
                    <path
                        d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
                        fill="#34A853"
                    />
                    <path
                        d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
                        fill="#EA4335"
                    />
                </svg>
                Continuer avec Google
            </button>

            <div class="divider">
                <span>ou</span>
            </div>

            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        placeholder="john.doe@example.com"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    class="submit-btn"
                >
                    {{ isLogin ? 'Se connecter' : 'Créer mon compte' }}
                </button>
                <p
                    v-if="error"
                    class="error"
                >{{ error }}</p>
            </form>

            <p class="toggle-text">
                {{ isLogin ? 'Pas de compte ?' : 'Déjà un compte ?' }}
                <a
                    @click="toggleMode"
                    href="#"
                >
                    {{ isLogin ? 'Créez-en un' : 'Connectez-vous' }}
                </a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.login-container {
    position: relative;
    max-width: 400px;
    width: 90%;
    background: white;
    padding: 40px 30px 30px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #666;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #000;
}

h1 {
    margin-top: 0;
    margin-bottom: 24px;
    text-align: center;
}

.google-btn {
    width: 100%;
    padding: 12px;
    background-color: white;
    color: #444;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
    transition: background-color 0.2s;
}

.google-btn:disabled {
    background-color: light-dark(rgba(239, 239, 239, 0.3), rgba(19, 1, 1, 0.3));
    color: light-dark(rgba(16, 16, 16, 0.3), rgba(255, 255, 255, 0.3));
    border-color: light-dark(rgba(118, 118, 118, 0.3), rgba(195, 195, 195, 0.3));
    cursor: not-allowed;
}

.google-btn:hover {
    background-color: #f8f8f8;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #666;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
}

.divider span {
    padding: 0 10px;
    font-size: 14px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.submit-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.submit-btn:hover {
    background-color: #0056b3;
}

.error {
    color: red;
    margin-top: 10px;
    font-size: 14px;
}

.toggle-text {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #666;
}

.toggle-text a {
    color: #007bff;
    text-decoration: none;
    cursor: pointer;
}

.toggle-text a:hover {
    text-decoration: underline;
}
</style>