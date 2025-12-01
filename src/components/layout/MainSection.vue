<script setup>

import { computed } from 'vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import Resume from "../blocks/Resume.vue";
import ExperienceLayout from "../blocks/ExperienceLayout.vue"
import draggable from 'vuedraggable'
import { useDraggable } from '@/composables/useDraggable'

const cvData = defineModel('cvData', {
    type: Object,
    required: true
});

const {
    isDragging,
    isEditing,
    hoverDisabled,
    handleDragStart,
    handleDragEnd,
    handleMouseMove
} = useDraggable()

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

</script>
<template>
    <div
        class="main"
        id="main-section"
    >
        <Resume />
        <section
            id="professional-xp"
            :class="{ 'is-dragging': isDragging, 'hover-disabled': hoverDisabled }"
            @mousemove="handleMouseMove"
        >

            <div class="main-label">Expériences professionelles</div>

            <draggable
                v-model="$cv.jobs"
                item-key="id"
                :disabled="isEditing"
                animation="150"
                easing="cubic-bezier(0.33, 1, 0.58, 1)"
                tag="ul"
                class="list"
                ghost-class="ghost"
                dragClass="sortable-drag"
                @start="handleDragStart"
                @end="handleDragEnd"
            >
                <template #item="{ index }">
                    <li class="experience-item draggable">
                        <div :class="['item', 'header', { 'hoverable': !isDragging && !hoverDisabled }]">
                            <ExperienceLayout
                                :index="index"
                                type="jobs"
                                v-model="$cv.jobs[index]"
                            />
                            <div class="user-actions">
                                <ButtonRemoveItem @click="removeItem('jobs', index)" />
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

        </section>

        <section id="education">
            <div class="main-label">Formation</div>
            <ul class="list">
                <draggable
                    v-model="$cv.education"
                    item-key="id"
                    handle=".draggable"
                    animation=150
                    easing="cubic-bezier(0.33, 1, 0.68, 1)"
                >
                    <template #item="{ index }">
                        <li class="experience-item">
                            <div class="header">
                                <ExperienceLayout
                                    :index="index"
                                    type="education"
                                    v-model="$cv.education[index]"
                                />
                                <ButtonRemoveItem @click="removeItem('education', index)" />
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
    padding: 0px 2px 1px 0;
}

.experience-item:nth-child(n+2) {
    margin-top: 4px;
}

:deep(.ta-desc) {
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

    .removeItem {
        position: absolute;
        margin-top: -13px;
        right: -10px;
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
    margin: 8px auto 4px;
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