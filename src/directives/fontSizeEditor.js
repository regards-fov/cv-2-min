// FontSizeModalManager.js
import { createApp } from 'vue';
import FontSizeModal from '../components/ui/FontResizerModal.vue';

let modalApp = null;
let modalContainer = null;
let currentEl = null;

const handleOutsideClick = (e) => {
  if (modalContainer &&
    !modalContainer.contains(e.target) &&
    currentEl && !currentEl.contains(e.target)) {
    FontSizeModalManager.close();
  }
};

export const FontSizeModalManager = {
  open({ el, currentSize, maxSize, onIncrease, onDecrease, initialWidth }) {
    this.close();

    currentEl = el;
    modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.position = 'absolute';
    modalContainer.style.zIndex = '9999';
    document.body.appendChild(modalContainer);

    const rect = el.getBoundingClientRect();
    modalContainer.style.width = initialWidth + 'px';
    modalContainer.style.left = rect.left + 'px';
    modalContainer.style.top = (rect.top - 10) + 'px';

    modalApp = createApp(FontSizeModal, {
      targetEl: modalContainer,
      currentSize,
      isMaxSize: currentSize >= maxSize,
      isMinSize: currentSize <= 10,
      onIncrease,
      onDecrease
    });

    modalApp.mount(modalContainer);

    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 0);
  },

  close() {
    if (!modalApp) return;

    modalApp.unmount();
    modalContainer?.remove();
    modalApp = null;
    modalContainer = null;
    currentEl = null;

    document.removeEventListener('click', handleOutsideClick);
  }
};

// Directive file\import { FontSizeModalManager } from './FontSizeModalManager';

export default {
  mounted(el, binding) {
    const { cvData, name, maxSize } = binding.value;

    const initialRect = el.getBoundingClientRect();
    const initialWidth = initialRect.width;

    const getTargetElements = () => {
      const firstChild = el.firstElementChild;
      const sibling = firstChild?.nextElementSibling;
      return firstChild && sibling ? [firstChild, sibling] : [];
    };

    const getCurrentFontSize = () => {
      const targets = getTargetElements();
      if (targets.length === 0) return;

      const currentPx = parseFloat(getComputedStyle(targets[0]).fontSize);
      return Math.round(currentPx * 3 / 4);
    };

    const changeFontSize = (delta) => {
      const size = getCurrentFontSize();
      const newSize = Math.max(10, size + delta);

      el.style.fontSize = `${newSize}pt`;
      cvData.layout.fontSize[name] = newSize;

      FontSizeModalManager.open({
        el,
        initialWidth,
        currentSize: newSize,
        maxSize,
        onIncrease: () => changeFontSize(1),
        onDecrease: () => changeFontSize(-1)
      });
    };

    const handleClick = (e) => {
      e.stopPropagation();
      FontSizeModalManager.open({
        el,
        initialWidth,
        currentSize: getCurrentFontSize(),
        maxSize,
        onIncrease: () => changeFontSize(1),
        onDecrease: () => changeFontSize(-1)
      });
    };

    el.addEventListener('click', handleClick);
    el._fontSizeEditor = { handleClick };

    el.style.cursor = 'pointer';
  },

  unmounted(el) {
    if (el._fontSizeEditor) {
      el.removeEventListener('click', el._fontSizeEditor.handleClick);
    }
  }
};
