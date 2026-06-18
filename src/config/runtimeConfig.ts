export type RuntimeConfigKey =
    | 'VITE_ENV'
    | 'VITE_APP_BASE_URL'
    | 'VITE_API_BASE_URL'
    | 'VITE_AUTH_API_BASE_URL'
    | 'VITE_FRONTEND_REDIRECT_ORIGIN';

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const getRuntimeConfigValue = (key: RuntimeConfigKey): string => {
    if (typeof window !== 'undefined') {
        const runtimeWindow = window as Window & {
            __MAAS_RUNTIME_CONFIG__?: Partial<Record<RuntimeConfigKey, string>>;
        };
        const runtimeValue = clean(runtimeWindow.__MAAS_RUNTIME_CONFIG__?.[key]);
        if (runtimeValue) {
            return runtimeValue;
        }
    }

    return clean(import.meta.env[key]);
};
