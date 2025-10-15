<script setup>
import { computed, nextTick, ref } from 'vue'
import EditableInput from "./EditableInput.vue";
import ImageUploader from "./ImageUploader.vue";
import ButtonAddContact from "./ButtonAddContact.vue";
import ButtonAddSkill from "./ButtonAddSkill.vue";
import ButtonAddLanguage from "./ButtonAddLanguage.vue";
import ButtonDeleteItem from "./ButtonDeleteItem.vue";
import languages from "../resources/languages.json";
import TextareaSection from "./blocks/TextareaSection.vue"

const languageList = ref(languages)

const props = defineProps({
  cvData: {
    type: Object,
    required: true,
  },
  defaultCvData: {
    type: Object,
    required: true,
  },
});

const $cv = computed(() => props.cvData.cv);

const emit = defineEmits(["update:cvData"]);

const focusTarget = ref(null);

const handleSidebarResize = (event) => {
  emit("update:cvData", {
    ...props.cvData,
    layout: {
      ...props.cvData.layout,
      sidebarSize: event.detail.sidebarWidth,
    }
  });
};

const focusNewInput = async (keys) => {
  await nextTick()
  focusTarget.value = $cv.value[keys].length;
}

const addSkills = (value) => {
  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...$cv.value,
      skills: [...$cv.value['skills'], value]
    }
  });

  focusNewInput('skills')
  focusTarget.value = null
};

const addContact = (key, value) => {
  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...$cv.value,
      contact: [...$cv.value['contact'], { key: key, value }]
    }
  })

  focusNewInput('contact')
  focusTarget.value = null
}

const addLanguage = () => {
  const maxKey = Math.max(
    ...$cv.value.spokenLanguages.map(lang =>
      parseInt(lang.key.replace('lang', '')) || 0
    )
  )

  emit("update:cvData", {
    ...props.cvData,
    cv: {
      ...$cv.value,
      spokenLanguages: [
        ...$cv.value.spokenLanguages,
        {
          key: `lang${maxKey + 1}`,
          value: "",
          level: "--",
          required: false
        }
      ]
    }
  })
}

const removeItem = (path, index) => {
  const cvData = JSON.parse(JSON.stringify(props.cvData));
  const keys = path.split('.');
  let data = cvData.cv;

  for (let i = 0; i < keys.length - 1; i++) {
    data = data[keys[i]];
  }
  const lastKey = keys[keys.length - 1];

  if (Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('key')) {
    const item = data.find(i => i.key === lastKey);
    const index = data.indexOf(item);
    if (index > -1) {
      data.splice(index, 1);
    }
  }
  else {
    if (data.length < 1) {

      return
    }
    data[lastKey].splice(index, 1);

  }
  emit("update:cvData", cvData);
}

</script>

<template>
  <div
    id="sidebar"
    class="sidebar"
    v-sidebar-resizer="{
      minWidth: 238,
      maxWidth: 340,
      userWidth: props.cvData.layout.sidebarSize,
    }"
    @sidebar-resized="handleSidebarResize"
  >
    <div class="topbox1 box-color"></div>
    <div class="personal">
      <EditableInput
        label="username"
        v-model="$cv.personal[0].value"
        :defaultFontSize="22"
        :allow-resizing="{ enabled: true, minFontSize: 16 }"
      />
      <EditableInput
        label="lookup-job"
        v-model="$cv.personal[1].value"
        :defaultFontSize="18"
        :allow-resizing="{ enabled: true, minFontSize: 14 }"
      />
    </div>

    <ImageUploader
      v-model:path="$cv.picture.path"
      v-model:image-border-radius="$cv.picture.imageBorderRadius"
    />

    <div class="infos box-color">

      <div class="contact">
        <div class="sidebar-label">
          CONTACT
        </div>
        <ul class="contact-list">
          <li
            v-for="(contact, index) in $cv.contact"
            :key="contact.key"
          >
            <EditableInput
              :label="contact.key"
              v-model="$cv.contact[index].value"
              :defaultFontSize="11"
              :must-focus="focusTarget === $cv.contact.length"
            />

            <ButtonDeleteItem
              :show="$cv.contact.length > 1"
              @delete="removeItem(`contact.${contact.key}`, index)"
            />

          </li>
          <ButtonAddContact
            :storedData="$cv.contact"
            :defaultData="defaultCvData.cv.contact"
            @addContact="addContact"
          />
        </ul>
      </div>

      <div class="skills">
        <div class="sidebar-label">
          COMPÉTENCES
        </div>
        <ul class="skills-list">

          <li
            v-for="(skill, index) in $cv.skills"
            :key="index"
          >
            <EditableInput
              :label="'skills'"
              v-model="$cv.skills[index]"
              :defaultFontSize="12"
              :must-focus="focusTarget === ($cv.skills.length)"
            />

            <ButtonDeleteItem
              :show="$cv.skills.length > 1"
              @click="removeItem('skills', index)"
            />
          </li>

          <ButtonAddSkill @addSkill="addSkills" />

        </ul>
      </div>

      <div class="languages">
        <div class="sidebar-label">
          LANGUES
        </div>
        <ul class="languages-list">
          <li
            v-for="(language, index) in $cv.spokenLanguages"
            :key="language.key"
          >
            <label>
              <p>
                <select
                  name="language-name"
                  :id="`language-select-${index}`"
                  class="language-select"
                  v-model="$cv.spokenLanguages[index].value"
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
              </p>
            </label>

            <label :for="`level-select-${index}`"></label>
            <select
              name="language-level"
              :id="`level-select-${index}`"
              v-model="$cv.spokenLanguages[index].level"
            >
              <option value="--">--</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>

            <ButtonDeleteItem
              :show="$cv.spokenLanguages.length > 1"
              @delete="removeItem(`spokenLanguages.${language.key}`, index)"
            />

          </li>

          <ButtonAddLanguage @addLanguage="addLanguage" />

        </ul>
      </div>

      <div class="hobbies">
        <div class="sidebar-label">
          CENTRES D'INTÉRÊT
        </div>
        <ul class="hobbies-list">
          <li>
            <TextareaSection
              v-model="$cv.hobbies"
              name="hobbies"
            />
          </li>
        </ul>
      </div>


    </div>
  </div>
</template>
<style lang="scss" scoped>
.topbox1 {
  min-height: 20px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}


.personal {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px;

  :deep(p) {
    margin: 0;
  }
}

.box-color {
  background-color: var(--main-box-color);
}

.sidebar,
.main {
  min-width: 0;
  min-height: 0;
}

.textarea-section {
  display: flex;
  width: 100%;
}

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: 0 auto;
  width: var(--sidebar-width);
  overflow: hidden;
  gap: 8px;
  padding: 0 6px;
}

.skills-list {
  hyphens: auto;
}

.languages-list {
  p {
    margin: 4px 0;
  }
}

.infos {
  flex: 1;
  border-radius: 6px;
  white-space: normal;
  word-break: break-word;
}

.infos>* {
  color: rgb(241, 241, 224);
}

.sidebar-label {
  font-size: larger;
  font-weight: bold;
  color: #f0f1f1;
  margin-bottom: 8px;
}

.contact,
.skills,
.hobbies,
.languages {
  border-radius: 6px;
  padding: 15px 15px 0px 15px;

}

.languages-list {
  :deep(p) {
    margin: 4px 0;
  }
}

.languages,
.skills,
.contact,
.hobbies {
  ul {
    padding-left: 4px;
  }

  & :deep(p) {
    font-size: 11pt;
  }
}

ul.languages-list li {
  display: flex;
  justify-content: space-between;
}

.languages-list input {
  max-width: 125px;

  &:focus {
    margin: 3px;
  }
}

.skills-list,
.contact-list,
.hobbies-list,
.languages-list {
  margin: 4px 0 -8px 0px;

  li {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    position: relative;

    &:hover>.removeItem::after {
      opacity: .9;
    }

    &:hover>.removeItem::before {
      opacity: var(--colorful-opacity);
    }

    &:hover .newItem:hover~.removeItem::after,
    &:hover .newItem:hover~.removeItem::before {
      opacity: 0 !important;
    }
  }

  & :deep(p) {
    margin: 6px 0;
  }
}

.removeItem {
  cursor: pointer;
  position: absolute;
  right: 0;

  &::before {
    content: '';
    position: absolute;
    top: 9px;
    right: 0;
    background-color: var(--colorful-button-remove);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 1px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    z-index: 3;
    opacity: 0;
  }

  &::after {
    content: "-";
    position: absolute;
    top: 9px;
    right: 0;
    color: #ffffff;
    font-weight: bolder;
    font-size: x-large;
    text-align: center;
    opacity: 0;
    line-height: 10pt;
    margin-right: 2.4px;
    z-index: 4;
  }

  &::before,
  &::after {
    transition: opacity ease-in;
    transition-duration: 122ms;
  }
}

.removeItem:hover::before {
  box-shadow: var(--box-shadow-hover);
}

.language-select {
  width: 88%;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  padding: 0;
  margin: 0;
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