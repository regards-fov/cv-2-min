<script setup>

const emit = defineEmits(["add-language"]);

const handleAddLanguage = () => {
    emit('add');
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