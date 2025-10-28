<script setup>

import { computed, ref } from 'vue'
import TextareaSection from "../ui/TextareaSection.vue"
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ExpItem from "../blocks/ExpItem.vue"
import draggable from 'vuedraggable'


const cvData = defineModel('cvData', {
    type: Object,
    required: true
});

const $cv = computed(() => cvData.value.cv);

const isDragging = ref(false)

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
                    [key === 'jobs' ? 'job' : 'school']: "",
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

const onStartDrag = (e) => {
    isDragging.value = true
    e.item.classList.add('is-placeholder')
}

const onEndDrag = (e) => {
    const el = e.item
    if (el) {
        el.classList.remove('is-chosen')
        el.classList.remove('is-placeholder')
    }
    const handleMouseMove = () => {
        isDragging.value = false
        window.removeEventListener('mousemove', handleMouseMove)
    }
    window.addEventListener('mousemove', handleMouseMove)
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
            <ul
                class="list"
                :class="{ 'is-dragging': isDragging }"
            >
                <draggable
                    v-model="$cv.jobs"
                    item-key="id"
                    handle=".draggable"
                    @start="onStartDrag"
                    @end="onEndDrag"
                    animation=150
                    easing="cubic-bezier(0.33, 1, 0.68, 1)"
                >
                    <template #item="{ index }">
                        <li class="experience-item">
                            <div class="header">
                                <ExpItem
                                    :index="index"
                                    type="jobs"
                                    v-model="$cv.jobs[index]"
                                />
                                <div class="user-actions">
                                    <ButtonRemoveItem @delete="removeItem('jobs', index)" />
                                </div>
                            </div>
                        </li>
                    </template>
                    <template #footer>
                        <button
                            class="addItemButton"
                            @click="addItem('jobs')"
                        >
                        </button>
                    </template>
                </draggable>

            </ul>
        </section>
        <section id="education">
            <div class="main-label">Formation</div>
            <ul class="list">
                <draggable
                    v-model="$cv.education"
                    item-key="id"
                    handle=".draggable"
                    @start="onStartDrag"
                    @end="onEndDrag"
                    animation=150
                    easing="cubic-bezier(0.33, 1, 0.68, 1)"
                >
                    <template #item="{ index }">
                        <li class="experience-item">
                            <div class="header">
                                <ExpItem
                                    :index="index"
                                    type="education"
                                    v-model="$cv.education[index]"
                                />
                                <div class="user-actions">
                                    <ButtonRemoveItem @delete="removeItem('education', index)" />
                                </div>
                            </div>
                        </li>
                    </template>
                    <template #footer>
                        <button
                            class="addItemButton"
                            @click="addItem('education')"
                        >
                        </button>
                    </template>
                </draggable>
            </ul>
        </section>
    </div>

</template>

<style scoped lang="scss">
.user-actions {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-right: -13px;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    position: absolute;
    height: 100%;
    right: 0;
}

.is-placeholder {
    border: 2px dashed #70b5ff;
    background: transparent;
    color: transparent;
    border-radius: 6px;
}

.is-dragging {
    outline: none;
}

.main {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 0 12px;

    & *:focus:not(.addItemButton) {
        box-shadow: 0 0 0 2px #667eea;
        border-radius: 5px;
    }
}

#resume {
    margin-top: 27px;
    margin-bottom: 7px;
    hyphens: auto;
}

#professional-xp .addItemButton {
    width: 100%;
}

.header {
    display: flex;
    width: 100%;
    min-width: 0;
    align-items: stretch;
    border-radius: 4px;
    font-size: 11.5pt;
}

.experience-item {
    padding: 4px 2px 1px 0;
}

:deep(#ta-resume) {
    font-size: 11pt;
}

:deep(.textarea-section) {
    text-align: justify;
}

.main-label {
    display: inline-flex;
    padding-right: 4px;
    font-size: 15pt;
    border-bottom: 2px solid #cbcfd1;
}

li {
    list-style: none;
    position: relative;
    box-sizing: content-box;

    &:hover :deep(.draggable):not(:hover) {
        opacity: .6;
    }

    & .header:hover {
        .removeItem {
            opacity: 1;
        }
    }

    &:hover {
        box-shadow:
            0 0 0 2px rgb(112, 181, 255),
            6px 0 12px -3px rgba(112, 181, 255, 0.3),
            -4px 0 6px -3px rgba(112, 181, 255, 0.1);
        border-radius: 6px;
    }

    &:has(.date:hover),
    &:has(.label:hover),
    &:has(.plus-button:hover),
    &:has(.ta-desc:hover),
    &:has(.add-extra-info:hover),
    &:has(.hoverable:hover) {
        background-color: #fcfcfcb2;
        box-shadow:
            6px 0 12px -3px rgba(112, 181, 255, 0.3),
            -4px 0 6px -3px rgba(112, 181, 255, 0.1);
    }
}

.list {
    padding-left: 0;
    margin: 4px auto;
}
</style>

<style>
.list.is-dragging .draggable,
.list.is-dragging .removeItem {
    pointer-events: none !important;
}

.list.is-dragging li:hover {
    box-shadow: none;
}

.list.is-dragging li:hover .draggable>* {
    opacity: 0 !important;
}

.list.is-dragging li .header:hover .user-actions>.removeItem {
    opacity: 0 !important;
}
</style>