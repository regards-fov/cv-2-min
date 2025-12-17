<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_URL } from '@config/urls'

const route = useRoute()
const router = useRouter()

const pdfUrl = ref(null)

const loading = ref(true)
const notFound = ref(false)
const rateLimited = ref(false)
const error = ref({ message: '', code: '' })

onMounted(async () => {
    const slug = route.params.slug

    if (!slug) {
        router.push({ name: 'home' })
        return
    }

    try {
        const response = await fetch(`${API_URL}/api/cv/${slug}`)

        // 404 — CV inexistant
        if (response.status === 404) {
            notFound.value = true
            error.value = {
                message: "Ce CV n'existe plus ou bien il n'est plus disponible.",
                code: response.status
            }
            return
        }

        if (response.status === 429) {
            const data = await response.json()
            rateLimited.value = true
            error.value = { message: data.message, code: response.status }
            return
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        pdfUrl.value = data.pdfUrl

    } catch (error) {
        console.log(error)
        errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    } finally {
        loading.value = false
    }
})

</script>

<template>
    <div class="container">

        <div
            v-if="loading"
            class="loader-container"
        >
            <div class="loader">
                <div class="loader-spinner"></div>
                <p class="loader-text">Chargement du CV...</p>
            </div>
        </div>

        <div v-else-if="notFound">
            <h1>{{ error.code }}</h1>
            {{ error.message }}
            <div>
                <RouterLink :to="{ name: 'home' }">Return home</RouterLink>
            </div>
        </div>

        <div v-else-if="rateLimited">
            <h1>{{ error.code }}</h1>
            {{ error.message }}
        </div>


        <div
            v-else
            class="pdf-viewer"
        >
            <!-- Affichage PDF -->
            <iframe
                :src="pdfUrl"
                width="100%"
                height="100%"
            ></iframe>
        </div>
    </div>
</template>
<style scoped>
.container {
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
}
</style>