import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppLifecycle } from '@/shared/composables/useAppLifecycle/useAppLifecycle';

const AppLifecycleProbe = defineComponent({
    setup() {
        const lifecycle = useAppLifecycle();
        return { lifecycle };
    },
    template: '<div />',
});

describe('useAppLifecycle', () => {
    beforeEach(() => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should revalidate geolocation permissions when app returns to foreground', async () => {
        let stateHandler: ((state: { isActive: boolean }) => void) | undefined;
        const { addListener } = vi.mocked(App);
        const { checkPermissions } = vi.mocked(Geolocation);
        addListener.mockImplementation((_event, handler) => {
            stateHandler = handler as (state: { isActive: boolean }) => void;
            return Promise.resolve({ remove: vi.fn(() => Promise.resolve(undefined)) });
        });

        const wrapper = mount(AppLifecycleProbe);
        await vi.waitFor(() => {
            expect(addListener).toHaveBeenCalledWith('appStateChange', expect.any(Function));
        });

        stateHandler?.({ isActive: true });
        expect(checkPermissions).toHaveBeenCalled();
        wrapper.unmount();
    });

    it('should remove appStateChange listener on unmount', async () => {
        const remove = vi.fn(() => Promise.resolve(undefined));
        const { addListener } = vi.mocked(App);
        addListener.mockResolvedValue({ remove });

        const wrapper = mount(AppLifecycleProbe);
        await vi.waitFor(() => {
            expect(addListener).toHaveBeenCalled();
        });

        wrapper.unmount();
        expect(remove).toHaveBeenCalled();
    });

    it('should skip native listener setup on web', async () => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
        const { addListener } = vi.mocked(App);

        const wrapper = mount(AppLifecycleProbe);
        await Promise.resolve();

        expect(addListener).not.toHaveBeenCalled();
        expect(wrapper.vm.lifecycle.isActive.value).toBe(true);
        wrapper.unmount();
    });
});
