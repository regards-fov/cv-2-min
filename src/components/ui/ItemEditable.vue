<script setup>

import { ref, watch, computed, nextTick } from "vue"
import vFocus from '../../directives/inputFocus'
import vAutoResize from '../../directives/autoResize'

const props = defineProps({
    label: String,
    mustFocus: Boolean
})

const modelValue = defineModel({ type: String })

const editing = ref(false)
const inputRef = ref(null)

const textColor = computed(() =>
    modelValue.value === '' ? '#e2e2e2' : 'inherit'
)

watch(() => props.mustFocus, (newVal, oldVal) => {
    console.log(newVal, oldVal);
    if (newVal & newVal !== oldVal) {
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
        class="extra-padding"
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
        class="extra-padding"
        ref="inputRef"
        :id="label + '-input'"
        :class="label + '-input restyle-input'"
        v-show="editing"
        v-focus="editing"
        v-auto-resize
        @blur="handleBlur"
        @keydown="handleKeydown"
        :placeholder="label"
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
}

.username,
.username-input,
.job-label,
.job-label-input,
.xtra-job-label,
.xtra-job-label-input {
    font-weight: bold;
}

.job-date,
.job-date-input {
    font-weight: 500;
}

.job-extra-info {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    font-style: italic;
    flex-basis: 100%;
    font-size: 10pt;
    margin-top: -2px;
}

.job-extra-info-input {
    display: flex;
    justify-content: flex-start;
    gap: 4px;
    align-self: flex-end;
    font-style: italic;
    flex-basis: 100%;
    padding: 2px;
    font-size: 10pt;
}

.job-label {
    flex: 1;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    position: relative;
    margin-left: 13px;
}

.job-date:hover,
.job-label:hover,
.job-extra-info:hover {
    border-radius: 5px;
    background-color: #ececec;
    color: #8a8a8a;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
}

.job-label-input {
    height: 100%;
    margin-left: 13px;
}

.extra-padding {
    padding: 2px;
}

.ta-job-desc {
    padding: 2px;
}
</style>