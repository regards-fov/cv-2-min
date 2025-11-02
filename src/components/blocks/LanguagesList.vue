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
    <div class="languages">
        <div class="sidebar-label">
            LANGUES
        </div>
        <ul class="list">
            <li
                v-for="(language, index) in cvData.cv.spokenLanguages"
                :key="language.key"
            >
                <div
                    class="hoverable"
                    style="display: flex; flex: 1;flex-direction: row;justify-content: space-between;"
                >

                    <label>
                        <select
                            name="language-name"
                            :id="`language-select-${index}`"
                            class="language-select"
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

                    <label :for="`level-select-${index}`"></label>
                    <select
                        name="language-level"
                        :id="`level-select-${index}`"
                        v-model="cvData.cv.spokenLanguages[index].level"
                    >
                        <option value="--">--</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </select>

                    <ButtonRemoveItem
                        :show="cvData.cv.spokenLanguages.length > 1"
                        @delete="removeItem(index)"
                    />
                </div>

            </li>
            <!-- <div> (TOEIC 960/990) </div> -->

            <ButtonAddLanguage @addLanguage="addLanguage" />
        </ul>
    </div>
</template>
<style scoped>
.languages {
    display: flex;
    flex-direction: column;

    label {
        flex: 1 1 auto;
    }
}

ul li {
    justify-content: space-between;
}

.language-select {
    width: 98%;
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
    width: 20%;
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

.select:focus {
    outline: -webkit-focus-ring-color auto 1px;
}
</style>