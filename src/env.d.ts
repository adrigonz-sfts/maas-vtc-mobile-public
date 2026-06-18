interface ImportMetaEnv {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly SSR: boolean;
    readonly VITE_ENV?: string;
    readonly VITE_APP_BASE_URL?: string;
    readonly VITE_API_BASE_URL?: string;
    readonly VITE_AUTH_API_BASE_URL?: string;
    readonly VITE_FRONTEND_REDIRECT_ORIGIN?: string;
    readonly VITE_MOCK_API?: string;
    readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface Window {
    __MAAS_RUNTIME_CONFIG__?: Partial<Record<keyof ImportMetaEnv, string>>;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<object, object, unknown>;
    export default component;
}

declare module '*.json' {
    const value: Record<string, unknown>;
    export default value;
}
