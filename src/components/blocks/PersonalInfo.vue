<script setup>

import ItemEditable from '../ui/ItemEditable.vue'
import vResizer from '../../directives/textResizer'


const personal = defineModel({
    type: Array,
    default: ''
})

</script>
<template>
    <div
        id="personal-info"
        class="personal"
    >
        <div v-resizer="{ minFontSize: 16, default: 22, id: 'username' }">
            <ItemEditable
                class="username"
                label="username"
                v-model="personal[0].value"
            />
        </div>
        <div v-resizer="{ minFontSize: 14, default: 18, id: 'lookup-job' }">
            <ItemEditable
                class="lookup-job"
                label="lookup-job"
                v-model="personal[1].value"
            />
        </div>
    </div>
</template>

<style scoped>
.personal {
    display: flex;
    flex-wrap: wrap;
    padding: 0 3px;
}
</style>