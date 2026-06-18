import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/vue';
import { customRenderer } from '@/helpers/customRenderer.js';
import Login from '@/views/Login/Login.vue';

vi.mock('@softour/maas-users-micro-front-private', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@softour/maas-users-micro-front-private')>();

    return {
        ...actual,
        LoginView: {
            name: 'LoginView',
            template: '<div data-testid="login-view">LoginView</div>',
        },
    };
});

describe('Login', () => {
    it('should render LoginView from users micro-front', async () => {
        await customRenderer(Login).build();

        expect(screen.getByTestId('login-view')).toBeTruthy();
        expect(screen.getByText('LoginView')).toBeTruthy();
    });
});
