<script setup>

import TextareaSection from "../ui/TextareaSection.vue"

const cvData = defineModel({ type: Object, required: true })

</script>
<template>
    <div
        id="personal-info"
        class="personal"
    >
        <div class="username-container">
            <TextareaSection
                v-font-size-editor="{ cvData, name: 'username', maxSize: 24 }"
                v-model="cvData.cv.personal[0].value"
                name="username"
                placeholder="Nom Prénom"
            />
        </div>

        <div class="job-lookup-container">
            <TextareaSection
                v-font-size-editor="{ cvData, name: 'lookupJob', maxSize: 18 }"
                v-model="cvData.cv.personal[1].value"
                name="lookupJob"
                placeholder="Poste"
            />
        </div>
    </div>
</template>

<style scoped>
.personal {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 1px;
    color: #0f0f0f;
}
</style>