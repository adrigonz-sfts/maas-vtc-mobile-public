import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import GlobalFrontComponents from '@softour/global-front-components';
import '@softour/global-front-components/style.css';
import '@softour/maas-users-micro-front-private/style.css';
import '@softour/global-front-tokens-private';
import AppVue from '@/App.vue';
import { getRuntimeConfigValue } from '@/config/runtimeConfig';
import { router } from '@/routes';
import en from '@/locale/en.json';
import es from '@/locale/es.json';

const NATIVE_OAUTH_EVENT = 'maas:native-oauth-redirect';

const matchesRedirectOrigin = (url: string, redirectOrigin: string): boolean => {
    const normalizedOrigin = redirectOrigin.trim();
    if (!normalizedOrigin) {
        return false;
    }

    if (url.startsWith(normalizedOrigin)) {
        return true;
    }

    try {
        const parsedUrl = new URL(url);
        const parsedOrigin = new URL(normalizedOrigin);
        return (
            parsedUrl.protocol === parsedOrigin.protocol &&
            parsedUrl.hostname === parsedOrigin.hostname &&
            parsedUrl.pathname === parsedOrigin.pathname
        );
    } catch {
        return false;
    }
};

export const handleNativeOAuthRedirect = (url: string | null | undefined): void => {
    if (!url) {
        return;
    }

    const redirectOrigin = getRuntimeConfigValue('VITE_FRONTEND_REDIRECT_ORIGIN');
    if (!matchesRedirectOrigin(url, redirectOrigin)) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(NATIVE_OAUTH_EVENT, {
            detail: { url },
        }),
    );
};

const setupNativeOAuthRedirects = async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    const launchUrl = await App.getLaunchUrl();
    handleNativeOAuthRedirect(launchUrl?.url);

    await App.addListener('appUrlOpen', (event) => {
        handleNativeOAuthRedirect(event.url);
    });
};

const pinia = createPinia();

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        es,
    },
});

void setupNativeOAuthRedirects();

createApp(AppVue)
    .use(pinia)
    .use(router)
    .use(i18n)
    .use(GlobalFrontComponents)
    .mount('#app');
