import { createWebHistory, createRouter } from 'vue-router'
import Cv from './components/pages/Cv.vue'
import Home from './components/pages/Home.vue'
import Pdf from './components/pages/Pdf.vue'
import CvSetup from './components/pages/CvSetup.vue'
import { useLoginModal } from '@composables/useLoginModal'
import { API_URL } from '@config/urls'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/cv/setup',
        name: 'cv.setup',
        component: CvSetup,
        meta: {
            requireAuth: true
        }
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
        component: Pdf
    },
    {
        path: '/cv/edit/:slug',
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
        if (!user.cvSlug) {
            return { name: 'cv.setup' }
        }
        return { name: 'cv.edit', params: { slug: user.cvSlug } }
    },

    mustOwnResource: (to, user) => {
        if (user.cvSlug !== to.params.slug) {
            return { name: 'cv.edit', params: { slug: user.cvSlug } }
        }
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (!to.meta.requireAuth) return

    try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) {
            console.log('intercept login modal')
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