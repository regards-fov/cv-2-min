<script setup>
import { computed, inject } from 'vue';
import PropertiesPanelButton from './PropertiesPanelButton.vue';
import { propertiesPanelSections } from '../../../config/propertiesPanelConfig';
import chevronDown from '@icons/chevron.svg';

const cvData = inject('cvData')

const isTemplateSelectorOpen = defineModel('isTemplateSelectorOpen', { type: Boolean, required: true })

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true }
});

const emit = defineEmits(['click:templateSelector']);

const templateSection = computed(() =>
    propertiesPanelSections.find(section => section.id === 'template')
);

const handleTemplateSelectorClick = () => {
    emit('click:templateSelector');
};

const selectTemplate = (template) => {
    cvData.value.configuration.template = template
}
</script>

<template>
    <div class="section">
        <div
            class="category"
            :style="{ color: templateSection.color }"
            v-show="!collapsed"
        >
            {{ templateSection.title }}
        </div>
        <div
            v-if="collapsed"
            class="section-separator"
            :class="templateSection.separatorClass"
        ></div>

        <div class="expandable-wrapper">
            <PropertiesPanelButton
                :icon="templateSection.expandable.icon"
                :label="templateSection.expandable.label"
                :tooltip="templateSection.expandable.tooltip"
                :collapsed="collapsed"
                :show-content="showContent"
                :class="{ active: isTemplateSelectorOpen }"
                @click="handleTemplateSelectorClick"
            >
                <template #suffix>
                    <span
                        class="chevron"
                        :class="{ open: isTemplateSelectorOpen }"
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
                    v-if="isTemplateSelectorOpen && showContent"
                    class="expandable-content"
                >


                    <div class="template-selector">
                        <button
                            v-for="template in templateSection.templates"
                            :key="template"
                            :class="['template-btn', { active: cvData.configuration.template === template }]"
                            @click="selectTemplate(template)"
                        >
                            {{ template }}
                        </button>
                    </div>


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

.template-separator {
    background: var(--conf-template-color);
    box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
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

.template-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
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

.template-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 8px;
    background: #f1f5f9;
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(0);

    &:hover {
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.12);
        background: #e2e8f0;
    }

    &:active {
        transform: translateY(2px);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    &.active {
        background: var(--conf-template-color);
        color: white;
        box-shadow: 0 1px 2px rgba(99, 102, 241, 0.2);
        transform: translateY(2px);
    }
}
</style>