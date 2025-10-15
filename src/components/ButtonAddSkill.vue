<script setup>

const emit = defineEmits(["add-skill"]);

const handleAddSkill = () => {
    emit('add-skill', 'Nouvelle compétence');
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