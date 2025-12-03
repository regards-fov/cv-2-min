<script setup>
import { inject } from 'vue'

const cvData = inject('cvData')

const setLayout = (layoutConf) => {
    cvData.value.configuration.mainSection.layout = layoutConf
}

const setAlignement = (alignementConf) => {
    cvData.value.configuration.mainSection.textAlign = alignementConf
}
</script>

<template>
    <div class="layout-selector">
        <div>
            <div class="label">Présentation</div>
            <div class="selectors">
                <button
                    @click="setLayout('open')"
                    :class="{ active: cvData.configuration.mainSection.layout === 'open' }"
                >
                    Aérée
                </button>
                <button
                    @click="setLayout('close')"
                    :class="{ active: cvData.configuration.mainSection.layout === 'close' }"
                >
                    Condensée
                </button>
            </div>
        </div>
        <div>
            <div class="label">Alignement</div>
            <div class="selectors">
                <button
                    @click="setAlignement('justify')"
                    :class="{ active: cvData.configuration.mainSection.textAlign === 'justify' }"
                >
                    Justifié
                </button>
                <button
                    @click="setAlignement('normal')"
                    :class="{ active: cvData.configuration.mainSection.textAlign === 'normal' }"
                >
                    Classique
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout-selector {
    display: flex;
    flex-direction: column;
    padding: 10px 16px 22px 16px;
    gap: 16px;
}

.label {
    margin-bottom: 6px;
    font-size: 11pt;
    letter-spacing: 0.8px;
    color: #3b3b3b;
}

.selectors {
    display: flex;
    justify-content: center;
    gap: 8px;
}

.layout-selector button {
    flex: 1;
    max-width: 100px;
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
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 1px 2px rgba(99, 102, 241, 0.2);
        transform: translateY(2px);
    }
}
</style>