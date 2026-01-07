<script setup>

import { ref, watch } from 'vue'
import { generatePDF } from '@utils/generatePDF'


const isOpen = defineModel()

const shareUrl = ref(null)
const isGenerating = ref(false)
const copied = ref(false)

watch(isOpen, (newValue) => {
    if (!newValue) {
        shareUrl.value = null
        copied.value = false
    }
})

const generateShareLink = async () => {
    isGenerating.value = true
    try {
        shareUrl.value = await generatePDF('store')
    } finally {
        isGenerating.value = false
    }
}

const copyToClipboard = async () => {
    if (shareUrl.value) {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="isOpen"
            class="modal-overlay"
            @click="isOpen = false"
        >
            <div
                class="modal-content"
                @click.stop
            >
                <div class="modal-header">
                    <h2 class="modal-title">Partager votre CV</h2>
                    <button
                        class="close-button"
                        @click="isOpen = false"
                        aria-label="Fermer"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M15 5L5 15M5 5L15 15"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <p class="description">
                        Générez un lien permanent de votre CV pour le partager facilement dans vos candidatures
                    </p>

                    <div
                        v-if="!shareUrl"
                        class="generate-section"
                    >
                        <button
                            class="btn-generate"
                            @click="generateShareLink"
                            :disabled="isGenerating"
                        >
                            <span v-if="!isGenerating">Générer le lien de partage</span>
                            <span v-else>Génération en cours...</span>
                        </button>
                    </div>

                    <div
                        v-else
                        class="share-section"
                    >
                        <label class="share-label">Votre lien de partage</label>
                        <div class="url-container">
                            <input
                                type="text"
                                :value="shareUrl"
                                readonly
                                class="url-input"
                            >
                            <button
                                class="btn-copy"
                                @click="copyToClipboard"
                                :class="{ 'copied': copied }"
                            >
                                <span v-if="!copied">Copier</span>
                                <span v-else>Copié !</span>
                            </button>
                        </div>
                        <a
                            :href="shareUrl"
                            target="_blank"
                            class="link-preview"
                        >
                            Prévisualiser le lien
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 540px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: modalAppear 0.2s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    background-color: #f3f4f6;
    color: #111827;
}

.modal-body {
    padding: 1.5rem;
}

.description {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0 0 1.5rem 0;
}

.generate-section {
    text-align: center;
}

.btn-generate {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-generate:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15);
}

.btn-generate:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.share-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.share-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
}

.url-container {
    display: flex;
    gap: 0.5rem;
}

.url-input {
    flex: 1;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    color: #374151;
    background-color: #f9fafb;
}

.url-input:focus {
    outline: none;
    border-color: #667eea;
    background-color: white;
}

.btn-copy {
    background-color: #667eea;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-copy:hover {
    background-color: #5568d3;
}

.btn-copy.copied {
    background-color: #10b981;
}

.link-preview {
    color: #667eea;
    font-size: 0.875rem;
    text-decoration: none;
    font-weight: 500;
    display: inline-block;
    transition: color 0.2s;
}

.link-preview:hover {
    color: #5568d3;
    text-decoration: underline;
}
</style>