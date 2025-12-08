import { createWebHistory, createRouter } from 'vue-router'
import Cv from './components/Cv.vue'
import { useLoginModal } from '@/composables/useLoginModal'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Cv

    },
    {
        path: '/cv/:id',
        name: 'cv.show',
        component: Cv
    },
    {
        path: '/cv/:id/edit',
        name: 'cv.edit',
        component: Cv,
        meta: { requireAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (!to.meta.requireAuth) return
    console.log("GUARD check");
    const token = localStorage.getItem('token')

    if (!token) {
        console.log('NO TOKEN');
        useLoginModal().open(to.fullPath)
        return { name: 'cv.show', params: { id: to.params.id } }
    }

    try {
        //pour vérifier que le CV appartient bien à l'user on modifiera la requête en base
        //et on récuperera tous les CVs qui match le user, puis on comparera au slug courant
        const response = await fetch("http://localhost:3000/api/auth/me", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log('auth pas ok');
            localStorage.removeItem('token')
            useLoginModal().open(to.fullPath)
            return { name: 'cv.show', params: { id: to.params.id } }
        }
        console.log('auth OK');

        const user = await response.json()

        console.log(user.slug);
        console.log(to.params.id);
        if (user.slug !== to.params.id) {
            // useLoginModal().open(to.fullPath)
            return { name: 'cv.show', params: { id: to.params.id } }
        }

    } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('token')
        useLoginModal().open(to.fullPath)
        return { name: 'cv.show', params: { id: to.params.id } }
    }

})

export default router