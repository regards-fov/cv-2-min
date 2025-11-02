<script setup>
import { ref, inject, nextTick } from 'vue'
import ButtonAddContact from "../ui/ButtonAddContact.vue";
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import draggable from 'vuedraggable'


const cvData = inject('cvData')
const defaultCvData = inject('defaultCvData')
const focusTarget = ref(null);
const isDragging = ref(false)

const focusNewInput = async (keys) => {
    await nextTick()
    focusTarget.value = cvData.value.cv[keys].length;
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
    <div class="contact">
        <div class="sidebar-label">
            CONTACT
        </div>
        <draggable
            v-model="cvData.cv.contact"
            item-key="key"
            handle=".draggable"
            animation=150
            easing="cubic-bezier(0.33, 1, 0.68, 1)"
            tag="ul"
            class="list"
        >
            <template #item="{ element, index }">
                <li
                    class="draggable"
                    :class="{ 'is-dragging': isDragging }"
                    @dragstart="isDragging = true"
                    @dragend="isDragging = false"
                >
                    <div class="drag-icon ">
                        <font-awesome-icon
                            icon="fa-solid fa-list"
                            size="sm"
                        />
                    </div>
                    <div class="hoverable item">

                        <ItemEditable
                            class="contact-item"
                            :label="element.key"
                            v-model="element.value"
                            :must-focus="focusTarget === cvData.cv.contact.length"
                            placeholder="Nouveau contact"
                        />

                        <ButtonRemoveItem
                            :show="cvData.cv.contact.length > 1"
                            @delete="removeContact(index)"
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
</style>