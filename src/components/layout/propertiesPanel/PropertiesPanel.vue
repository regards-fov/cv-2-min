<script setup>
import { ref, computed, watch, inject } from "vue"
import PropertiesPanelButton from '../propertiesPanel/PropertiesPanelButton.vue'
import PropertiesPanelActions from '../propertiesPanel/PropertiesPanelActions.vue'
import PropertiesPanelDesign from '../propertiesPanel/PropertiesPanelDesign.vue'
import PropertiesPanelLayout from '../propertiesPanel/PropertiesPanelLayout.vue'
import PropertiesPanelTemplate from "../propertiesPanel/PropertiesPanelTemplate.vue"
import iconCollapse from '@icons/collapse.svg'
import PropertiesPanelUserProfile from "./PropertiesPanelUserProfile.vue"

const cvData = inject('cvData')

const props = defineProps({
    isColorWheelOpen: { type: Boolean, required: true },
    currentColor: { type: String, required: true },
    collapsed: { type: Boolean, required: true },
    isLayoutSelectorOpen: Boolean

})

const emit = defineEmits(
    [
        'toggleColorWheel',
        'changeColor',
        'update:collapsed',
        'layout-hover',
        'layout-leave'
    ]
)

const showContent = ref(!props.collapsed)
const isLayoutSelectorOpen = ref(false)
const isTemplateSelectorOpen = ref(false)

const toggleCollapse = () => {
    emit('update:collapsed', !props.collapsed)
}

const handleColorPickerClick = () => {
    if (props.collapsed) {
        isLayoutSelectorOpen.value = false
        emit('update:collapsed', false)
        if (!props.isColorWheelOpen) {
            emit('toggleColorWheel')
        }
    } else {
        emit('toggleColorWheel')
    }
}

const handleLayoutSelectorClick = () => {
    if (props.collapsed) {
        emit('update:collapsed', false)
        if (!isLayoutSelectorOpen.value) {
            isLayoutSelectorOpen.value = true
        }
    } else {
        isLayoutSelectorOpen.value = !isLayoutSelectorOpen.value
    }
}

const handleTemplateSelectorClick = () => {
    if (props.collapsed) {
        emit('update:collapsed', false)
        if (!isTemplateSelectorOpen.value) {
            isTemplateSelectorOpen.value = true
        }
    } else {
        isTemplateSelectorOpen.value = !isTemplateSelectorOpen.value
    }
}

const handleColorChange = (color) => {
    emit('changeColor', color)
}

watch(() => props.collapsed, (isCollapsed) => {
    if (isCollapsed) {
        showContent.value = false
        isLayoutSelectorOpen.value = false
        isTemplateSelectorOpen.value = false
        if (props.isColorWheelOpen) {
            emit('toggleColorWheel')
        }
    } else {
        setTimeout(() => {
            showContent.value = true
        }, 250)
    }
})

const containerClass = computed(() => ({
    'properties-panel': true,
    'collapsed': props.collapsed
}))
</script>

<template>

    <div :class="containerClass">
        <PropertiesPanelButton
            variant="collapse"
            :icon="iconCollapse"
            label="Réduire le panneau"
            tooltip="Ouvrir le panneau"
            :collapsed="collapsed"
            :show-content="showContent"
            @click="toggleCollapse"
        />

        <PropertiesPanelUserProfile
            :collapsed="collapsed"
            :show-content="showContent"
        />

        <PropertiesPanelActions
            :collapsed="collapsed"
            :show-content="showContent"
        />

        <PropertiesPanelDesign
            :isColorWheelOpen="isColorWheelOpen"
            :currentColor="currentColor"
            :collapsed="collapsed"
            :show-content="showContent"
            @click:color-picker="handleColorPickerClick"
            @update:currentColor="handleColorChange"
        />

        <PropertiesPanelLayout
            v-model:isLayoutSelectorOpen="isLayoutSelectorOpen"
            :collapsed="collapsed"
            :show-content="showContent"
            @click:layout-selector="handleLayoutSelectorClick"
            @layout-hover="$emit('layout-hover')"
            @layout-leave="$emit('layout-leave')"
        />

        <PropertiesPanelTemplate
            v-model:isTemplateSelectorOpen="isTemplateSelectorOpen"
            :collapsed="collapsed"
            :show-content="showContent"
            @click:template-selector="handleTemplateSelectorClick"
        />
    </div>
</template>

<style scoped lang="scss">
.properties-panel {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    box-sizing: border-box;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 16px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    box-shadow: 0 2px 4px rgba(96, 135, 208, 0.3);
    transition: width 0.25s ease;
    overflow: hidden;
}

.properties-panel.collapsed {
    width: 60px;
    padding-left: 8px;
    padding-right: 8px;
}
</style>