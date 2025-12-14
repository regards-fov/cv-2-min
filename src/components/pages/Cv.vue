<script setup>
import { ref, provide, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCvState } from "@composables/useCvState";
import { useCssSync } from '@composables/useCssSync'
import { useDraggableDocument } from '@composables/useDraggableDocument'
import { vZoom } from '@directives/zoomable';
import MainSection from "../layout/MainSection.vue";
import PropertiesPanel from "../layout/propertiesPanel/PropertiesPanel.vue"
import Sidebar from "../layout/SideBar.vue";

const route = useRoute()

const { cvData, defaultCvData, loadModel } = useCvState();

const userCanEdit = computed(() => route.name === 'cv.edit')

provide('cvData', cvData);
provide('defaultCvData', defaultCvData);

const isLocalhost = window.location.hostname === 'localhost'
const isColorWheelOpen = ref(false);
const isPanelCollapsed = ref(true);
const zoomable = ref(null);
const zoom = ref(100);

const {
    position,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    initializeZoomWatcher
} = useDraggableDocument(zoom, zoomable)

const toggleColorWheel = () => {
    isColorWheelOpen.value = !isColorWheelOpen.value;
    if (isColorWheelOpen.value && isPanelCollapsed.value) {
        isPanelCollapsed.value = false;
    }
};

useCssSync(cvData, [
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
    if (cvData.value) {
        cvData.value.configuration.sidebar.color = color;
    }
}

initializeZoomWatcher(cvData)

onMounted(() => {
    const cvSlug = route.params.slug
    if (cvSlug && localStorage.getItem(cvSlug)) {
        loadModel(cvSlug)
    }
})

</script>

<template>
    <div
        v-if="cvData"
        :class="{ 'read-only-mode': !userCanEdit }"
    >
        <RouterView />

        <PropertiesPanel
            :isColorWheelOpen="isColorWheelOpen"
            :currentColor="cvData.configuration.sidebar.color"
            :collapsed="isPanelCollapsed"
            @toggleColorWheel="toggleColorWheel"
            @changeColor="handleChangeColor"
            @update:collapsed="isPanelCollapsed = $event"
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
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
        >
            <div
                id="a4-container"
                :class="cvData.configuration.template"
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
                        :cvData="cvData"
                        @update:cvData="cvData = $event"
                        @toggleColorWheel="toggleColorWheel"
                    />

                    <MainSection
                        :cvData="cvData"
                        @update:cvData="cvData = $event"
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
            <span
                v-if="!userCanEdit"
                style="display: block; margin-top: 5px; font-weight: bold;"
            >
                👁️ Mode lecture seule
            </span>
        </div>
    </div>
    <div
        v-else
        class="loader-container"
    >
        <div class="loader">
            <div class="loader-spinner"></div>
            <p class="loader-text">Chargement du CV...</p>
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

.disclaimer {
    background-color: rgb(153, 42, 110);
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

    @top-left {
        content: none;
    }

    @top-center {
        content: none;
    }

    @top-right {
        content: none;
    }

    @bottom-left {
        content: none;
    }

    @bottom-center {
        content: none;
    }

    @bottom-right {
        content: none;
    }

}

@media print {

    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    body * {
        visibility: hidden;
    }

    #a4-container,
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
    button {
        display: none !important;
    }

    * {
        page-break-inside: avoid;
        page-break-after: avoid;
    }

    .zoom-controls {
        display: none !important;
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

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.loader-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0e0e0;
    border-top-color: #62b1c9;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loader-text {
    color: #666;
    font-size: 16px;
    font-weight: 500;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
<style>
* {
    /* pointer-events: none */
}
</style>