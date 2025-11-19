<script setup>
import { computed } from 'vue'
import PictureUploader from "../ui/PictureUploader.vue";
import TextareaSection from "../ui/TextareaSection.vue"
import PersonalInfo from '../blocks/PersonalInfo.vue';
import ContactInfo from '../blocks/ContactInfo.vue';
import SkillsList from '../blocks/SkillsList.vue';
import LanguagesList from '../blocks/LanguagesList.vue';
import colorWheel from '@icons/colorWheel.svg'

const props = defineProps({
  cvData: {
    type: Object,
    required: true,
  }
});

const $userData = computed(() => props.cvData);

const emit = defineEmits(["update:cvData", "toggleColorWheel"]);

const handleSidebarResize = (event) => {
  emit("update:cvData", {
    ...props.cvData,
    layout: {
      ...props.cvData.layout,
      sidebarSize: event.detail.sidebarWidth,
    }
  });
};

const handleClick = (e) => {
  if (e.target !== e.currentTarget) return;
  emit('toggleColorWheel')
}

</script>
<template>

  <div
    id="sidebar"
    class="sidebar"
    v-wcag-adapter="props.cvData.layout.mainColor || '#62b1c9'"
    v-sidebar-resizer="{
      userWidth: props.cvData.layout.sidebarSize,
    }"
    @sidebar-resized="handleSidebarResize"
  >

    <div
      class="topbox box-color"
      v-color-wheel="colorWheel"
      @click="handleClick"
    ></div>

    <PersonalInfo v-model="$userData" />

    <PictureUploader v-model="$userData.cv.picture" />

    <div
      class="infos box-color"
      v-color-wheel="colorWheel"
      @click="handleClick"
    >

      <ContactInfo />

      <SkillsList />

      <LanguagesList />

      <div class="hobbies">
        <div class="sidebar-label">
          CENTRES D'INTÉRÊT
        </div>
        <TextareaSection
          v-model="$userData.cv.hobbies"
          name="hobbies"
          placeholder="Vos centres d'intêret"
        />
      </div>
    </div>
  </div>

</template>
<style lang="scss" scoped>
.topbox {
  min-height: 20px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.box-color {
  background-color: var(--main-box-color);
}

.box-color:hover {
  box-shadow: 0 0 0 2px rgb(112, 181, 255),
    6px 0 12px -3px rgba(112, 181, 255, 0.3),
    -4px 0 6px -3px rgba(112, 181, 255, 0.1);

  transition: .2s;
}

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: var(--sidebar-width);
  gap: 4px;
}

.infos {
  flex: 1;
  border-radius: 6px;
  white-space: normal;
  word-break: break-word;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    border-radius: 6px;
    height: 100%;
    width: 100%;
    background-color: var(--main-box-color);
  }
}

.infos>* {
  position: relative;
}

:deep(.sidebar-label) {
  font-size: larger;
  font-weight: bold;
  margin-bottom: 6px;
}

.contact,
.skills,
.languages {
  border-radius: 6px;
  margin: 14px 12px 4px 12px;
}

.hobbies {
  text-align: left !important;
  padding: 15px 13px;

  .sidebar-label {
    padding: 0 2px;
  }

  .textarea-section {
    padding: 2px;
  }
}

:deep(ul) {
  padding: 0;

  &>* {
    font-size: 11pt;
  }
}

:deep(.list) {
  display: flex;
  flex-direction: column;
  margin: 4px 0 -8px 0px;
  gap: 3px;

  &>div {
    border: 1px solid;
  }

  li {
    display: flex;
    list-style: none;
    position: relative;
    align-items: center;
    margin-right: -10px;
    padding-right: 10px;

    .removeItem {
      position: absolute;
      display: flex;
      top: 0;
      right: 0;
      height: 100%;
      align-items: center;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: -18px;
        margin-left: 11px;
      }
    }

    &:hover .removeItem,
    .removeItem:hover {
      opacity: var(--colorful-opacity);
      transform: translateX(86%);
    }
  }

  & p {
    margin: 0 0;
  }
}

:deep(.list li) {
  display: flex;
  list-style: none;
  position: relative;
  padding-left: 1px;
  align-items: center;

}
</style>