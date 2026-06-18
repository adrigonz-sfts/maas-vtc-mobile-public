import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { registerAuthGuard, useAuthStore } from '@softour/maas-users-micro-front-private';
import Login from '@/views/Login/Login.vue';
import AuthComplete from '@/views/AuthComplete/AuthComplete.vue';
import Home from '@/views/Home/Home.vue';

describe('registerAuthGuard', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    const createTestRouter = () => {
        const testRouter = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', component: Login },
                { path: '/auth/complete', component: AuthComplete },
                { path: '/home', component: Home, meta: { requiresAuth: true } },
            ],
        });

        registerAuthGuard(testRouter);

        return testRouter;
    };

    it('should redirect to / when accessing protected route without session', async () => {
        const testRouter = createTestRouter();
        const authStore = useAuthStore();
        vi.spyOn(authStore, 'validateSession').mockResolvedValue(null);
        const setReturnPath = vi.spyOn(authStore, 'setReturnPath');

        await testRouter.push('/home');
        await testRouter.isReady();

        expect(setReturnPath).toHaveBeenCalledWith('/home');
        expect(testRouter.currentRoute.value.path).toBe('/');
    });

    it('should allow navigation to protected route with valid session', async () => {
        const testRouter = createTestRouter();
        const authStore = useAuthStore();
        vi.spyOn(authStore, 'validateSession').mockResolvedValue({ userId: 'user-1' } as never);

        await testRouter.push('/home');
        await testRouter.isReady();

        expect(testRouter.currentRoute.value.path).toBe('/home');
    });

    it('should allow public routes without session', async () => {
        const testRouter = createTestRouter();
        const authStore = useAuthStore();
        vi.spyOn(authStore, 'validateSession').mockResolvedValue(null);

        await testRouter.push('/auth/complete');
        await testRouter.isReady();

        expect(testRouter.currentRoute.value.path).toBe('/auth/complete');
    });
});
