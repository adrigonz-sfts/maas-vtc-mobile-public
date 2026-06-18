import { vi } from 'vitest';

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false),
        getPlatform: vi.fn(() => 'web'),
    },
}));

vi.mock('@capacitor/network', () => ({
    Network: {
        getStatus: vi.fn(() =>
            Promise.resolve({
                connected: true,
                connectionType: 'wifi',
            }),
        ),
        addListener: vi.fn(() =>
            Promise.resolve({
                remove: vi.fn(() => Promise.resolve(undefined)),
            }),
        ),
    },
}));

vi.mock('@capacitor/geolocation', () => ({
    Geolocation: {
        checkPermissions: vi.fn(() => Promise.resolve({ location: 'granted' })),
        requestPermissions: vi.fn(() => Promise.resolve({ location: 'granted' })),
        getCurrentPosition: vi.fn(() =>
            Promise.resolve({
                timestamp: Date.now(),
                coords: {
                    latitude: 40.4168,
                    longitude: -3.7038,
                    accuracy: 10,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null,
                },
            }),
        ),
    },
}));

vi.mock('@capacitor/app', () => ({
    App: {
        getLaunchUrl: vi.fn(() =>
            Promise.resolve({ url: 'com.softour.maasfrontend://login?code=test' }),
        ),
        addListener: vi.fn(() =>
            Promise.resolve({
                remove: vi.fn(() => Promise.resolve(undefined)),
            }),
        ),
    },
}));
