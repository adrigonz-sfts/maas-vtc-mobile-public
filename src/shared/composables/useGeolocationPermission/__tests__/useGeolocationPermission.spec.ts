import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGeolocationPermission } from '@/shared/composables/useGeolocationPermission/useGeolocationPermission';

const GeolocationProbe = defineComponent({
    setup() {
        const geolocation = useGeolocationPermission();
        return { geolocation };
    },
    template: '<div />',
});

describe('useGeolocationPermission', () => {
    beforeEach(() => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should request position on native via Capacitor Geolocation', async () => {
        vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
        const nativePosition = {
            timestamp: 1,
            coords: {
                latitude: 1,
                longitude: 2,
                accuracy: 3,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
        };
        const { getCurrentPosition } = vi.mocked(Geolocation);
        getCurrentPosition.mockResolvedValue(nativePosition);

        const wrapper = mount(GeolocationProbe);
        const result = await wrapper.vm.geolocation.requestPosition();

        expect(getCurrentPosition).toHaveBeenCalled();
        expect(result).toEqual(nativePosition);
        expect(wrapper.vm.geolocation.position.value).toEqual(nativePosition);
        wrapper.unmount();
    });

    it('should use navigator.geolocation fallback on web', async () => {
        const getCurrentPosition = vi.fn((_success, _error, _options) => {
            _success({
                timestamp: 10,
                coords: {
                    latitude: 40,
                    longitude: -3,
                    accuracy: 5,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
            });
        });

        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: { getCurrentPosition },
        });

        const wrapper = mount(GeolocationProbe);
        const result = await wrapper.vm.geolocation.requestPosition();

        expect(getCurrentPosition).toHaveBeenCalled();
        expect(result?.coords.latitude).toBe(40);
        wrapper.unmount();
    });

    it('should set error when geolocation is unavailable on web', async () => {
        Object.defineProperty(navigator, 'geolocation', {
            configurable: true,
            value: undefined,
        });

        const wrapper = mount(GeolocationProbe);
        const result = await wrapper.vm.geolocation.requestPosition();

        expect(result).toBeNull();
        expect(wrapper.vm.geolocation.error.value).toBe('Geolocation is not available in this browser');
        wrapper.unmount();
    });
});
