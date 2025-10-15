<script setup>

import { computed } from 'vue'
import TextareaSection from "./blocks/TextareaSection.vue"

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
            <ul class="jobs">
                <li class="job">
                    <div class="job-header">
                        <div class="job-date">2011-2013</div>
                        <div class="job-label">Eleveur de hérissons</div>
                    </div>
                    <p class="job-description">
                        Durant cette période j'ai élevé beaucoup de petits hérissons et je
                        les ai soignés et puis aussi bla bla bla bla bla bla bla bla
                    </p>
                </li>
                <li class="job">
                    <div class="job-header">
                        <div>
                            <div class="job-date">2016-2017</div>
                            <div class="extra-date">6 mois</div>
                        </div>
                        <div class="job-label">Eleveur de bestioles</div>
                    </div>
                    <p class="job-description">
                        Durant cette période j'ai élevé beaucoup de petites bestioles et
                        je les ai soignées et puis aussi bla bla bla bla bla bla bla bla
                    </p>
                </li>
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

.main section {
    flex: 0 1 0;
}

#resume {
    margin-top: 19px;
}

.job,
.xtra-job {
    display: flex;
    flex-direction: column;
}

.main-label {
    display: inline-flex;
    padding-right: 11px;
    font-size: x-large;
    border-bottom: 2px solid #cbcfd1;
}

.job-header,
.xtra-job-header {
    display: flex;
    gap: 1rem;
}

.job-date {
    font-weight: 500;
    align-self: flex-start;
}

.extra-date {
    align-self: flex-end;
    font-size: smaller;
    font-style: italic;
}

.job-label {
    flex: 1;
}

.job-description,
.xtra-job-description {
    font-size: 14px;
    margin-top: 0.25rem;
}

.job-label,
.xtra-job-label {
    font-weight: bold;
}
</style>