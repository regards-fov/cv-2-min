<script setup>
import { ref, inject, nextTick } from 'vue'
import ButtonAddContact from "../ui/ButtonAddContact.vue";
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import draggable from 'vuedraggable'
import { useDraggable } from '@/composables/useDraggable'

const cvData = inject('cvData')
const defaultCvData = inject('defaultCvData')
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

const addContact = (key, value) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            contact: [...cvData.value.cv['contact'], { key: key, value }]
        }
    }

    focusNewInput('contact')
    focusTarget.value = null
}

const removeContact = (index) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            contact: cvData.value.cv.contact.toSpliced(index, 1)
        }
    }
}
</script>

<template>
    <div
        class="contact"
        :class="{ 'is-dragging': isDragging, 'hover-disabled': hoverDisabled }"
        @mousemove="handleMouseMove"
    >
        <div class="sidebar-label">
            CONTACT
        </div>
        <draggable
            v-model="cvData.cv.contact"
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
            <template #item="{ element, index }">
                <li class="draggable">
                    <div :class="['item', { 'hoverable': !isDragging && !hoverDisabled }]">
                        <ItemEditable
                            class="contact-item"
                            :label="element.key"
                            v-model="element.value"
                            :must-focus="focusTarget === cvData.cv.contact.length"
                            placeholder="Nouveau contact"
                        />
                        <ButtonRemoveItem
                            :show="cvData.cv.contact.length > 1"
                            @click="removeContact(index)"
                        />
                    </div>
                </li>
            </template>
            <template #footer>
                <ButtonAddContact
                    :storedData="cvData.cv.contact"
                    :defaultData="defaultCvData.cv.contact"
                    @addContact="addContact"
                />
            </template>
        </draggable>
    </div>
</template>

<style scoped>
.item {
    flex: 1;
}

.is-dragging :deep(.removeItem),
.hover-disabled :deep(.removeItem) {
    opacity: 0 !important;
}
</style>