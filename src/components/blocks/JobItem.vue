<script setup>

import { ref } from "vue"
import ItemEditable from '../ui/ItemEditable.vue'
import TextareaSection from '../ui/TextareaSection.vue'

const modelValue = defineModel({ type: Object, required: true })

const props = defineProps({
    index: {
        type: Number,
        required: true,
    }
})
const extraInfo = ref(false)
const toggleExtraInfo = () => {
    return extraInfo.value = !extraInfo.value
}

</script>
<template>
    <li class="job">
        <div class="job-header">
            <ItemEditable
                class="job-date"
                label="job-date"
                v-model="modelValue.period"
            />
            <ItemEditable
                class="job-label"
                label="job-label"
                v-model="modelValue.job"
            />
        </div>

        <div v-if="!extraInfo">
            <div
                class="add-extra-info"
                @click="toggleExtraInfo"
            >
                <span class="plus-button"> </span>
            </div>
        </div>
        <div
            class="xt-info-ctn"
            v-else
        >
            <ItemEditable
                :must-focus=extraInfo
                label="job-extra-info"
                v-model="modelValue.extraInfo"
            />
        </div>

        <TextareaSection
            class="ta-job-desc"
            :name="`job-desc-${props.index}`"
            v-model="modelValue.description"
        />

    </li>
</template>

<style scoped lang="scss">
li {
    list-style: none;
}

.job-header {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.xt-info-ctn {
    width: 50%;
}

.ta-job-desc:hover {
    border-radius: 5px;
    background-color: rgb(236, 236, 236);
    color: #8a8a8a;
    box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
}

.add-extra-info {
    position: relative;
    height: 4px;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        display: block;
        width: 99%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -65%);
        border-top-style: dashed;
        border-color: rgb(94, 94, 94);
        border-width: 2px;
        opacity: 0;
        background-color: #f3f3f3;
        box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    }

    &:hover::before {
        opacity: .8;
    }

    &:hover .plus-button {
        opacity: 1;
    }
}

.plus-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -53%);
    width: 15px;
    height: 15px;
    border-radius: 15%;
    cursor: pointer;
    // background-color: var(--colorful-button-add);
    background-color: #ffffff;
    box-shadow: 0px 1px 1px #20211e40, 0px 0px 1px #1E1F214F;
    opacity: 0;
    transition: opacity 100ms ease;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 2px;
        background-color: rgb(82, 82, 82);
    }

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 8px;
        background-color: rgb(87, 87, 87);
    }
}
</style>