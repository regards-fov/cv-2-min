<script setup>

import { ref, watch, computed, nextTick, onMounted } from "vue"
import vFocus from '../../directives/inputFocus'
import vAutoResize from '../../directives/autoResize'

const props = defineProps({
    label: String,
    mustFocus: Boolean,
    placeholder: String
})

const modelValue = defineModel({ type: String })

const emit = defineEmits(['handleExtra'])

const editing = ref(false)

const inputRef = ref(null)

const isEmpty = computed(() =>
    modelValue.value === '' ?? false
)

onMounted(() => {
    if (props.mustFocus) {
        editing.value = true
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
})

watch(() => props.mustFocus, (newVal) => {
    if (newVal) {
        editing.value = true
        nextTick(() => {
            inputRef.value?.focus()
        })
    }
})

const handleKeydown = (e) => {
    if (e.key === "Enter") {
        e.target.blur()
    }
}

const handleBlur = () => {
    editing.value = false
    emit('handleExtra')
}

</script>
<template>
    <div
        :class="[label, 'extra-padding', 'hoverable', { 'greyed - out': isEmpty }]"
        :id="label"
        v-show="!editing"
        @click="editing = true"
        v-bind="$attrs"
        :data-attribute="label"
    >
        {{ modelValue !== '' ? modelValue : props.placeholder }}
    </div>
    <input
        class="extra-padding"
        ref="inputRef"
        :id="label + '-input'"
        :class="label + '-input restyle-input'"
        v-show="editing"
        v-focus="editing"
        v-auto-resize
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder=props.placeholder
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
    min-width: 5.5em;
    text-align: right;
    margin-right: 5px;
}

.extra-info {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    font-style: italic;
    flex-basis: 100%;
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