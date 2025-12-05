<script setup>
import { ref, inject } from 'vue'
import ButtonRemoveItem from "../ui/ButtonRemoveItem.vue";
import ButtonAddLanguage from "../ui/ButtonAddLanguage.vue";
import languages from "../../resources/languages.json";

const cvData = inject('cvData')

const languageList = ref(languages)

const addLanguage = () => {
    const maxKey = Math.max(
        ...cvData.value.cv.spokenLanguages.map(lang =>
            parseInt(lang.key.replace('lang', '')) || 0
        )
    )

    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            spokenLanguages: [
                ...cvData.value.cv.spokenLanguages,
                {
                    key: `lang${maxKey + 1}`,
                    value: "",
                    level: "--",
                    required: false
                }
            ]
        }
    }
}

const removeItem = (index) => {
    cvData.value = {
        ...cvData.value,
        cv: {
            ...cvData.value.cv,
            spokenLanguages: cvData.value.cv.spokenLanguages.toSpliced(index, 1)
        }
    }
}

</script>
<template>
    <div class="block languages">
        <div class="sidebar-label">
            LANGUES
        </div>
        <ul class="list">
            <li
                v-for="(language, index) in cvData.cv.spokenLanguages"
                :key="language.key"
                class="hoverable item"
            >

                <label>
                    <select
                        name="language-name"
                        :id="`language-select-${index}`"
                        v-model="cvData.cv.spokenLanguages[index].value"
                    >
                        <option value="">--</option>
                        <option
                            v-for="item in languageList"
                            :key="item.code"
                            :value="item.name"
                        >
                            {{ item.name }}
                        </option>
                    </select>
                </label>
                <label :for="`level-select-${index}`">
                    <select
                        name="language-level"
                        :id="`level-select-${index}`"
                        v-model="cvData.cv.spokenLanguages[index].level"
                    >
                        <option value="--">--</option>
                        <option value="A1">Débutant</option>
                        <option value="B2">Intermédiaire</option>
                        <option value="C1">Avancé</option>
                    </select>
                </label>

                <ButtonRemoveItem
                    :show="cvData.cv.spokenLanguages.length > 1"
                    @click="removeItem(index)"
                />

            </li>
            <!-- <div> (TOEIC 960/990) </div> -->

            <ButtonAddLanguage @addLanguage="addLanguage" />
        </ul>
    </div>
</template>
<style scoped>
ul li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    background: transparent;
    color: inherit;
    padding: 0;
    margin: 0;
    font-size: 11pt;
    font-family: "Inter";
    outline: none;
    box-shadow: none;
    min-width: 0;
    height: auto;
    text-align: inherit;
    text-transform: none;
    letter-spacing: normal;
    cursor: pointer;
}

select option {
    color: #000;
    background-color: #fff;
}
</style>