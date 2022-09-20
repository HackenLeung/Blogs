import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
    {
        path: '/', name: 'home',
        component: () => import('../view/Home.vue')
    },
    {
        path: '/article/:id',
        name: 'article',
        component: () => import('../view/Articles.vue'),
        meta: { title: '文章' }
    },
    {
        path: '/category/:cate',
        name: 'category',
        component: () => import('../view/Home.vue'),
        meta: { title: '分类', params: 'cate' }
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import('../view/Friend.vue'),
        meta: { title: '友链'}
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../view/About.vue'),
        meta: { title: '关于'}
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
