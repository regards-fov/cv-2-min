import { createWebHistory, createRouter } from 'vue-router'
import Cv from './components/pages/Cv.vue'
import NotFound404 from './components/pages/NotFound404.vue'
import CvSetup from './components/pages/CvSetup.vue'
import { useLoginModal } from '@composables/useLoginModal'
import { API_URL } from '@config/urls'
import { loader } from '@utils/renderLoader'


const routes = [
    // {
    //     path: '/',
    //     name: 'home',
    //     component: Home
    // },
    {
        path: '/app',
        redirect: '/cv'
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
        component: Cv
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
        component: NotFound404
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
            return { name: 'not-found' }
        }
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    loader.show()

    if (!to.meta.requireAuth) {
        loader.hide()
        return
    }

    try {
        console.log('try router vuejs');
        const response = await fetch(`${API_URL}/api/auth/me`, {
            method: 'GET',
            credentials: 'include'
        })

        if (!response.ok) {
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
    finally {
        loader.hide()
    }
})

export default router