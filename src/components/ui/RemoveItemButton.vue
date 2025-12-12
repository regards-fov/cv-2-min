<script setup>

import cross from '@icons/cross.svg'

defineProps({
    show: { type: Boolean, default: true }
})

</script>

<template>
    <div
        class="removeItem"
        v-show="show"
    >
        <img
            :src="cross"
            alt=""
            class="icon"
        />
    </div>
</template>

<style scoped>
.removeItem {
    cursor: pointer;
    z-index: 2;
    opacity: 0;
    transition: transform 0.2s;

    &>* {
        width: 20px;
        height: 20px;
        padding: 3px;
        border-radius: 6px;
        background-color: var(--button-negative);
    }
}

.removeItem:hover {
    transform: scale(1.1);
}
</style>
