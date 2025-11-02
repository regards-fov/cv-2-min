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
    >
        <svg
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="white"
                d="M160 160c9.4-9.4 24.6-9.4 33.9 0l62.1 62.1 62.1-62.1c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L289.9 256l62.1 62.1c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L256 289.9 193.9 352c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L222.1 256 160 193.9c-9.4-9.4-9.4-24.6 0-33.9z"
            />
        </svg>
    </div>
</template>

<style scoped>
.removeItem {
    cursor: pointer;
    z-index: 9;
    margin-top: -13px;
    opacity: 0;
    transition: transform 0.2s;

    &>* {
        width: 20px;
        height: 20px;
        padding: 3px;
        border-radius: 6px;
        background-color: #d06060;
    }
}

.removeItem:hover {
    transform: scale(1.1);
}
</style>
