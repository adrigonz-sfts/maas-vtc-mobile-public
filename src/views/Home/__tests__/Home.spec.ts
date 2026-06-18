import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/vue';
import { customRenderer } from '@/helpers/customRenderer.js';
import Home from '@/views/Home/Home.vue';

const logoutMock = vi.fn();

vi.mock('@softour/maas-users-micro-front-private', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@softour/maas-users-micro-front-private')>();

    return {
        ...actual,
        useLogin: () => ({
            logout: logoutMock,
        }),
    };
});

describe('Home', () => {
    beforeEach(() => {
        logoutMock.mockReset();
    });

    it('should render mobile placeholder content', async () => {
        await customRenderer(Home).build();

        expect(screen.getByText('Mobile Project')).toBeTruthy();
        expect(screen.getByText('Placeholder')).toBeTruthy();
        expect(
            screen.getByText(/You are signed in\. This screen is a mobile-first placeholder/i),
        ).toBeTruthy();
    });

    it('should call logout when sign out is clicked', async () => {
        await customRenderer(Home).build();

        await fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

        expect(logoutMock).toHaveBeenCalledTimes(1);
    });
});
