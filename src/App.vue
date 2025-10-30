<script setup>
import { ref, provide, computed, watch } from 'vue'
import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";
import { useLocalStorage } from "./composables/useLocalStorage";
import { dataToJson } from "./utils/dataToJson";
import { exportToPDF } from "./utils/toPDF";
import cvType1 from "./resources/cvType1.json";
import cvType2 from "./resources/cvType2.json";
import cvType3 from "./resources/cvType3.json";

const cvModels = {
  'cvType1': cvType1,
  'cvType2': cvType2,
  'cvType3': cvType3
};

const currentModel = ref('cvType1');

// Fonction pour créer une nouvelle instance de storage
const createStorage = (modelKey) => {
  return useLocalStorage(modelKey, cvModels[modelKey]);
};

// Instance actuelle du storage
let uls = createStorage(currentModel.value);

// Reactive ref pour les données
const cvData = ref(uls.data.value);

// Watch pour synchroniser les changements de données avec le localStorage
watch(cvData, (newData) => {
  uls.data.value = newData;
}, { deep: true });

// Fonction pour charger un nouveau modèle
const loadModel = (model) => {
  currentModel.value = model;
  // Créer une nouvelle instance de storage
  uls = createStorage(model);
  // Mettre à jour les données réactives
  cvData.value = uls.data.value;
};

// Fonction pour réinitialiser le CV
const initCV = () => {
  uls.clear();
  cvData.value = uls.data.value;
};

// Provide pour les composants enfants
provide('cvData', cvData);
provide('defaultCvData', computed(() => cvModels[currentModel.value]));

// Fonction de téléchargement
const downloadJson = () => {
  dataToJson(cvData.value, currentModel.value);
};
</script>

<template>
  <div>
    <button @click="exportToPDF">Exporter PDF</button>
    <button @click="initCV">INIT CV</button>
    <button @click="loadModel('cvType1')">LOAD CV MODEL 1</button>
    <button @click="loadModel('cvType2')">LOAD CV MODEL 2</button>
    <button @click="loadModel('cvType3')">LOAD CV MODEL 3</button>
    <button @click="downloadJson">Télécharger</button>

    <div id="a4-container">
      <Sidebar
        :cvData="cvData"
        @update:cvData="cvData = $event"
      />

      <MainSection
        :cvData="cvData"
        @update:cvData="cvData = $event"
      />
    </div>
  </div>
</template>

<style scoped>
.sidebar,
.main {
  min-width: 0;
  min-height: 0;
}

#a4-container {
  background-color: whitesmoke;
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  width: 210mm;
  height: 297mm;
  padding: 0 12px 10px 12px;
  margin: 38px auto;
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
  box-sizing: border-box;
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

@page {
  size: A4 portrait;
  margin: 0;
  /* Pas de marge navigateur */

  /* Supprime en-têtes et pieds de page du navigateur */
  @top-left {
    content: none;
  }

  @top-center {
    content: none;
  }

  @top-right {
    content: none;
  }

  @bottom-left {
    content: none;
  }

  @bottom-center {
    content: none;
  }

  @bottom-right {
    content: none;
  }

}

@media print {

  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  body * {
    visibility: hidden;
  }

  #a4-container {
    margin: 0 auto;
    box-shadow: none;
    overflow: hidden !important;
  }

  button {
    display: none !important;
  }

  * {
    page-break-inside: avoid;
    page-break-after: avoid;
  }
}
</style>