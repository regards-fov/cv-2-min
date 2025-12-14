import { createWebHistory, createRouter } from 'vue-router'
import Cv from './components/pages/Cv.vue'
import Home from './components/pages/Home.vue'
import { useLoginModal } from '@composables/useLoginModal'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/cv',
        name: 'cv',
        component: { template: '<div></div>' },
        meta: {
            requireAuth: true,
            authGuard: 'redirectToUserCv'
        }
    },
    {
        path: '/cv/:slug',
        name: 'cv.show',
        component: Cv
    },
    {
        path: '/cv/:slug/edit',
        name: 'cv.edit',
        component: Cv,
        meta: {
            requireAuth: true,
            authGuard: 'mustOwnResource'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        redirect: { name: 'home' }
    }
]

const authGuards = {
    redirectToUserCv: (to, user) => {
        console.log(user);
        console.log('ici');
        return { name: 'cv.edit', params: { slug: user.cvSlug } }
    },

    mustOwnResource: (to, user) => {
        console.log('là ?');
        console.log(to);
        if (user.slug !== to.params.slug) {
            return { name: 'cv.show', params: { slug: to.params.slug } }
        }
    },
}

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (!to.meta.requireAuth) return

    try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) {
            console.log(to.fullPath);
            useLoginModal().open(to.fullPath)
            return { name: 'home' }
        }

        const user = await response.json()

        if (to.meta.authGuard) {
            const guard = authGuards[to.meta.authGuard]
            if (guard) {
                const result = guard(to, user)
                if (result) return result
            }
        }
    } catch (error) {
        console.error('Auth error:', error)
        useLoginModal().open(to.fullPath)
        return { name: 'home' }
    }
})

export default router