<script setup>

const emit = defineEmits(["addSkill"]);

const handleAddSkill = () => {
    emit('addSkill');
};

</script>
<template>
    <button
        class="addItemButton"
        @click="handleAddSkill"
        aria-label="Ajouter une nouvelle compétence"
    ></button>
</template>

<style scoped lang="scss"></style>