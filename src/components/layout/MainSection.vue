<script setup>

import { computed } from 'vue'
import TextareaSection from "../ui/TextareaSection.vue"
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ExpItem from "../blocks/ExpItem.vue"
import vDraggable from '../../directives/draggable.js'
import '../../assets/draggable.css'

const cvData = defineModel('cvData', {
    type: Object,
    required: true
});

const $cv = computed(() => cvData.value.cv);

const addItem = (key) => {
    cvData.value =
    {
        ...cvData.value,
        cv: {
            ...$cv.value,
            [key]: [
                ...$cv.value[key],
                {
                    "id": Date.now() + Math.random(),
                    "job": "",
                    "period": "",
                    "extraInfo": "",
                    "description": ""
                }
            ]
        }
    }
}

const removeItem = (category, index) => {
    cvData.value =
    {
        ...cvData.value,
        cv: {
            ...$cv.value,
            [category]: $cv.value[category].toSpliced(index, 1)
        }
    }
}

const handleReorder = ({ modelValue: reorderedItems }) => {
    cvData.value =
    {
        ...cvData.value,
        cv: {
            ...$cv.value,
            jobs:
                reorderedItems
        }
    }
}

</script>
<template>
    <div class="main">
        <section id="resume">
            <TextareaSection
                v-model="$cv.resume"
                name="resume"
            />
        </section>

        <section id="professional-xp">
            <div class="main-label">Expériences professionelles</div>
            <ul class="list">
                <div
                    v-for="(job, index) in $cv.jobs"
                    :key="job.id"
                    class="item"
                    v-draggable="{
                        modelValue: $cv.jobs,
                        onReorder: handleReorder
                    }"
                >
                    <li class="experience">
                        <ExpItem
                            :index="index"
                            type="jobs"
                            v-model="$cv.jobs[index]"
                        />
                        <ButtonRemoveItem @delete="removeItem('jobs', index)" />
                    </li>
                </div>
                <button
                    class="addItemButton"
                    @click="addItem('jobs')"
                >
                </button>
            </ul>
        </section>
        <section id="education">
            <div class="main-label">Formation</div>
            <ul class="list">
                <div
                    v-for="(item, index) in $cv.education"
                    :key="index"
                    class="item"
                >
                    <li class="experience">
                        <ExpItem
                            :index="index"
                            type="education"
                            v-model="$cv.education[index]"
                        />
                        <ButtonRemoveItem @delete="removeItem('education', index)" />
                    </li>
                </div>
                <button
                    class="addItemButton"
                    @click="addItem('education')"
                >
                </button>
            </ul>
        </section>
    </div>

</template>
<style scoped>
.main {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-left: 12px;
    padding: 0 10px;

    & *:focus:not(.addItemButton) {
        box-shadow: 0 0 0 2px Highlight;
        border-radius: 5px;
    }
}

#resume {
    margin-top: 19px;
    margin-bottom: 10px;
    hyphens: auto;
}

#professional-xp .addItemButton {
    width: 100%;
}

.experience:hover:not(:has(* *:hover)) {
    background: lightblue;
}

:deep(#ta-resume) {
    font-size: 12pt;
}

.main-label {
    display: inline-flex;
    padding-right: 4px;
    font-size: x-large;
    border-bottom: 2px solid #cbcfd1;
}

li {
    list-style: none;
    position: relative;

    &:hover>.removeItem::after {
        opacity: .9;
    }

    &:hover>.removeItem::before {
        opacity: var(--colorful-opacity);
    }
}

.list {
    padding-left: 0;
    margin: 6px auto;
}

.item {
    padding: 6px 6px 6px 0;
}
</style>