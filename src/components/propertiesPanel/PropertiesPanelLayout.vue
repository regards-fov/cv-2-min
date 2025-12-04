<script setup>
import { computed } from 'vue';
import PropertiesPanelButton from './PropertiesPanelButton.vue';
import LayoutConfigurator from '../ui/LayoutConfigurator.vue';
import { propertiesPanelSections } from '../../config/propertiesPanelConfig';

import chevronDown from '@icons/chevron.svg';

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true },
    isLayoutSelectorOpen: { type: Boolean, required: true }
});

const emit = defineEmits(['update:isLayoutSelectorOpen', 'click:layoutSelector']);

const layoutSection = computed(() =>
    propertiesPanelSections.find(section => section.id === 'layout')
);

const handleLayoutSelectorClick = () => {
    emit('click:layoutSelector');
};
</script>

<template>
    <div class="section">
        <div
            class="category"
            :style="{ color: layoutSection.color }"
            v-show="!collapsed"
        >
            {{ layoutSection.title }}
        </div>
        <div
            v-if="collapsed"
            class="section-separator"
            :class="layoutSection.separatorClass"
        ></div>

        <div class="expandable-wrapper">
            <PropertiesPanelButton
                :icon="layoutSection.expandable.icon"
                :label="layoutSection.expandable.label"
                :tooltip="layoutSection.expandable.tooltip"
                :collapsed="collapsed"
                :show-content="showContent"
                :class="{ active: isLayoutSelectorOpen }"
                @click="handleLayoutSelectorClick"
            >
                <template #suffix>
                    <span
                        class="chevron"
                        :class="{ open: isLayoutSelectorOpen }"
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
                    v-if="isLayoutSelectorOpen && showContent"
                    class="expandable-content"
                >
                    <LayoutConfigurator />
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

.layout-separator {
    background: linear-gradient(90deg, #c53c80 0%, #db6b9d 100%);
    box-shadow: 0 1px 3px rgba(197, 60, 128, 0.3);
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