import { App } from '@capacitor/app';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { onUnmounted, ref } from 'vue';

export const useAppLifecycle = () => {
    const isActive = ref(true);
    let listenerHandle: PluginListenerHandle | undefined;

    const revalidatePermissions = async (): Promise<void> => {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        await Geolocation.checkPermissions();
    };

    const startListening = async (): Promise<void> => {
        if (!Capacitor.isNativePlatform()) {
            isActive.value = typeof document !== 'undefined' ? !document.hidden : true;
            return;
        }

        listenerHandle = await App.addListener('appStateChange', ({ isActive: active }) => {
            isActive.value = active;

            if (active) {
                void revalidatePermissions();
            }
        });
    };

    void startListening();

    onUnmounted(() => {
        void listenerHandle?.remove();
    });

    return {
        isActive,
        revalidatePermissions,
    };
};
