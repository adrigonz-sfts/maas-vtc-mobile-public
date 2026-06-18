import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/vue';
import { customRenderer } from '@/helpers/customRenderer.js';
import AuthComplete from '@/views/AuthComplete/AuthComplete.vue';

vi.mock('@softour/maas-users-micro-front-private', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@softour/maas-users-micro-front-private')>();

    return {
        ...actual,
        AuthCompleteView: {
            name: 'AuthCompleteView',
            template: '<div data-testid="auth-complete-view">AuthCompleteView</div>',
        },
    };
});

describe('AuthComplete', () => {
    it('should render AuthCompleteView from users micro-front', async () => {
        await customRenderer(AuthComplete).build();

        expect(screen.getByTestId('auth-complete-view')).toBeTruthy();
        expect(screen.getByText('AuthCompleteView')).toBeTruthy();
    });
});
