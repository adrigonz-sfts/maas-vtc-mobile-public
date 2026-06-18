import { Capacitor } from '@capacitor/core';
import { Geolocation, type PermissionStatus, type Position } from '@capacitor/geolocation';
import { ref } from 'vue';

export type GeolocationPermissionState = PermissionStatus['location'];

const DEFAULT_PERMISSION: GeolocationPermissionState = 'prompt';

const toPosition = (coords: GeolocationPosition): Position => ({
    timestamp: coords.timestamp,
    coords: {
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
        accuracy: coords.coords.accuracy,
        altitude: coords.coords.altitude,
        altitudeAccuracy: coords.coords.altitudeAccuracy,
        heading: coords.coords.heading,
        speed: coords.coords.speed,
    },
});

const getWebPosition = (): Promise<Position> =>
    new Promise((resolve, reject) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('Geolocation is not available in this browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (coords) => resolve(toPosition(coords)),
            (error) => reject(error instanceof Error ? error : new Error(error.message)),
            { enableHighAccuracy: true },
        );
    });

export const useGeolocationPermission = () => {
    const permission = ref<GeolocationPermissionState>(DEFAULT_PERMISSION);
    const position = ref<Position | null>(null);
    const error = ref<string | null>(null);
    const loading = ref(false);

    const checkPermissions = async (): Promise<GeolocationPermissionState> => {
        if (Capacitor.isNativePlatform()) {
            const status = await Geolocation.checkPermissions();
            permission.value = status.location;
            return status.location;
        }

        if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
            try {
                const result = await navigator.permissions.query({ name: 'geolocation' });
                permission.value = result.state as GeolocationPermissionState;
                return permission.value;
            } catch {
                permission.value = DEFAULT_PERMISSION;
                return DEFAULT_PERMISSION;
            }
        }

        permission.value = DEFAULT_PERMISSION;
        return DEFAULT_PERMISSION;
    };

    const requestPermissions = async (): Promise<GeolocationPermissionState> => {
        if (Capacitor.isNativePlatform()) {
            const status = await Geolocation.requestPermissions();
            permission.value = status.location;
            return status.location;
        }

        return checkPermissions();
    };

    const requestPosition = async (): Promise<Position | null> => {
        loading.value = true;
        error.value = null;

        try {
            const nextPosition = Capacitor.isNativePlatform()
                ? await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
                : await getWebPosition();

            position.value = nextPosition;
            await checkPermissions();
            return nextPosition;
        } catch (caught) {
            error.value = caught instanceof Error ? caught.message : 'Unable to get geolocation';
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        permission,
        position,
        error,
        loading,
        checkPermissions,
        requestPermissions,
        requestPosition,
    };
};
