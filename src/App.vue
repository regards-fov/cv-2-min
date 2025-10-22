<script setup>
import { ref, provide, toRef } from 'vue'
import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";
import { useLocalStorage } from "./composables/useLocalStorage";
import cvType1 from "./resources/cvType1.json";
import cvType2 from "./resources/cvType2.json";
import cvType3 from "./resources/cvType3.json";

const cvModels = {
  'cvType1': cvType1,
  'cvType2': cvType2,
  'cvType3': cvType3
};

const currentModel = ref('cvType1');

const dlJSON = () => {
  const jsonLocalStorage = localStorage.getItem(currentModel.value)
  const blob = new Blob([jsonLocalStorage], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cvData.json'
  a.click()

  URL.revokeObjectURL(url)
}

const uls = useLocalStorage(currentModel.value, cvModels[currentModel.value])
const data = toRef(uls, 'data')

// watch(currentModel, () => {
//   uls = useLocalStorage(currentModel.value, cvModels[currentModel.value])
// })

provide('cvData', uls.data)
provide('defaultCvData', cvModels[currentModel.value])

</script>

<template>
  <!-- <button @click="print">Download PDF</button> -->
  <button @click="uls.clear()">INIT CV</button>
  <button @click="uls.load()">LOAD CV</button>
  <button @click="clearLayout">Réinitialiser le template</button>
  <button @click="dlJSON">Télécharger</button>

  <div id="container">
    <Sidebar
      :cvData="data"
      @update:cvData="data = $event"
    />

    <MainSection
      :cvData="uls.data.value"
      @update:cvData="data = $event"
    />

  </div>

</template>

<style scoped>
.sidebar,
.main {
  min-width: 0;
  min-height: 0;
}

#container {
  background-color: whitesmoke;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  width: 210mm;
  height: 297mm;
  padding: 0 12px 10px 12px;
  margin: 38px auto;
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
}

:deep(textarea) {
  all: unset;
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  resize: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  scrollbar-width: none;
  font-size: 11pt;
  padding: 2px;

  &:focus-within {
    box-shadow: 0 0 0 2px Highlight;
    border-radius: 5px;
  }
}

:deep(textarea::-webkit-scrollbar) {
  display: none;
}
</style>