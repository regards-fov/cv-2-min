<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue"
import vFocus from '../../directives/inputFocus'
import { useEditingState } from '@/composables/useEditingState'
import { useDebouncer } from '@/composables/useDebouncer'

const props = defineProps({
    label: String,
    mustFocus: Boolean,
    placeholder: { type: String, required: false }
})

const modelValue = defineModel({ type: String })

const { editing, startEditing, endEditing } = useEditingState()

const { localValue, updateModelValue, flushUpdate, resetLocal } = useDebouncer(
    modelValue,
    { delay: 500, isEditing: editing }
)

const inputRef = ref(null)

const isEmpty = computed(() => !localValue.value)

const fieldClasses = computed(() => [
    props.label,
    'extra-padding',
    { 'greyed-out': isEmpty.value }
])

const inputClasses = computed(() => [
    'extra-padding',
    `${props.label}-input`,
    'restyle-input'
])

const activateEditing = () => {
    resetLocal()
    startEditing()
    nextTick(() => {
        inputRef.value?.focus()
    })
}

const handleInput = () => {
    updateModelValue()
}

onMounted(() => {
    if (props.mustFocus) activateEditing()
})

watch(() => props.mustFocus, (newVal) => {
    if (newVal) activateEditing()
})

const handleKeydown = (e) => {
    if (e.key === "Enter") {
        e.target.blur()
    }
}

const handleBlur = () => {
    flushUpdate()
    endEditing()
}
</script>

<template>
    <div
        :class="fieldClasses"
        v-show="!editing"
        @click="activateEditing"
        v-bind="$attrs"
        :data-attribute="label"
    >
        {{ localValue || placeholder }}
    </div>
    <input
        ref="inputRef"
        :name="label"
        :class="inputClasses"
        autocomplete="off"
        v-show="editing"
        v-focus="editing"
        @blur="handleBlur"
        @input="handleInput"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        v-model="localValue"
    />
</template>

<style scoped lang="scss">
.restyle-input {
    display: block;
    box-sizing: border-box;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    appearance: none;
    outline: none;
    width: 100%;
}

.extra-padding {
    padding: 2px;
}

.username,
.username-input,
.xtra-label,
.xtra-label-input {
    font-weight: bold;
}

.skill,
.contact-item {
    flex: 1;
}

.date,
.date-input {
    font-weight: 500;
    width: 5.5em;
    text-align: right;
    margin-right: 5px;
    line-height: 14pt;
}

//Fix offset on input focus
.date-input {
    width: 5.75em;
}

.extra-info {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    font-style: italic;
    font-size: 10pt;
    margin-top: -2px;
}

.extra-info-input {
    @extend .extra-info;
    gap: 4px;
}

.label {
    overflow: auto;
}

.label-input {
    height: 100%;
}
</style>
