import { render } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { routes as defaultRoutes } from '@/routes';

export function customRenderer(component) {
    const pinia = createPinia();
    setActivePinia(pinia);

    let _props = {};
    let _routes = [...defaultRoutes];
    let _route = '/';
    let _i18nOptions = {};

    const builder = {
        pinia,

        withProps(props) {
            _props = props;
            return builder;
        },

        withRoute(route) {
            _route = route;
            return builder;
        },

        withRoutes(routes) {
            _routes = routes;
            return builder;
        },

        withI18n(options) {
            _i18nOptions = options;
            return builder;
        },

        async build() {
            const router = createRouter({
                history: createMemoryHistory(),
                routes: _routes,
            });

            const i18n = createI18n({
                legacy: false,
                locale: 'en',
                messages: {},
                missingWarn: false,
                fallbackWarn: false,
                ..._i18nOptions,
            });

            router.push(_route);
            await router.isReady();

            const renderResult = render(component, {
                props: _props,
                global: {
                    plugins: [router, pinia, i18n],
                },
            });

            return {
                ...renderResult,
                router,
                pinia,
                i18n,
            };
        },
    };

    return builder;
}
