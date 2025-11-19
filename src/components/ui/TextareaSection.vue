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

const customFontSize = computed(() => {
    return cvData.value?.layout?.fontSize?.[props.name]
        ? `${cvData.value.layout.fontSize[props.name]}pt`
        : 'inherit'
})

const modelValue = defineModel({ type: String })

const { startEditing, endEditing } = useEditingState()


const emit = defineEmits(['handleExtra'])

const editing = ref(false)
const textareaRef = ref(null)

const isEmpty = computed(() => !modelValue.value)

const fieldClasses = computed(() => [
    'extra-padding',
    { 'greyed-out': isEmpty.value }
])

const textareaClasses = computed(() => [
    'extra-padding',
    'textarea-section',
    `ta-${props.name}`
])

const textareaId = computed(() => `ta-${props.name}`)

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
            :class="[fieldClasses, 'spacing', 'hoverable']"
            :id="name"
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
            :id="textareaId"
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
.spacing {
    white-space: pre-wrap;
}

#username {
    font-weight: 600;
}

#hobbies {
    font-size: 11pt;
    text-align: left;
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
    line-height: normal;
    text-align: inherit;
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

.greyed-out {
    color: #dddcdc;
}

.ta-username {
    font-weight: 600;
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

.resume,
.ta-desc {
    text-align: justify;
}

.hobbies {
    @extend .hover-highlight;
    text-align: left;
    font-size: 11pt;
}

.resume {
    @extend .hover-highlight;
    font-size: 11pt;
}
</style>