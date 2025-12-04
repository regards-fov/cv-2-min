import { ref, watch } from 'vue';

export function usePropertiesPanelState() {
    const collapsed = ref(true);
    const showContent = ref(!collapsed.value);
    const isColorWheelOpen = ref(false);
    const isLayoutSelectorOpen = ref(false);

    const toggleCollapse = () => {
        collapsed.value = !collapsed.value;
    };

    const handleColorPickerClick = () => {
        if (collapsed.value) {
            isLayoutSelectorOpen.value = false;
            collapsed.value = false;
            if (!isColorWheelOpen.value) {
                isColorWheelOpen.value = true;
            }
        } else {
            isColorWheelOpen.value = !isColorWheelOpen.value;
        }
    };

    const handleLayoutSelectorClick = () => {
        if (collapsed.value) {
            if (isColorWheelOpen.value) {
                isColorWheelOpen.value = false;
            }
            collapsed.value = false;
            if (!isLayoutSelectorOpen.value) {
                isLayoutSelectorOpen.value = true;
            }
        } else {
            isLayoutSelectorOpen.value = !isLayoutSelectorOpen.value;
        }
    };

    watch(collapsed, (isCollapsed) => {
        if (isCollapsed) {
            showContent.value = false;
            isLayoutSelectorOpen.value = false;
            isColorWheelOpen.value = false;
        } else {
            setTimeout(() => {
                showContent.value = true;
            }, 250);
        }
    });

    return {
        collapsed,
        showContent,
        isColorWheelOpen,
        isLayoutSelectorOpen,
        toggleCollapse,
        handleColorPickerClick,
        handleLayoutSelectorClick
    };
}