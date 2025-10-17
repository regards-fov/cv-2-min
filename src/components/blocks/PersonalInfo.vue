<script setup>

import ItemEditable from '../ui/ItemEditable.vue'

const personal = defineModel({
    type: Array,
    default: ''
})

</script>
<template>
    <div class="personal">
        <ItemEditable
            label="username"
            v-model="personal[0].value"
            :defaultFontSize="22"
            :allow-resizing="{ enabled: true, minFontSize: 16 }"
        />
        <ItemEditable
            label="lookup-job"
            v-model="personal[1].value"
            :defaultFontSize="18"
            :allow-resizing="{ enabled: true, minFontSize: 14 }"
        />
    </div>
</template>

<style scoped>
.personal {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
}

.username {
    margin: 6px 0;
}
</style>