import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { routes, router } from '@/routes';

describe('routes', () => {
    it('should define login, auth complete and home routes', () => {
        expect(routes).toHaveLength(3);
        expect(routes.map((route) => route.path)).toEqual(['/', '/auth/complete', '/home']);
        expect(routes.map((route) => route.name)).toEqual(['Login', 'AuthComplete', 'Home']);
    });

    it('should require authentication for /home', () => {
        const homeRoute = routes.find((route) => route.path === '/home');

        expect(homeRoute?.meta?.requiresAuth).toBe(true);
    });

    it('should use hash history', () => {
        const routesSource = readFileSync(resolve(__dirname, '../routes.ts'), 'utf-8');

        expect(routesSource).toContain('createWebHashHistory');
    });

    it('should register auth guard on router', () => {
        const routesSource = readFileSync(resolve(__dirname, '../routes.ts'), 'utf-8');

        expect(routesSource).toContain('registerAuthGuard');
        expect(routesSource).toContain('applyAuthGuard(router)');
        expect(router).toBeDefined();
    });
});
