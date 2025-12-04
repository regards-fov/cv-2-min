<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useCvState } from "./composables/useCvState";
import { useCssSync } from './composables/useCssSync'
import PropertiesPanel from "./components/layout/PropertiesPanel.vue"
import MainSection from "./components/layout/MainSection.vue";
import Sidebar from "./components/layout/SideBar.vue";
import { vZoom } from './directives/zoomable';

const { cvData, defaultCvData } = useCvState();

provide('cvData', cvData);
provide('defaultCvData', defaultCvData);

const isLocalhost = window.location.hostname === 'localhost'
const isColorWheelOpen = ref(false);
const isPanelCollapsed = ref(true);
const zoomable = ref(null);
const zoom = ref(100);

const toggleColorWheel = () => {
  isColorWheelOpen.value = !isColorWheelOpen.value;
  if (isColorWheelOpen.value && isPanelCollapsed.value) {
    isPanelCollapsed.value = false;
  }
};

useCssSync(cvData, [
  {
    path: 'configuration.sidebar.color',
    cssVar: '--main-color'
  },
  {
    path: 'configuration.mainSection.textAlign',
    cssVar: '--text-align'
  }
])

const handleChangeColor = (color) => {
  cvData.value.configuration.sidebar.color = color;
}

const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

const centerContainer = () => {
  const container = document.getElementById('a4-container');
  if (!container) return;

  const scale = zoom.value / 100;
  const scaledWidth = container.offsetWidth * scale;
  const scaledHeight = container.offsetHeight * scale;

  position.value = {
    x: (window.innerWidth - scaledWidth) / 2,
    y: (window.innerHeight - scaledHeight) / 2
  };
};

onMounted(() => {
  if (zoomable.value?._zoom) {
    zoomable.value._zoom.onChange((z) => {
      zoom.value = Math.round(z * 100);
    });
  }
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
    :currentColor="cvData.configuration.sidebar.color"
    :collapsed="isPanelCollapsed"
    @toggleColorWheel="toggleColorWheel"
    @changeColor="handleChangeColor"
    @update:collapsed="isPanelCollapsed = $event"
  />

  <div class="zoom-controls">
    <button @click="zoomable._zoom.out()">−</button>
    <div class="zoom-level">{{ zoom }}%</div>
    <button @click="zoomable._zoom.in()">+</button>
    <button @click="zoomable._zoom.reset()">⟲</button>
  </div>

  <div
    ref="zoomable"
    v-zoom="{ initialZoom: zoom }"
    class="zoomable drag-area"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div
      id="a4-container"
      :class="cvData.configuration.template"
      :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        pointerEvents: 'none'
      }"
    >
      <div class="top-layout"></div>

      <div class="container">
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
  background-color: #f8f8f8;
  width: 210mm;
  height: 297mm;
  padding: 9px 9px;
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

  .zoom-controls {
    display: none !important;
  }
}

.zoomable-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: white;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.zoomable-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  transform-origin: center center;
  transition: transform 0.2s ease;
  padding: 30px;
}

.zoom-controls {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.zoom-btn {
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background 0.3s;
}

.zoom-btn:hover {
  background: #e0e0e0;
}

.zoom-level {
  color: white;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  font-size: 14px;
}
</style>