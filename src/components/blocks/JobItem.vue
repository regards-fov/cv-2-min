<script setup>

import { } from "vue"
import ItemEditable from '../ui/ItemEditable.vue'
import TextareaSection from '../ui/TextareaSection.vue'

const modelValue = defineModel({ type: Object, required: true })

const props = defineProps({
    index: {
        type: Number,
        required: true,
    }
})

</script>
<template>
    <li class="job">
        <div class="job-header">
            <div class="period-container">
                <ItemEditable
                    class="job-date"
                    label="job-date"
                    :defaultFontSize="11"
                    v-model="modelValue.period"
                />
                <div
                    class="extra-date"
                    v-show="modelValue.months !== '' ?? false"
                >
                    <ItemEditable
                        label="job-extra-date"
                        :defaultFontSize="11"
                        v-model="modelValue.months"
                    />
                    <div>&nbsp;mois</div>
                </div>
            </div>
            <ItemEditable
                class="job-label"
                label="job-label"
                :defaultFontSize="11"
                v-model="modelValue.job"
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
.job-header,
.xtra-job-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 4px;
}


.job,
.xtra-job {
    display: flex;
    flex-direction: column;
}

.period-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 0;
}

.extra-date {
    display: flex;
    align-self: flex-end;
    font-size: smaller;
    font-style: italic;
}


.job-label {
    flex: 1;
}

.job-description,
.xtra-job-description {
    font-size: 14px;
    margin-top: 0.25rem;
}

:deep(textarea-job-description) {
    padding: 2px;
}
</style>