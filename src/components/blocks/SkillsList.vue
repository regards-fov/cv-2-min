<script setup>
import { ref, inject, nextTick } from 'vue'
import ItemEditable from '../ui/ItemEditable.vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ButtonAddSkill from "../ui/ButtonAddSkill.vue";

const cvData = inject('cvData')

const focusNewInput = async (keys) => {
    await nextTick()
    focusTarget.value = cvData.value.cv[keys].length;
}

const focusTarget = ref(null);

const addSkills = (value) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            skills: [...cvData.value.cv['skills'], value]
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
    <div class="skills">
        <div class="sidebar-label">
            COMPÉTENCES
        </div>
        <ul class="list">

            <li
                v-for="(skill, index) in cvData.cv.skills"
                :key="index"
            >
                <ItemEditable
                    :label="'skills'"
                    v-model="cvData.cv.skills[index]"
                    :defaultFontSize="11"
                    :must-focus="focusTarget === (cvData.cv.skills.length)"
                />

                <ButtonRemoveItem
                    :show="cvData.cv.skills.length > 1"
                    @click="removeSkill(index)"
                />
            </li>

            <ButtonAddSkill @addSkill="addSkills" />

        </ul>
    </div>
</template>
<style scoped>
.skills {
    hyphens: auto;
}
</style>