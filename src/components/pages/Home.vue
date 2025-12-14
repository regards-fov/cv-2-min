<script setup>

import { useRouter } from 'vue-router'
const router = useRouter()

const cvMaker = () => {
    router.push('/cv')
}
const cvImport = () => {
    router.push('/cv')
}
</script>

<template>
    <div class="navigation-container">
        <h1>CVitefait</h1>
        <h2>Ton CV vite fait, bien fait !</h2>
        <div class="button-group">
            <button
                @click="cvMaker"
                class="nav-button"
            >
                Créé ton CV
            </button>
            <button
                @click="cvImport"
                class="nav-button"
            >
                Importe un CV
            </button>
        </div>
    </div>
</template>

<style scoped>
.navigation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
}

h1 {
    margin-bottom: 30px;
    color: #2c3e50;
}

.button-group {
    display: flex;
    gap: 20px;
}

.nav-button {
    padding: 15px 30px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background-color: #42b983;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-button:hover {
    background-color: #359268;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-button:active {
    transform: translateY(0);
}
</style>