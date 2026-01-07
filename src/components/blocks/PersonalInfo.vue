<script setup>

import TextareaSection from "../ui/TextareaSection.vue"

const cvData = defineModel({ type: Object, required: true })

</script>
<template>
    <div
        id="personal-info"
        class="personal"
    >
        <TextareaSection
            v-font-size-editor="{ cvData, name: 'fullName', maxSize: 24 }"
            v-model="cvData.cv.personal[2].value"
            name="fullName"
            placeholder="Nom et prénom"
        />

        <TextareaSection
            v-font-size-editor="{ cvData, name: 'lookupJob', maxSize: 18 }"
            v-model="cvData.cv.personal[3].value"
            name="lookupJob"
            placeholder="Poste occupé ou recherché"
        />
    </div>
</template>

<style scoped>
.personal {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 0 10px;
    margin-bottom: 4px;
    color: black;
}

#username>*,
#lookupJob>* {
    padding: 0px 2px;
}

#fullName {
    font-weight: 500;
}

#lookupJob {
    line-height: 19pt;
}
</style>