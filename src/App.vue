<script setup>
import { provide } from 'vue'
import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";
import { useLocalStorage } from "./composables/useLocalStorage";
import defaultCvData from "./resources/defaultCvData.json";

const dlJSON = () => {
  const jsonLocalStorage = localStorage.getItem("cvData")
  const blob = new Blob([jsonLocalStorage], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cvData.json'
  a.click()

  URL.revokeObjectURL(url)
}

const { value: data, clear: clearCvData } = useLocalStorage(
  "cvData",
  defaultCvData
);

provide('cvData', data)
provide('defaultCvData', defaultCvData)

</script>

<template>
  <!-- <button @click="print">Download PDF</button> -->
  <button @click="clearCvData">Réinitialiser les données</button>
  <button @click="clearLayout">Réinitialiser le template</button>
  <button @click="dlJSON">Télécharger</button>

  <div id="container">
    <Sidebar
      :cvData="data"
      :defaultCvData="defaultCvData"
      @update:cvData="data = $event"
    />

    <MainSection
      :cvData="data"
      :defaultCvData="defaultCvData"
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
  padding: 0 10px 10px 10px;
  margin: 37px auto;
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