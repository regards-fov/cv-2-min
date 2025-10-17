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
console.log(label.value);
const ta = useTemplateRef(`ta-${label.value}`)
const textareaId = computed(() => `ta-${label.value}`)

onMounted(async () => {
    await nextTick()
    requestAnimationFrame(() => {
        console.log('lol');
        if (!ta.value) return
        ta.value.style.height = 'auto'
        ta.value.style.height = ta.value.scrollHeight + 'px'
    })

    ta.value?.addEventListener('input', () => {
        console.log('lolol');
        ta.value.style.height = 'auto'
        ta.value.style.height = ta.value.scrollHeight + 'px'
    })
})
</script>

<template>
    <div class="textarea-section">
        <textarea
            v-bind="$attrs"
            :ref="`ta-${label}`"
            :id="textareaId"
            :name="label"
            v-model="model"
            rows="1"
        ></textarea>
    </div>
</template>

<style scoped>
.textarea-section {
    display: flex;
    flex: auto;
    width: 100%;
    box-sizing: border-box !important;
    padding: 2px;
}
</style>