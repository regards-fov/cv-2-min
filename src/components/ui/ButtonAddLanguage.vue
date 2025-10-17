<script setup>

const emit = defineEmits(["addLanguage"]);

const handleAddLanguage = () => {
    emit('addLanguage');
};

</script>
<template>
    <button
        class="addItemButton"
        @click="handleAddLanguage"
        aria-label="Ajouter une nouvelle langue"
    ></button>
</template>

<style scoped lang="scss"></style>