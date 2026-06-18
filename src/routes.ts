import { createWebHashHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router';
import { registerAuthGuard } from '@softour/maas-users-micro-front-private';
import Login from '@/views/Login/Login.vue';
import AuthComplete from '@/views/AuthComplete/AuthComplete.vue';
import Home from '@/views/Home/Home.vue';

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    {
        path: '/auth/complete',
        name: 'AuthComplete',
        component: AuthComplete,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

const applyAuthGuard = registerAuthGuard as (router: Router) => void;

applyAuthGuard(router);
