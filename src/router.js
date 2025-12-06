import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'

import Cv from './components/Cv.vue'

const routes = [
    { path: '/', component: Cv },
    { path: '/:id', component: Cv },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router