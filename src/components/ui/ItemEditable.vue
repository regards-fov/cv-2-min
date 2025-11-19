<script setup>
import { ref, watch, computed, nextTick, onMounted } from "vue"
import vFocus from '../../directives/inputFocus'
import { useEditingState } from '@/composables/useEditingState'

const props = defineProps({
    label: String,
    mustFocus: Boolean,
    placeholder: { type: String, required: false }
})

const modelValue = defineModel({ type: String })

const { startEditing, endEditing } = useEditingState()

const emit = defineEmits(['handleExtra'])

const editing = ref(false)
const inputRef = ref(null)
const isEmpty = computed(() => !modelValue.value)

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
    editing.value = true
    startEditing()
    nextTick(() => {
        inputRef.value?.focus()
    })
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
    editing.value = false
    endEditing()
    emit('handleExtra')
}
</script>

<template>
    <div
        :class="fieldClasses"
        :id="label"
        v-show="!editing"
        @click="activateEditing"
        v-bind="$attrs"
        :data-attribute="label"
    >
        {{ modelValue || placeholder }}
    </div>
    <input
        ref="inputRef"
        :name="label"
        :id="`${label}-input`"
        :class="inputClasses"
        autocomplete="off"
        v-show="editing"
        v-focus="editing"
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="placeholder"
        v-model="modelValue"
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
    line-height: normal;
    text-align: inherit;
    appearance: none;
    outline: none;
    width: 100%;
}

.extra-padding {
    padding: 2px;
}

.greyed-out {
    color: #dddcdc;
}

.username,
.username-input,
.label,
.label-input,
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
