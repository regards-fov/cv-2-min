<script setup>

import { ref, watch, computed, nextTick } from "vue"
import vResizer from '../../directives/textResizer'
import vFocus from '../../directives/inputFocus'

const props = defineProps({
    label: String,
    defaultFontSize: Number,
    mustFocus: Boolean,
    allowResizing: {
        type: Object, default: () => ({
            enabled: false
        })
    }
})

const modelValue = defineModel({ type: String })

const editing = ref(false)
const inputRef = ref(null)

const textColor = computed(() =>
    modelValue.value === '' ? '#e2e2e2' : 'inherit'
)

const resizerConfig = computed(() => {
    if (!props.allowResizing.enabled) return false
    return {
        minFontSize: props.allowResizing.minFontSize,
        default: props.defaultFontSize,
        id: props.label
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
}

</script>
<template>
    <div
        :id="label"
        v-show="!editing"
        @click="editing = true"
        v-bind="$attrs"
        :class="label"
        :data-attribute="label"
        :style="{ color: textColor }"
    >
        {{ modelValue || label }}
    </div>
    <input
        ref="inputRef"
        :id="label + '-input'"
        :class="label + '-input restyle-input'"
        v-show="editing"
        v-focus="editing"
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="modelValue"
        :style="{ fontSize: props.defaultFontSize + 'pt' }"
        v-resizer="resizerConfig"
        v-model="modelValue"
    />
</template>

<style scoped lang="scss">
.name-container {
    container-type: inline-size;
}

.personal>div {
    margin: 0 0 6px 0;
}

.username {
    font-size: 24pt;
}

.username,
.username-input {
    font-weight: bold;
}

.username,
.lookup-job {
    flex-shrink: 1;
}

.lookup-job,
.lookup-job-input {
    font-size: x-large;
}

.job-date {
    font-weight: 500;
}

.job-label,
.job-date {
    display: flex;
    margin: 0;
}

.job-label,
.xtra-job-label {
    font-weight: bold;
}

.job-date-input,
.job-label-input {

    width: 39%;
    box-sizing: border-box;
}

.extra-date {
    align-self: flex-end;
    font-size: smaller;
    font-style: italic;
}

.extraInfo1,
.extraInfo2 {
    color: azure;
}

.restyle-input {
    display: block;
    box-sizing: border-box;
    height: auto;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
    color: inherit;
    line-height: normal;
    text-align: inherit;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;

}

.restyle-input:focus {
    outline: none;
}
</style>