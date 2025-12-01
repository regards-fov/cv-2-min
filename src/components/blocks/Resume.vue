<script setup>
import { ref, inject } from "vue"
import TextareaSection from "../ui/TextareaSection.vue"
import { useAI } from '@/composables/useAI'

const cvData = inject('cvData')

const hovering = ref(false)
const suggestion = ref(null)
const { isLoading, error, enhanceText } = useAI()

async function enhance() {
    const jobPosition = cvData.value.cv.personal.find(item => item.key === "job")?.value

    if (!cvData.value.cv.resume) return

    try {
        const response = await enhanceText(
            cvData.value.cv.resume,
            'Un résumé du parcours et des expériences professionelles de l\'utilisateur façon micro-bio',
            jobPosition || '',
            "professionel"
        )

        suggestion.value = response.resume
    } catch (err) {
        console.error('Enhancement failed:', err)
    }
}

function applySuggestion() {
    cvData.value.cv.resume = suggestion.value
    suggestion.value = null
}
</script>

<template>
    <section
        class="resume-section"
        :class="{ 'highlight-resume': hovering }"
    >
        <TextareaSection
            v-model="cvData.cv.resume"
            name="resume"
            placeholder="Votre profil et motivations en quelques lignes"
        />
        <button
            @mouseover="hovering = true"
            @mouseleave="hovering = false"
            @click="enhance"
            :disabled="true || isLoading || suggestion || !cvData.cv.resume"
            class="ai-button"
        >
            <span v-if="!isLoading">✨ Améliorer avec IA</span>
            <span v-else>🔄 Génération...</span>
        </button>

        <div
            v-if="suggestion"
            class="suggestion-box"
        >
            <p class="suggestion-text">{{ suggestion }}</p>
            <div class="suggestion-actions">
                <button
                    @click="applySuggestion"
                    class="btn-accept"
                >
                    ✓ Appliquer
                </button>
                <button
                    @click="suggestion = null"
                    class="btn-reject"
                >
                    ✗ Refuser
                </button>
            </div>
        </div>

        <p
            v-if="error"
            class="error"
        >
            {{ error }}
        </p>
    </section>
</template>

<style lang="scss" scoped>
.resume-section {
    position: relative;
    margin-top: 17px;
    margin-bottom: 7px;
}

#resume {
    position: relative;
    z-index: 1;
    background-color: #f5f5f5;

    &>* {
        text-align: justify;
    }
}

button {
    font-family: 'Inter';
}

.ai-button {
    position: absolute;
    top: 18px;
    right: 0;
    padding: 4px 16px 8px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: transform 0.2s, opacity 0.1s;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
}

.resume-section:hover .ai-button {
    opacity: 0.8;
    pointer-events: auto;
    transform: translateY(-45px);
}

.resume-section:hover .ai-button:hover {
    opacity: 1;
}

.ai-button:disabled {
    cursor: not-allowed;
}

.resume-section:hover .ai-button:disabled {
    opacity: 0.6;
    pointer-events: auto;
}

.suggestion-box {
    position: absolute;
    z-index: 2;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 10%, #b287dd 100%);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.suggestion-text {
    margin-bottom: 12px;
    color: #ffffff;
    white-space: pre-wrap;
    max-height: 200px;
    overflow-y: auto;
    text-align: justify;
}

.suggestion-actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
}

.btn-accept,
.btn-reject {
    padding: 6px 12px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    transition: opacity 0.2s;
}

.btn-accept:hover,
.btn-reject:hover {
    opacity: 0.9;
}

.btn-accept {
    background: var(--button-positive);
    color: white;
}

.btn-reject {
    background: var(--button-negative);
    color: white;
}

.error {
    color: var(--button-negative);
    font-size: 13px;
    margin-top: 8px;
}

.highlight-resume #resume {
    border-radius: 5px 0px 5px 5px;
    background: var(--hover-bg);
    border-color: var(--hover-border);
    box-shadow: 0 1px 4px rgba(102, 126, 234, 0.6);
    color: var(--greyed-text);
}
</style>
