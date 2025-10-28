<script setup>

import { computed } from 'vue'

const props = defineProps({
    storedData: { type: Array, required: true },
    defaultData: { type: Object, required: false },
});

const emit = defineEmits(["addContact"]);

const requiredFields = computed(() => {
    if (!props.defaultData) return [];
    return props.defaultData.filter(item => item.required === true);
});

const storedKeys = computed(() => {
    return props.storedData.map(item => item.key);
});

const missingRequiredFields = computed(() => {
    return requiredFields.value.filter(field =>
        !storedKeys.value.includes(field.key)
    );
});

function getUpcomingValue() {
    const [firstMissing] = missingRequiredFields.value;

    if (firstMissing?.key) {
        return {
            key: firstMissing.key,
            value: firstMissing.value,
        };
    }
    return {
        key: 'extraInfo',
        value: "",
    };
}

function handleAdd() {
    const key = getUpcomingValue().key;
    const value = getUpcomingValue().value

    emit("addContact", key, value);
}

</script>

<template>
    <button
        class="addItemButton"
        @click="handleAdd"
        aria-label="Ajouter un nouveau contact"
    ></button>
</template>

<style scoped lang="scss"></style>
