<script setup>

import { ref, useTemplateRef, onMounted, nextTick, computed, watch } from "vue"

const model = defineModel({
    modelValue: String
})

const props = defineProps({
    name: {
        type: String,
        required: true
    }
})

const label = ref(props.name)
const ta = useTemplateRef(`ta-${label.value}`)
const textareaId = computed(() => `ta-${label.value}`)

const heightAdjust = async () => {
    await nextTick()
    requestAnimationFrame(() => {
        if (!ta.value) return
        ta.value.style.height = 'auto'
        ta.value.style.height = ta.value.scrollHeight + 'px'
    })

    ta.value?.addEventListener('input', () => {
        ta.value.style.height = 'auto'
        ta.value.style.height = ta.value.scrollHeight + 'px'
    })
}

watch(model, () => {
    heightAdjust()
})

watch(() => props.name, (newName) => {
    label.value = newName
    heightAdjust()
})

const getPlaceholder = () => {
    switch (label.value) {
        case "hobbies":
            return 'Vos centres d\'intérêt';
        case "resume":
            return 'Votre profil et motivations en quelques lignes';
        default:
            return 'Description';
    }
}

onMounted(heightAdjust)

</script>

<template>
    <div class="textarea-section hoverable">
        <textarea
            v-bind="$attrs"
            :ref="`ta-${label}`"
            :id="textareaId"
            :name="label"
            v-model="model"
            rows="1"
            :placeholder="getPlaceholder()"
        ></textarea>
    </div>
</template>

<style scoped>
.textarea-section {
    display: flex;
    flex: auto;
    width: 100%;
    box-sizing: border-box;

    textarea::placeholder {
        color: #d8d8d8;
    }
}
</style>