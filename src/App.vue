<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useCvState } from "./composables/useCvState";
import PropertiesPanel from "./components/layout/PropertiesPanel.vue"
import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";

const { cvData, defaultCvData } = useCvState();

provide('cvData', cvData);
provide('defaultCvData', defaultCvData);

const isLocalhost = window.location.hostname === 'localhost'

const isColorWheelOpen = ref(false);
const isPanelCollapsed = ref(true);

const toggleColorWheel = () => {
  isColorWheelOpen.value = !isColorWheelOpen.value;

  if (isColorWheelOpen.value && isPanelCollapsed.value) {
    isPanelCollapsed.value = false;
  }
};

watch(() => cvData.value.layout?.mainColor, (newColor) => {
  if (newColor) {
    document.documentElement.style.setProperty('--main-box-color', newColor)
  }
}, { immediate: true })

const handleChangeColor = (color) => {
  cvData.value.layout.mainColor = color;
}

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const centerContainer = () => {
  const container = document.getElementById('a4-container');
  if (container) {
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    position.value = {
      x: (window.innerWidth + 250 - containerWidth) / 2,
      y: (window.innerHeight - containerHeight) / 2
    };
  }
};

onMounted(() => {
  centerContainer();
});

const handleMouseDown = (e) => {
  if (e.target.classList.contains('drag-area')) {
    isDragging.value = true;
    dragOffset.value = {
      x: e.clientX - position.value.x,
      y: e.clientY - position.value.y
    };
  }
};

const handleMouseMove = (e) => {
  if (isDragging.value) {
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y
    };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

</script>

<template>
  <PropertiesPanel
    :isColorWheelOpen="isColorWheelOpen"
    :currentColor="cvData.layout.mainColor"
    :collapsed="isPanelCollapsed"
    @toggle-color-wheel="toggleColorWheel"
    @change-color="handleChangeColor"
    @update:collapsed="isPanelCollapsed = $event"
  />

  <div
    class="drag-area"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >

    <div
      id="a4-container"
      :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        pointerEvents: 'none'
      }"
    >
      <div class="top-layout"></div>

      <div class="container classic-layout">
        <Sidebar
          :cvData="cvData"
          @update:cvData="cvData = $event"
          @toggleColorWheel="toggleColorWheel"
        />

        <MainSection
          :cvData="cvData"
          @update:cvData="cvData = $event"
        />
      </div>

    </div>
  </div>
  <div
    class="disclaimer"
    v-show="!isLocalhost"
  >Ce que vous voyez ici est une démo fonctionnelle, gardez à l'esprit
    que certains dysfonctionnements peuvent survenir !</div>
</template>

<style scoped lang="scss">
.drag-area {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;

  &:hover {
    cursor: move;
  }
}

.disclaimer {
  background-color: rgb(153, 42, 110);
  color: #f5f5f5;
  font-weight: 600;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  margin: 0 auto;
  padding: 12px;
  font-size: 10pt;
  z-index: 9999;
}

.sidebar,
.main {
  min-width: 0;
  min-height: 0;
  pointer-events: auto;
}

#a4-container {
  background-color: whitesmoke;
  width: 210mm;
  height: 297mm;
  padding: 0 12px 10px 12px;
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);
  box-sizing: border-box;
}

.container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100%;
}

:deep(textarea) {
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  resize: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  scrollbar-width: none;
  padding: 2px;
}

:deep(textarea::-webkit-scrollbar) {
  display: none;
}

@page {
  size: A4 portrait;
  margin: 0;

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

  #a4-container,
  #a4-container * {
    visibility: visible;
  }

  .drag-area {
    position: static !important;
  }

  #a4-container {
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    transform: none !important;
    margin: 0 !important;
    box-shadow: none;
    overflow: hidden !important;
  }

  .left-container,
  .disclaimer,
  button {
    display: none !important;
  }

  * {
    page-break-inside: avoid;
    page-break-after: avoid;
  }
}
</style>