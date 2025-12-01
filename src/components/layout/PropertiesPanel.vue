<script setup>
import { ref, computed, watch } from "vue";
import { exportToPDF } from "../../utils/toPDF";
import { useCvState } from '../../composables/useCvState';
import { dataToJson } from "../../utils/dataToJson";
import { vTooltip } from '../../directives/tooltip';
import ColorPicker from '../ui/ColorPicker.vue';
import LayoutSelector from '../ui/LayoutSelector.vue';
import chevronDown from '@icons/chevron.svg';
import iconExport from '@icons/export.svg';
import iconReset from '@icons/reset.svg';
import iconDownload from '@icons/download.svg';
import iconColor from '@icons/color.svg';
import iconCollapse from '@icons/collapse.svg';
import iconLayout from '@icons/layout.svg';


const { currentModel, initCV } = useCvState();

const props = defineProps({
    isColorWheelOpen: { type: Boolean, required: true },
    currentColor: { type: String, required: true },
    collapsed: { type: Boolean, required: true }
});

const emit = defineEmits(['toggleColorWheel', 'changeColor', 'update:collapsed']);

const isJobLayoutSelectorOpen = ref(false);
const showContent = ref(!props.collapsed);

const isLocalhost = window.location.hostname === 'localhost';

const downloadJson = () => dataToJson(currentModel.value);

const toggleCollapse = () => {
    emit('update:collapsed', !props.collapsed);
}

const handleColorPickerClick = () => {
    if (props.collapsed) {
        isJobLayoutSelectorOpen.value = false;

        emit('update:collapsed', false);
        if (!props.isColorWheelOpen) {
            emit('toggleColorWheel');
        }
    } else {
        emit('toggleColorWheel');
    }
};

const handleLayoutSelectorClick = () => {
    if (props.collapsed) {
        if (props.isColorWheelOpen) {
            emit('toggleColorWheel');
        }

        emit('update:collapsed', false);
        if (!isJobLayoutSelectorOpen.value) {
            isJobLayoutSelectorOpen.value = true;
        }
    } else {
        isJobLayoutSelectorOpen.value = !isJobLayoutSelectorOpen.value;
    }
};

watch(() => props.collapsed, (isCollapsed) => {
    if (isCollapsed) {
        showContent.value = false;
        isJobLayoutSelectorOpen.value = false;
    } else {
        setTimeout(() => {
            showContent.value = true;
        }, 250);
    }
});

const containerClass = computed(() => ({
    'left-container': true,
    'collapsed': props.collapsed
}));
</script>

<template>
    <div :class="containerClass">
        <button
            class="collapse-btn"
            @click="toggleCollapse"
            :aria-pressed="collapsed"
            v-tooltip:right="{ text: 'Ouvrir le panneau', show: collapsed }"
        >
            <img
                :src="iconCollapse"
                alt=""
                class="icon"
            />
            <span
                class="label "
                v-show="showContent"
            >Réduire le panneau</span>

        </button>

        <div class="data-actions">
            <div class="category user-actions">ACTIONS</div>
            <div
                v-if="collapsed"
                class="section-separator user-separator"
            ></div>
            <button
                @click="exportToPDF"
                v-tooltip:right="{ text: 'Exporter en PDF', show: collapsed }"
            >
                <img
                    :src="iconExport"
                    class="icon"
                />
                <span
                    class="label "
                    v-show="showContent"
                >Exporter en PDF</span>
            </button>

            <button
                @click="initCV"
                v-tooltip:right="{ text: 'Réinitialiser les données', show: collapsed }"
            >
                <img
                    :src="iconReset"
                    class="icon"
                />
                <span
                    class="label "
                    v-show="showContent"
                >Réinitialiser les données</span>
            </button>

            <div v-show="!isLocalhost">
                <button @click="downloadJson">
                    <img
                        :src="iconDownload"
                        class="icon"
                    />
                    <span
                        class="label "
                        v-show="showContent"
                    >Télécharger</span>
                </button>
            </div>
        </div>

        <div class="design-actions">
            <div class="category template-actions">TEMPLATE & DESIGN </div>
            <div
                v-if="collapsed"
                class="section-separator template-separator"
            ></div>
            <div class="color-picker-wrapper">
                <button
                    @click="handleColorPickerClick"
                    :class="{ active: isColorWheelOpen }"
                    v-tooltip:right="{ text: 'Modifier la couleur principale', show: collapsed }"
                >
                    <img
                        :src="iconColor"
                        class="icon"
                    />
                    <span
                        class="label "
                        v-show="showContent"
                    >Couleur principale</span>
                    <span
                        class="chevron "
                        :class="{ open: isColorWheelOpen }"
                        v-show="showContent"
                    >
                        <img
                            :src="chevronDown"
                            class="icon"
                        />
                    </span>
                </button>

                <Transition name="accordion">
                    <div
                        v-if="isColorWheelOpen && showContent"
                        id="sidebar-color-picker"
                        class="color-picker-container"
                    >
                        <ColorPicker
                            :initialColor="currentColor"
                            @changeColor="$emit('changeColor', $event)"
                        />
                    </div>
                </Transition>
            </div>

            <div class="layout-selection-wrapper">
                <button
                    @click="handleLayoutSelectorClick"
                    :class="{ active: isJobLayoutSelectorOpen }"
                    v-tooltip:right="{ text: 'Modifier le format ', show: collapsed }"
                >
                    <img
                        :src="iconLayout"
                        class="icon"
                    />
                    <span
                        class="label "
                        v-show="showContent"
                    >Format</span>
                    <span
                        class="chevron "
                        :class="{ open: isJobLayoutSelectorOpen }"
                        v-show="showContent"
                    >
                        <img
                            :src="chevronDown"
                            class="icon"
                        />
                    </span>
                </button>

                <Transition name="accordion">
                    <div
                        v-if="isJobLayoutSelectorOpen && showContent"
                        id="job-layout-selector"
                        class="layout-selector-container"
                    >
                        <LayoutSelector />
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.left-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    box-sizing: border-box;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 16px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    height: 100%;
    box-shadow: 0 2px 4px rgba(96, 135, 208, 0.3);
    transition: width 0.25s ease;
    overflow: hidden;
}

.left-container.collapsed {
    width: 64px;
    padding-left: 8px;
    padding-right: 8px;

    .category {
        display: none;
    }

    .color-picker-wrapper,
    .layout-selection-wrapper {

        .accordion-enter-from,
        .accordion-leave-to,
        .color-picker-container,
        .layout-selector-container {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
        }
    }
}

.collapse-btn {
    align-self: flex-end;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: white;
    border: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease;

    .icon {
        transition: transform 0.3s ease;
    }
}

.left-container.collapsed .collapse-btn .icon {
    transform: rotate(180deg);
}

.data-actions,
.design-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
}

.category {
    font-weight: 600;
    transition: opacity 0.25s ease;
}

.user-actions {
    color: #3b82f6;
}

.template-actions {
    color: #8b5cf6;
}

.left-container button {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border: none;
    border-radius: 12px;
    background: #ffffff;
    color: #1e293b;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    letter-spacing: 0.4px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.left-container button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: var(--button-bg-hover);
    transition: width 0.3s ease;
}

.left-container button:hover {
    transform: translateX(1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.left-container button:hover::before {
    width: 100%;
}

.left-container button:active {
    transform: scale(0.96) translateX(4px);
}

.data-actions button:hover {
    color: #3b82f6;
}

.design-actions button:hover {
    color: #8b5cf6;
}

.left-container .icon {
    width: 28px;
    height: 28px;
}

.label {
    white-space: normal;
    line-height: 14px;
}

.fade-in {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-5px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
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

.template-separator {
    background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
    box-shadow: 0 1px 3px rgba(139, 92, 246, 0.3);
}

.left-container.collapsed .label {
    display: none;
}

.left-container.collapsed button {
    justify-content: center;
    padding: 8px;
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

.left-container.collapsed .chevron {
    display: none;
}

.color-picker-container,
.layout-selector-container {
    border-radius: 0 0 6px 6px;
    background: white;
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