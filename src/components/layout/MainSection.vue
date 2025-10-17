<script setup>

import { computed } from 'vue'
import TextareaSection from "../ui/TextareaSection.vue"
import JobItem from "../blocks/JobItem.vue"


const props = defineProps({
    cvData: {
        type: Object,
        required: true,
    },
    defaultCvData: {
        type: Object,
        required: true,
    },
});

const $cv = computed(() => props.cvData.cv);

</script>
<template>
    <div class="main">
        <section id="resume">
            <TextareaSection
                v-model="$cv.resume"
                name="resume"
            />
        </section>

        <section id="professional-xp">
            <div class="main-label">Expériences professionelles</div>
            <ul class="job-list">
                <div
                    v-for="(job, index) in $cv.professionalXp"
                    :key="index"
                    class="jobs"
                >
                    <JobItem
                        :index="index"
                        v-model="$cv.professionalXp[index]"
                    />
                </div>
            </ul>
        </section>
        <section id="xtra-xp">
            <div class="main-label">Expériences extra-professionelles</div>
            <ul class="xtra">
                <li class="xtra-job">
                    <div class="xtra-job-header">
                        <div class="xtra-job-label">Eleveur de bestioles</div>
                    </div>
                    <p class="xtra-job-description">
                        Durant cette période j'ai élevé beaucoup de petites bestioles et
                        je les ai soignées et puis aussi bla bla bla bla bla bla bla bla
                    </p>
                </li>
            </ul>
        </section>
    </div>


</template>
<style scoped>
.main {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin-left: 12px;
    padding: 0 11px;
    hyphens: auto;
}

#resume {
    margin-top: 19px;
    margin-bottom: 14px;
}

.main-label {
    display: inline-flex;
    padding-right: 11px;
    font-size: x-large;
    border-bottom: 2px solid #cbcfd1;
}

.job-list {
    padding-left: 20px;
    margin: 6px auto;
}

.jobs {
    padding: 10px;
}
</style>