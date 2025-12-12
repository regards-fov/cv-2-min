<script setup>
import { toRefs } from 'vue';
import { useNextItem } from '@/composables/useNextItem';

const props = defineProps({
    ariaLabel: {
        type: String,
        required: true
    },
    storedData: {
        type: Array,
        required: false
    },
    defaultData: {
        type: Object,
        required: false
    }
});

const emit = defineEmits(["click"]);

const handleClick = () => {
    if (props.storedData && props.defaultData) {
        const { storedData, defaultData } = toRefs(props);
        const { getNextItem } = useNextItem(storedData, defaultData);
        const nextItem = getNextItem();

        emit('click', nextItem.key, nextItem.value);
    } else {
        emit('click');
    }
};
</script>

<template>
    <button
        class="addItemButton"
        @click="handleClick"
        :aria-label="ariaLabel"
    ></button>
</template>

<style scoped lang="scss"></style>