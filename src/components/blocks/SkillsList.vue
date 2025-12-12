<script setup>
import { ref, inject, nextTick } from 'vue'
import ItemEditable from '../ui/ItemEditable.vue'
import RemoveItemButton from "../ui/RemoveItemButton.vue";
import AddItemButton from "../ui/AddItemButton.vue"
import draggable from 'vuedraggable'
import { useDraggable } from '@/composables/useDraggable'

const cvData = inject('cvData')
const focusTarget = ref(null)

const {
    isDragging,
    isEditing,
    hoverDisabled,
    handleDragStart,
    handleDragEnd,
    handleMouseMove
} = useDraggable()

const focusNewInput = async (keys) => {
    await nextTick()
    focusTarget.value = cvData.value.cv[keys].length
}

const handleAddSkill = () => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            skills: [...cvData.value.cv['skills'], ""]
        }
    }
    focusNewInput('skills')
    focusTarget.value = null
}

const removeSkill = (index) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            skills: cvData.value.cv.skills.toSpliced(index, 1)
        }
    }
}
</script>

<template>
    <div
        class="block skills"
        :class="{ 'is-dragging': isDragging, 'hover-disabled': hoverDisabled }"
        @mousemove="handleMouseMove"
    >
        <div class="sidebar-label">
            COMPÉTENCES
        </div>
        <draggable
            v-model="cvData.cv.skills"
            item-key="key"
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
                <li class="draggable">
                    <div :class="['item', { 'hoverable': !isDragging && !hoverDisabled }]">
                        <ItemEditable
                            :label="'skill'"
                            v-model="cvData.cv.skills[index]"
                            :must-focus="focusTarget === (cvData.cv.skills.length)"
                            placeholder="Nouvelle compétence"
                        />
                        <RemoveItemButton
                            :show="cvData.cv.skills.length > 1"
                            @click="removeSkill(index)"
                        />
                    </div>
                </li>
            </template>
            <template #footer>
                <AddItemButton
                    aria-label="Ajouter une nouvelle compétence"
                    @click="handleAddSkill"
                />
            </template>
        </draggable>
    </div>
</template>

<style scoped>
.skills {
    hyphens: none;
}

.item {
    flex: 1;
}

.is-dragging :deep(.removeItem),
.hover-disabled :deep(.removeItem) {
    opacity: 0 !important;
}
</style>