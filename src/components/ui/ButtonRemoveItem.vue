<script setup>

defineProps({
    show: { type: Boolean, default: true }
})

</script>

<template>
    <div
        class="removeItem"
        v-show="show"
        @click="$emit('delete')"
    ></div>
</template>

<style scoped>
.removeItem {
    cursor: pointer;
    position: absolute;
    right: 2px;

    &::before {
        content: '';
        position: absolute;
        right: 0;
        background-color: var(--colorful-button-remove);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 2px 1px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        z-index: 3;
        opacity: 0;
    }

    &::after {
        content: "-";
        position: absolute;
        top: 1px;
        right: 1px;
        color: #ffffff;
        font-weight: bolder;
        font-size: x-large;
        text-align: center;
        opacity: 0;
        line-height: 10pt;
        margin-right: 2.4px;
        z-index: 4;
    }

    &::before,
    &::after {
        transition: opacity ease-in;
        transition-duration: 122ms;
    }
}

.removeItem:hover::before {
    box-shadow: var(--box-shadow-hover);
}
</style>
