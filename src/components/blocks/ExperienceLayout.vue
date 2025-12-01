<script setup>

import { ref, nextTick, inject, computed } from "vue"
import ItemEditable from '../ui/ItemEditable.vue'
import TextareaSection from '../ui/TextareaSection.vue'

const cvData = inject('cvData')

const layout = computed(() => {
    return cvData.value.layout.mainSectionLayout
})

const modelValue = defineModel({ type: Object, required: true })

const props = defineProps({
    index: { type: Number, required: true },
    type: { type: String, required: true }
})

const focusExtraInfo = ref(false)
const extraInfo = ref(modelValue.value.extraInfo !== '');

const toggleExtraInfo = () => {
    focusExtraInfo.value = !focusExtraInfo.value
    extraInfo.value = !extraInfo.value
}

const handleExtra = () => {
    nextTick(() => {
        extraInfo.value = modelValue.value.extraInfo !== '' ?? false
        focusExtraInfo.value = false
    })
}

const config = {
    jobs: {
        mainField: 'job',
        placeholder: 'Poste',
        hasExtraInfo: true
    },
    education: {
        mainField: 'school',
        placeholder: 'Intitulé',
        hasExtraInfo: false
    }
}

const category = config[props.type]

</script>
<template>
    <div v-if="layout === 'open'">
        <ItemEditable
            class="date extra-padding hoverable"
            label="date"
            v-model="modelValue.period"
            placeholder="Date"
        />
    </div>
    <div class="right">
        <div class="top-line">
            <ItemEditable
                class="job-label extra-padding hoverable"
                label="label"
                v-model="modelValue[category.mainField]"
                :placeholder="category.placeholder"
            />
            <div v-if="layout === 'close'">
                <ItemEditable
                    class="date extra-padding hoverable"
                    label="date"
                    v-model="modelValue.period"
                    placeholder="Date"
                />
            </div>
        </div>
        <div v-if="category.hasExtraInfo">
            <div
                v-if="!extraInfo"
                class="add-extra-info"
                @click="toggleExtraInfo"
            >
                <div class="plus-button">+</div>
            </div>

            <div
                class="xt-info-ctn"
                v-else
            >
                <ItemEditable
                    class="hoverable"
                    :must-focus=focusExtraInfo
                    label="extra-info"
                    v-model="modelValue.extraInfo"
                    @handleExtra="handleExtra"
                />
            </div>
        </div>
        <TextareaSection
            class="ta-desc"
            :name="`${props.type}-desc-${props.index}`"
            v-model="modelValue.description"
            placeholder="Description"
        />
    </div>
</template>

<style scoped lang="scss">
.top-line {
    display: flex;
    justify-content: space-between;
}

.experience {
    position: relative;
}

.left {
    display: flex;
    flex-direction: column;
}

.draggable {
    display: flex;
    position: relative;
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    opacity: 0;
    cursor: move;

    &:hover {
        transition: all 111ms ease;
        opacity: 1;
    }

    &>* {
        color: #4b4b4b;
    }
}

.draggable:active>* {
    transform: scale(0.9);
    color: #70b5ff;
    filter: drop-shadow(0 0 8px rgba(112, 181, 255, 0.8));
}

.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
}

.xt-info-ctn {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

:deep(.ta-desc >*) {
    font-size: 10.3pt;
}

.add-extra-info {
    position: relative;
    height: 0px;
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
        border-color: #535353;
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
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -53%) rotate(45deg);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #cccccc;
    box-shadow: 0px 1px 1px #1e202140, 0px 0px 1px #1E1F214F;
    opacity: 0;
    transition: opacity 100ms ease;
}
</style>