import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNetworkStatus } from '@/shared/composables/useNetworkStatus/useNetworkStatus';

const NetworkStatusProbe = defineComponent({
    setup() {
        const network = useNetworkStatus();
        return { network };
    },
    template: '<div />',
});

describe('useNetworkStatus', () => {
    beforeEach(() => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
        Object.defineProperty(navigator, 'onLine', {
            configurable: true,
            value: true,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should expose online status on web using navigator.onLine', async () => {
        const wrapper = mount(NetworkStatusProbe);
        await vi.waitFor(() => {
            expect(wrapper.vm.network.isOnline.value).toBe(true);
        });
        wrapper.unmount();
    });

    it('should refresh native status from Capacitor Network plugin', async () => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
        const { getStatus } = vi.mocked(Network);
        getStatus.mockResolvedValue({
            connected: false,
            connectionType: 'none',
        });

        const wrapper = mount(NetworkStatusProbe);
        await wrapper.vm.network.refresh();

        expect(getStatus).toHaveBeenCalled();
        expect(wrapper.vm.network.isOnline.value).toBe(false);
        wrapper.unmount();
    });

    it('should register native listener and remove it on unmount', async () => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
        const remove = vi.fn(() => Promise.resolve(undefined));
        const { addListener } = vi.mocked(Network);
        addListener.mockResolvedValue({ remove });

        const wrapper = mount(NetworkStatusProbe);
        await vi.waitFor(() => {
            expect(addListener).toHaveBeenCalledWith(
                'networkStatusChange',
                expect.any(Function),
            );
        });

        wrapper.unmount();
        expect(remove).toHaveBeenCalled();
    });
});
