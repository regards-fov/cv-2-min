<script setup>
import { ref, computed } from 'vue'
import { generatePDF } from '@utils/generatePDF'
import { dataToJson } from '@utils/dataToJson'
import { useCvState } from '@composables/useCvState'
import PropertiesPanelButton from './PropertiesPanelButton.vue'
import ShareCvModal from '../../ui/ShareCvModal.vue'
import { propertiesPanelSections } from '@/config/propertiesPanelConfig'

const { initCV, currentModel } = useCvState()

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true }
})

const isLocalhost = window.location.hostname === 'localhost'

const actionsSection = computed(() =>
    propertiesPanelSections.find(section => section.id === 'actions')
)

const isModalOpen = ref(false)

const share = () => {
    isModalOpen.value = !isModalOpen.value
}

const exportPdf = async () => {
    try {
        await generatePDF('download')
    } catch (err) {
        console.error('Erreur export PDF:', err)
    }
}

const actionHandlers = {
    exportToPDF: exportPdf,
    initCV,
    downloadJson: () => dataToJson(currentModel.value),
    share
}

const shouldShowButton = (button) => {
    if (button.condition === 'isLocalhost') {
        return isLocalhost
    }
    return true
}
</script>

<template>
    <div class="section">
        <div
            class="category"
            :style="{ color: actionsSection.color }"
            v-show="!collapsed"
        >
            {{ actionsSection.title }}
        </div>
        <div
            v-if="collapsed"
            class="section-separator"
            :class="actionsSection.separatorClass"
        ></div>

        <PropertiesPanelButton
            v-for="button in actionsSection.buttons"
            :key="button.id"
            v-show="shouldShowButton(button)"
            :icon="button.icon"
            :label="button.label"
            :tooltip="button.tooltip"
            :collapsed="collapsed"
            :show-content="showContent"
            @click="actionHandlers[button.action]()"
        />

        <ShareCvModal v-model="isModalOpen" />


    </div>
</template>

<style scoped lang="scss">
.section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.category {
    font-weight: 600;
    transition: opacity 0.25s ease;
}

.section-separator {
    height: 3px;
    border-radius: 2px;
    margin: 4px auto;
    width: 68%;
    transition: all 0.3s ease;
}

.user-separator {
    background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
    box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
}
</style>