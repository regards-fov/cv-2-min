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
        beforeEnter: async (to, from, next) => {
            const token = localStorage.getItem('token')

            if (!token) {
                console.log('no token!');
                useLoginModal().open('/cv')
                next({ name: 'home' })
                return
            }

            try {
                const response = await fetch("http://localhost:3000/api/auth/me", {
                    method: 'GET',
                    headers: {
                        'Authorization': token
                    }
                })

                if (!response.ok) {
                    localStorage.removeItem('token')
                    useLoginModal().open('/cv')
                    next({ name: 'home' })
                    return
                }

                const user = await response.json()

                next({
                    name: 'cv.edit',
                    params: { slug: user.slug }
                })
            } catch (error) {
                console.error('Auth error:', error)
                localStorage.removeItem('token')
                useLoginModal().open('/cv')
                next({ name: 'home' })
            }
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
        meta: { requireAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        redirect: { name: 'home' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (!to.meta.requireAuth) return

    const token = localStorage.getItem('token')

    if (!token) {
        useLoginModal().open(to.fullPath)
        return { name: 'cv.show', params: { slug: to.params.slug } }
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/me", {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })

        if (!response.ok) {
            localStorage.removeItem('token')
            useLoginModal().open(to.fullPath)
            return { name: 'cv.show', params: { slug: to.params.slug } }
        }

        const user = await response.json()

        if (user.slug !== to.params.slug) {
            return { name: 'cv.show', params: { slug: to.params.slug } }
        }
    } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('token')
        useLoginModal().open(to.fullPath)
        return { name: 'cv.show', params: { slug: to.params.slug } }
    }
})

export default router