<script setup>
import { ref, inject, nextTick } from 'vue'
import ButtonAddContact from "../ui/ButtonAddContact.vue";
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";

const cvData = inject('cvData')
const defaultCvData = inject('defaultCvData')
const focusTarget = ref(null);

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
        <ul class="list">
            <li
                v-for="(contact, index) in cvData.cv.contact"
                :key="contact.key"
                class="hoverable"
            >
                <ItemEditable
                    class="contact-item"
                    :label="contact.key"
                    v-model="cvData.cv.contact[index].value"
                    :must-focus="focusTarget === cvData.cv.contact.length"
                    placeholder="Nouveau contact"
                />

                <ButtonRemoveItem
                    :show="cvData.cv.contact.length > 1"
                    @delete="removeContact(index)"
                />

            </li>
            <ButtonAddContact
                :storedData="cvData.cv.contact"
                :defaultData="defaultCvData.cv.contact"
                @addContact="addContact"
            />
        </ul>
    </div>
</template>
<style scoped></style>