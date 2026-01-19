<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from '@config/urls'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')

const error = ref('')
const isLoading = ref(false)

onMounted(() => {
    email.value = history.state.email || ''
    console.log(history);
    console.log(email.value);
})

const handleSubmit = async () => {
    error.value = ''
    isLoading.value = true

    try {
        const response = await fetch(`${API_URL}/api/cv/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value
            })
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Erreur lors de la création du CV')
        }

        const data = await response.json()

        await router.push({ name: 'cv.edit', params: { slug: data.slug } })
    } catch (err) {
        error.value = err.message
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="setup-container">
        <h1>Avant de démarrer</h1>

        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="firstName">Prénom</label>
                <input
                    type="text"
                    id="firstName"
                    v-model="firstName"
                    required
                />
            </div>

            <div class="form-group">
                <label for="lastName">Nom</label>
                <input
                    type="text"
                    id="lastName"
                    v-model="lastName"
                    required
                />
            </div>

            <!-- <div class="form-group">
                <label>Template</label>
                <select v-model="selectedTemplate">
                    <option value="modern">Moderne</option>
                    <option value="classic">Classique</option>
                    <option value="creative">Créatif</option>
                </select>
            </div> -->

            <button
                type="submit"
                :disabled="isLoading"
                class="submit-btn"
            >
                {{ isLoading ? 'Création...' : 'Créer mon CV' }}
            </button>

            <p
                v-if="error"
                class="error"
            >{{ error }}</p>
        </form>
    </div>
</template>

<style scoped>
.setup-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 30px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

input,
select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
}

.submit-btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.error {
    color: red;
    margin-top: 15px;
    text-align: center;
}
</style>