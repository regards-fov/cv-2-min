<script setup>
import { vTooltip } from '@directives/tooltip';

const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, required: true },
    tooltip: { type: String, default: '' },
    collapsed: { type: Boolean, default: false },
    showContent: { type: Boolean, default: true },
    variant: { type: String, default: 'default' }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
    emit('click', event);
};
</script>

<template>
    <button
        :class="['properties-panel-btn', `variant-${variant}`]"
        @click="handleClick"
        v-tooltip:right="{ text: tooltip, show: collapsed && tooltip }"
    >
        <div class="img-container">
            <img
                :src="icon"
                class="icon"
                :class="{ rotated: variant === 'collapse' && collapsed }"
                alt=""
            />
        </div>
        <span
            class="label"
            v-show="showContent"
        >{{ label }}</span>
        <slot name="suffix" />
    </button>
</template>

<style scoped lang="scss">
.properties-panel-btn {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    font-family: Inter, Roboto, -apple-system, "San Francisco", "Segoe UI", "Helvetica Neue", sans-serif;
    gap: 12px;
    padding: 8px 8px;
    border: none;
    border-radius: 10px;
    background: #ffffff;
    color: #1e293b;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.properties-panel-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%);
    transition: width 0.3s ease;
    z-index: 0;
}

.properties-panel-btn:hover {
    transform: translateX(1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.properties-panel-btn:hover::before {
    width: 100%;
}

.properties-panel-btn:active {
    transform: scale(0.96) translateX(4px);
}

.properties-panel-btn.active {
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
}

.img-container {
    flex-shrink: 0;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
}

.icon.rotated {
    transform: rotate(180deg);
}

.variant-collapse {
    background-color: #f8fafc;
    padding: 8px 11px;
}

.variant-collapse:hover {
    background: #f8fafc;
}

.variant-collapse .icon {
    width: 100%;
    height: 25px;
}


.variant-profil-thumbnail img {
    border-radius: 50%;
}

.label {
    white-space: normal;
    flex: 1;
    text-align: left;
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
</style>