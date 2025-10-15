<script setup>

import { ref, useTemplateRef, onMounted, nextTick, computed } from "vue"

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
const className = `${label.value}-section`
const ta = useTemplateRef(`textarea-${label.value}`)
const textareaId = computed(() => `textarea-${label.value}`)

onMounted(async () => {
    await nextTick()

    ta.value?.addEventListener('input', () => {
        ta.value.style.height = 'auto'
        ta.value.style.height = (ta.value.scrollHeight + 18) + 'px'
    })
    ta.value.style.height = (ta.value.scrollHeight + 18) + 'px'
})
</script>

<template>
    <div
        class="textarea-section"
        :class="className"
    >
        <textarea
            :ref="`textarea-${label}`"
            :id="textareaId"
            :name="label"
            v-model="model"
        ></textarea>
    </div>
</template>

<style scoped></style>