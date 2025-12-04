<script setup>

import { ref, computed, nextTick, onMounted, watch, inject } from "vue"
import vFocus from '../../directives/inputFocus'
import { useEditingState } from '@/composables/useEditingState'


const cvData = inject('cvData')

const props = defineProps({
    name: { type: String, required: true },
    placeholder: { type: String, default: '' },
    mustFocus: { type: Boolean, default: false }
})

const modelValue = defineModel({ type: String })

const emit = defineEmits(['handleExtra'])

const customFontSize = computed(() => {
    return cvData.value?.configuration?.fontSize?.[props.name]
        ? `${cvData.value.configuration.fontSize[props.name]}pt`
        : ''
})

const { startEditing, endEditing } = useEditingState()

const editing = ref(false)

const textareaRef = ref(null)

const isEmpty = computed(() => !modelValue.value)

const itemClasses = computed(() => [
    'extra-padding',
    'item',
    'hoverable',
    { 'greyed-out': isEmpty.value }
])

const textareaClasses = computed(() => [
    'extra-padding',
    'textarea-section',
    'hoverable',
    `ta-${props.name}`
])

const heightAdjust = () => {
    if (!textareaRef.value) return

    requestAnimationFrame(() => {
        textareaRef.value.style.height = 'auto'
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
    })
}

const activateEditing = async () => {
    editing.value = true
    startEditing()

    await nextTick()
    textareaRef.value?.focus()
    heightAdjust()
}

const handleInput = () => {
    heightAdjust()
}

const handleKeydown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
        e.target.blur()
    }
}

const handleBlur = () => {
    editing.value = false
    endEditing()
    emit('handleExtra')
}

onMounted(async () => {
    if (props.mustFocus) {
        await activateEditing()
    }

    if (document.fonts) {
        document.fonts.ready
            .then(heightAdjust)
            .catch(() => { })
    }
})

watch(() => props.mustFocus, (newVal) => {
    if (newVal) activateEditing()
})

watch(modelValue, () => {
    if (editing.value) {
        nextTick(heightAdjust)
    }
})

</script>

<template>
    <div
        :id="props.name"
        :style="{ fontSize: customFontSize }"
    >
        <div
            :class="itemClasses"
            v-show="!editing"
            @click="activateEditing"
            v-bind="$attrs"
            :data-attribute="name"
        >
            {{ modelValue || placeholder }}
        </div>
        <textarea
            ref="textareaRef"
            :class="textareaClasses"
            :name="name"
            v-show="editing"
            v-focus="editing"
            v-model="modelValue"
            @input="handleInput"
            @blur="handleBlur"
            @keydown="handleKeydown"
            rows="1"
            :placeholder="props.placeholder"
            autocomplete="off"
        ></textarea>
    </div>
</template>

<style scoped lang="scss">
#username {
    font-weight: 600;
}

.textarea-section {
    display: flex;
    flex: auto;
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
    color: inherit;
    text-align: inherit;
    line-height: inherit;
    appearance: none;
    outline: none;
    resize: none;
    overflow: hidden;
    cursor: text;

    &:hover {
        color: var(--greyed-text);
        background-color: var(--hover-bg);
    }

    &::placeholder {
        color: #d8d8d8;
    }
}

.extra-padding {
    padding: 2px;
}

.ta-username {
    font-weight: 600;
}

.hover-highlight {
    white-space: pre-wrap;
    word-wrap: break-word;

    &:hover {
        box-shadow:
            0 0 0 2px rgb(112, 181, 255),
            6px 0 12px -3px rgba(112, 181, 255, 0.3),
            -4px 0 6px -3px rgba(112, 181, 255, 0.1);
        border-radius: 6px;
    }
}

.hobbies {
    @extend .hover-highlight;
}

.resume {
    @extend .hover-highlight;
    font-size: 11pt;
}
</style>