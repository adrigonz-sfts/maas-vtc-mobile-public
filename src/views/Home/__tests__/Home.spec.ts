import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/vue';
import { customRenderer } from '@/helpers/customRenderer.js';
import Home from '@/views/Home/Home.vue';

vi.mock('@softour/maas-vtc-micro-front-private', async (importOriginal) => {
    const actual =
        await importOriginal<typeof import('@softour/maas-vtc-micro-front-private')>();

    return {
        ...actual,
        VtcPlaceholder: {
            name: 'VtcPlaceholder',
            template: '<div data-testid="vtc-placeholder">VtcPlaceholder</div>',
        },
    };
});

describe('Home', () => {
    it('should render VtcPlaceholder from VTC micro-front', async () => {
        await customRenderer(Home).build();

        expect(screen.getByTestId('vtc-placeholder')).toBeTruthy();
        expect(screen.getByText('VtcPlaceholder')).toBeTruthy();
    });
});
