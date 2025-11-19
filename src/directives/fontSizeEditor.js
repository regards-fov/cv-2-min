import { createApp } from 'vue';
import FontSizeModal from '../components/ui/FontResizerModal.vue';

export default {
  mounted(el, binding) {

    const { cvData, name, maxSize } = binding.value

    let modalApp = null;
    let modalContainer = null;

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

      const currentSizeInPx = parseFloat(window.getComputedStyle(targets[0]).fontSize);
      const currentSizeInPt = Math.round(currentSizeInPx * 3 / 4);

      return currentSizeInPt;
    };

    const changeFontSize = (delta) => {
      const targets = getTargetElements();
      console.log('🎯 Name:', name);
      console.log('🎯 Targets:', targets);
      console.log('🎯 Targets length:', targets.length);
      if (targets.length === 0) return;

      const currentSize = getCurrentFontSize();
      console.log('📏 Current size:', currentSize);


      const newSize = Math.max(10, currentSize + delta);

      console.log('📏 New size:', newSize);

      console.log('🔍 Element:', el);
      console.log('🔍 Element children:', el.children);

      console.log(el);
      el.style.fontSize = `${newSize}pt`;

      cvData.layout.fontSize[name] = newSize;
      console.log('💾 cvData.layout.fontSize:', cvData.layout.fontSize);


      if (modalApp) {
        closeModal();
        openModal();
      }
    };

    const closeModal = () => {
      if (!modalApp) return;

      modalApp.unmount();
      modalContainer?.remove();
      modalApp = null;
      modalContainer = null;
      document.removeEventListener('click', handleOutsideClick);
    };

    const handleOutsideClick = (e) => {
      if (modalApp &&
        !modalContainer?.contains(e.target) &&
        !el.contains(e.target)) {
        closeModal();
      }
    };

    const openModal = () => {
      if (modalApp) return;

      modalContainer = document.createElement('div');
      modalContainer.className = 'modal-container';
      modalContainer.style.position = 'absolute';
      modalContainer.style.top = '0';
      modalContainer.style.left = '0';
      modalContainer.style.zIndex = '9999';

      document.body.appendChild(modalContainer);

      const currentRect = el.getBoundingClientRect();

      modalContainer.style.width = initialWidth + 'px';
      modalContainer.style.left = currentRect.left + 'px';
      modalContainer.style.top = (currentRect.top - 10) + 'px';

      const currentSize = getCurrentFontSize();

      modalApp = createApp(FontSizeModal, {
        targetEl: modalContainer,
        currentSize: currentSize,
        isMaxSize: currentSize >= maxSize,
        isMinSize: currentSize <= 10,
        onIncrease: () => changeFontSize(1),
        onDecrease: () => changeFontSize(-1),
      });

      modalApp.mount(modalContainer);

      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    };

    const handleClick = (e) => {
      if (!modalApp) {
        e.stopPropagation();
        openModal();
      }
    };

    el.addEventListener('click', handleClick);
    el._fontSizeEditor = {
      handleClick,
      closeModal
    };

    el.style.cursor = 'pointer';
  },

  unmounted(el) {
    if (el._fontSizeEditor) {
      el.removeEventListener('click', el._fontSizeEditor.handleClick);
      el._fontSizeEditor.closeModal();
    }
  }
};