<script setup>
import { computed } from 'vue'
import PictureUploader from "../ui/PictureUploader.vue";
import TextareaSection from "../ui/TextareaSection.vue"
import PersonalInfo from '../blocks/PersonalInfo.vue';
import ContactInfo from '../blocks/ContactInfo.vue';
import SkillsList from '../blocks/SkillsList.vue';
import LanguagesList from '../blocks/LanguagesList.vue';

const props = defineProps({
  cvData: {
    type: Object,
    required: true,
  }
});

const $cv = computed(() => props.cvData.cv);

const emit = defineEmits(["update:cvData"]);

const handleSidebarResize = (event) => {
  emit("update:cvData", {
    ...props.cvData,
    layout: {
      ...props.cvData.layout,
      sidebarSize: event.detail.sidebarWidth,
    }
  });
};

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

    <PersonalInfo v-model="$cv.personal" />

    <PictureUploader
      v-model:path="$cv.picture.path"
      v-model:image-border-radius="$cv.picture.imageBorderRadius"
    />

    <div class="infos box-color">

      <ContactInfo />

      <SkillsList />

      <LanguagesList />

      <div class="hobbies">
        <div class="sidebar-label">
          CENTRES D'INTÉRÊT
        </div>
        <TextareaSection
          v-model="$cv.hobbies"
          name="hobbies"
        />
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

.box-color {
  background-color: var(--main-box-color);
}

.sidebar {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: var(--sidebar-width);
  gap: 8px;
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

:deep(.sidebar-label) {
  font-size: larger;
  font-weight: bold;
  color: #f0f1f1;
  margin-bottom: 8px;
}

.contact,
.skills,
.languages {
  border-radius: 6px;
  padding: 15px 15px 4px 15px;
}

.hobbies {
  padding: 15px 13px;

  .sidebar-label {
    padding: 2px;
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
  gap: 0px;
  margin: 4px 0 -8px 0px;

  li {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    position: relative;
    padding-left: 2px;
    margin: 2px 0;

    // &:hover {
    //   border-radius: 5px;
    //   background-color: rgb(236, 236, 236);
    //   color: #8a8a8a;
    //   box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    // }

    &:focus-within {
      box-shadow: 0 0 0 2px Highlight;
      border-radius: 5px;
    }

    &:hover>.removeItem::after {
      opacity: .9;
    }

    &:hover>.removeItem::before {
      opacity: var(--colorful-opacity);
    }
  }

  & p {
    margin: 0 0;
  }
}
</style>