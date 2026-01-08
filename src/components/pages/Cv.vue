<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCvState } from "@composables/useCvState"
import { useAutoSave } from "@composables/useAutoSave"
import { useAuth } from "@composables/useAuth"
import { useCssSync } from '@composables/useCssSync'
import { useDraggableDocument } from '@composables/useDraggableDocument'
import { useLoginModal } from '@composables/useLoginModal'
import { usePdfGeneration } from '@composables/usePdfGeneration'
import { vZoom } from '@directives/zoomable'
import MainSection from "../layout/MainSection.vue"
import PropertiesPanel from "../layout/propertiesPanel/PropertiesPanel.vue"
import Sidebar from "../layout/SideBar.vue"

const route = useRoute()
const router = useRouter()

const { getUser } = useAuth()
const cvState = useCvState()
const isLoading = ref(true)
const { isGeneratingPdf } = usePdfGeneration()

provide('cvData', cvState.cvData)
provide('defaultCvData', cvState.defaultCvData)

const isLocalhost = window.location.hostname === 'localhost'
const isColorWheelOpen = ref(false)
const isPanelCollapsed = ref(true)
const zoomable = ref(null)
const zoom = ref(100)

const {
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    initializeZoomWatcher
} = useDraggableDocument(zoom, zoomable)

const toggleColorWheel = () => {
    isColorWheelOpen.value = !isColorWheelOpen.value
    if (isColorWheelOpen.value && isPanelCollapsed.value) {
        isPanelCollapsed.value = false
    }
}

const isLayoutSelectorHovered = ref(false)

useCssSync(cvState.cvData, [
    {
        path: 'configuration.sidebar.color',
        cssVar: '--main-color'
    },
    {
        path: 'configuration.mainSection.textAlign',
        cssVar: '--text-align'
    }
])

const handleChangeColor = (color) => {
    if (cvState.cvData.value) {
        cvState.cvData.value.configuration.sidebar.color = color
    }
}

initializeZoomWatcher(cvState.cvData)

const cvSlug = route.params.slug

useAutoSave(cvState, {
    intervalMs: 60000,
    saveOnUnload: true,
    saveOnVisibilityChange: false,
    saveOnBlur: false
})

onMounted(async () => {
    if (!cvSlug) {
        console.warn('Aucun slug dans URL')
        router.push({ name: 'home' })
        return
    }

    try {
        const userData = await getUser()

        if (!userData) {
            console.warn('User non authentifié')
            useLoginModal().open(router.currentRoute.value.fullPath)
            router.push({ name: 'home' })
            return
        }

        if (userData.cvSlug !== cvSlug) {
            console.warn('Slug URL ne correspond pas au slug user')
            router.push({ name: 'not-found' })
            return
        }

        console.log('✅ User authentifié, slug validé')

        cvState.loadModel(cvSlug, userData.cvData, userData.updatedAt)
    } catch (error) {
        console.error('❌ Erreur initialisation:', error)
        router.push({ name: 'error' })
    } finally {
        isLoading.value = false
    }
})

</script>

<template>
    <div
        v-if="isLoading"
        class="loader-container"
    >
        <div class="loader">
            <div class="loader-spinner"></div>
            <p class="loader-text">Chargement du CV...</p>
        </div>
    </div>

    <div v-else-if="cvState.cvData.value">
        <RouterView />

        <transition name="fade">
            <div
                v-if="isGeneratingPdf"
                class="loader-overlay"
            >
                <div class="loader">
                    <div class="loader-spinner"></div>
                    <p class="loader-text">Génération du PDF en cours...</p>
                </div>
            </div>
        </transition>

        <transition name="fade-delayed">
            <div
                v-if="cvState.isSaving.value"
                class="autosave-indicator"
            >
                <div class="status saving">
                    <div class="spinner-small"></div>
                    <span>Sauvegarde...</span>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div
                v-if="cvState.error.value"
                class="error-toast"
            >
                ⚠️ {{ cvState.error.value }}
            </div>
        </transition>

        <PropertiesPanel
            :isColorWheelOpen="isColorWheelOpen"
            :currentColor="cvState.cvData.value.configuration.sidebar.color"
            :collapsed="isPanelCollapsed"
            @toggleColorWheel="toggleColorWheel"
            @changeColor="handleChangeColor"
            @update:collapsed="isPanelCollapsed = $event"
            @layout-hover="isLayoutSelectorHovered = true"
            @layout-leave="isLayoutSelectorHovered = false"
        />

        <div class="zoom-controls">
            <button @click="zoomable._zoom.out()">−</button>
            <div class="zoom-level">{{ zoom }}%</div>
            <button @click="zoomable._zoom.in()">+</button>
        </div>

        <div
            ref="zoomable"
            v-zoom="{ initialZoom: zoom }"
            class="zoomable drag-area"
            :class="{ 'layout-hover': isLayoutSelectorHovered }"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
        >
            <div
                id="a4-container"
                :class="cvState.cvData.value.configuration.template"
                :style="{
                    position: 'absolute',
                    left: position.x + 'px',
                    top: position.y + 'px',
                    pointerEvents: 'none'
                }"
            >
                <div class="top-layout"></div>

                <div class="container">
                    <Sidebar
                        :cvData="cvState.cvData.value"
                        @update:cvData="cvState.cvData.value = $event"
                        @toggleColorWheel="toggleColorWheel"
                    />

                    <MainSection
                        :cvData="cvState.cvData.value"
                        @update:cvData="cvState.cvData.value = $event"
                    />
                </div>
            </div>
        </div>

        <div
            class="disclaimer"
            v-show="!isLocalhost"
        >
            Ce que vous voyez ici est une démo fonctionnelle, gardez à l'esprit
            que certains dysfonctionnements peuvent survenir !
        </div>
    </div>
</template>

<style scoped lang="scss">
.drag-area {
    min-height: 100vh;
    background-color: #f5f5f5;
    position: relative;

    &:hover {
        cursor: move;
    }
}

.fade-delayed-leave-active {
    transition: opacity 0.3s ease 1s;
}

.fade-delayed-leave-to {
    opacity: 0;
}

.disclaimer {
    background-color: #6eafe7;
    color: #f5f5f5;
    font-weight: 600;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    margin: 0 auto;
    padding: 12px;
    font-size: 10pt;
    z-index: 9999;
}

.sidebar,
.main {
    min-width: 0;
    min-height: 0;
    pointer-events: auto;
}

#a4-container {
    background-color: #f8f8f8;
    width: 210mm;
    height: 297mm;
    padding: 9px 9px;
    box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
    box-sizing: border-box;
}

.container {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    height: 100%;
}

:deep(textarea) {
    display: block;
    width: 100%;
    height: auto;
    overflow: hidden;
    resize: none;
    box-sizing: border-box;
    border: none;
    border-radius: 4px;
    scrollbar-width: none;
    padding: 2px;
}

:deep(textarea::-webkit-scrollbar) {
    display: none;
}

@page {
    size: A4 portrait;
    margin: 0;
}

@media print {

    html,
    body {
        margin: 0;
        padding: 0;
        width: 210mm;
        height: 297mm;
        background-color: #fff;
        overflow: hidden;
    }

    body>*:not(#a4-container) {
        display: none !important;
    }

    #a4-container {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        transform: none !important;
        box-shadow: none !important;
        overflow: hidden !important;
        page-break-after: avoid;
        page-break-before: avoid;
        page-break-inside: avoid;
    }

    #a4-container * {
        visibility: visible;
    }

    .drag-area {
        position: static !important;
    }

    #a4-container {
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
        margin: 0 !important;
        box-shadow: none;
        overflow: hidden !important;
    }

    .properties-panel,
    .disclaimer,
    .zoom-controls,
    .autosave-indicator,
    .error-toast,
    .loader-container,
    .loader-overlay,
    .removeItem,
    .upload-overlay,
    .radiusAdjuster,
    .ai-button,
    .custom-tooltip,
    .color-wheel-cursor,
    button {
        display: none !important;
        visibility: hidden !important;
    }
}

.zoom-controls {
    display: flex;
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 5px;
    gap: 10px;
    z-index: 10;
}

.zoom-controls button {
    background: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    transition: background 0.3s;
}

.zoom-btn:hover {
    background: #e0e0e0;
}

.zoom-level {
    color: white;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    font-size: 14px;
}

.autosave-indicator {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-size: 0.875rem;
}

.status {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status.saving {
    color: #2563eb;
}

.status.unsaved {
    color: #64748b;
}

.spinner-small {
    width: 14px;
    height: 14px;
    border: 2px solid #f3f4f6;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.dot {
    width: 6px;
    height: 6px;
    background: #f59e0b;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.error-toast {
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 12px 16px;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 8px;
    border-left: 4px solid #dc2626;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-size: 0.875rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.loader-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    z-index: 9999;
}

.loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(245, 245, 245, 0.85);
    backdrop-filter: blur(4px);
    z-index: 10000;
}

.loader {
    text-align: center;
    background: white;
    padding: 32px 48px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.loader-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e7eb;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

.loader-text {
    color: #1f2937;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>