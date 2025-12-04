<script setup>
import { computed } from 'vue';
import PropertiesPanelButton from './PropertiesPanelButton.vue';
import ColorPicker from '../ui/ColorPicker.vue';
import { propertiesPanelSections } from '../../config/propertiesPanelConfig';
import chevronDown from '@icons/chevron.svg';

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true },
    isColorWheelOpen: { type: Boolean, required: true },
    currentColor: { type: String, required: true }
});

const emit = defineEmits(['update:currentColor', 'click:colorPicker']);

const designSection = computed(() =>
    propertiesPanelSections.find(section => section.id === 'design')
);

const handleColorPickerClick = () => {
    emit('click:colorPicker');
};
</script>

<template>
    <div class="section">
        <div
            class="category"
            :style="{ color: designSection.color }"
            v-show="!collapsed"
        >
            {{ designSection.title }}
        </div>
        <div
            v-if="collapsed"
            class="section-separator"
            :class="designSection.separatorClass"
        ></div>

        <div class="expandable-wrapper">
            <PropertiesPanelButton
                :icon="designSection.expandable.icon"
                :label="designSection.expandable.label"
                :tooltip="designSection.expandable.tooltip"
                :collapsed="collapsed"
                :show-content="showContent"
                :class="{ active: isColorWheelOpen }"
                @click="handleColorPickerClick"
            >
                <template #suffix>
                    <span
                        class="chevron"
                        :class="{ open: isColorWheelOpen }"
                        v-show="showContent"
                    >
                        <img
                            :src="chevronDown"
                            class="icon"
                        />
                    </span>
                </template>
            </PropertiesPanelButton>

            <Transition name="accordion">
                <div
                    v-if="isColorWheelOpen && showContent"
                    class="expandable-content"
                >
                    <ColorPicker
                        :initialColor="currentColor"
                        @changeColor="$emit('update:currentColor', $event)"
                    />
                </div>
            </Transition>
        </div>
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

.design-separator {
    background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
    box-shadow: 0 1px 3px rgba(139, 92, 246, 0.3);
}

.expandable-content {
    border-radius: 0 0 6px 6px;
    background: white;
}

.chevron {
    margin-left: auto;
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chevron img {
    display: block;
    width: 100%;
    height: 100%;
}

.chevron.open {
    transform: rotate(180deg);
}

.accordion-enter-active,
.accordion-leave-active {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
    padding: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 720px;
    opacity: 1;
}
</style>