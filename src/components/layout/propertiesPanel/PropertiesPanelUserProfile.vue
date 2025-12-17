<script setup>
import { inject } from 'vue';
import { useCvState } from '@composables/useCvState';
import PropertiesPanelButton from './PropertiesPanelButton.vue';
import { propertiesPanelSections } from '@/config/propertiesPanelConfig';
import { useRoute } from 'vue-router'

const route = useRoute().fullPath

const cvData = inject('cvData')

const props = defineProps({
    collapsed: { type: Boolean, required: true },
    showContent: { type: Boolean, required: true }
});

const handleGoToProfile = () => {
    console.log('profile check');
}
</script>

<template>
    <div class="section">
        <PropertiesPanelButton
            variant="profil-thumbnail"
            key="profile"
            :icon="cvData.cv.picture.path"
            :label="`Bonjour, ${cvData.cv.personal[0].value}`"
            tooltip="Profil"
            :collapsed="collapsed"
            :show-content="showContent"
            @click="handleGoToProfile"
        />
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