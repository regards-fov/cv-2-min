<script setup>
import { computed } from 'vue';
import { propertiesPanelSections } from '../../config/propertiesPanelConfig';

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true }
});

const templateSection = computed(() =>
    propertiesPanelSections.find(section => section.id === 'template')
);

const selectTemplate = (template) => {
    console.log('Template sélectionné:', template);
};
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

        <div class="template-buttons">
            <button
                v-for="template in templateSection.templates"
                :key="template"
                class="template-btn"
                @click="selectTemplate(template)"
            >
                {{ template }}
            </button>
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
    background: linear-gradient(90deg, #059669 0%, #10b981 100%);
    box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
}

.template-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.template-btn {
    display: flex;
    position: relative;
    width: 100%;
    font-family: Inter, Roboto, -apple-system, "San Francisco", "Segoe UI", "Helvetica Neue", sans-serif;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.template-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, #059669 0%, #10b981 100%);
    transition: width 0.3s ease;
    z-index: 0;
}

.template-btn:hover {
    transform: translateX(1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: white;
}

.template-btn:hover::before {
    width: 100%;
}

.template-btn:active {
    transform: scale(0.96) translateX(4px);
}
</style>