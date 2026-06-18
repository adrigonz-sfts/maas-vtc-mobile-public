import { Capacitor } from '@capacitor/core';
import { Network, type ConnectionStatus } from '@capacitor/network';
import { onUnmounted, ref } from 'vue';
import type { PluginListenerHandle } from '@capacitor/core';

const DEFAULT_STATUS: ConnectionStatus = {
    connected: true,
    connectionType: 'unknown',
};

export const useNetworkStatus = () => {
    const status = ref<ConnectionStatus>({ ...DEFAULT_STATUS });
    const isOnline = ref(true);
    let listenerHandle: PluginListenerHandle | undefined;
    let webCleanup: (() => void) | undefined;

    const applyStatus = (next: ConnectionStatus): void => {
        status.value = next;
        isOnline.value = next.connected;
    };

    const refresh = async (): Promise<void> => {
        if (Capacitor.isNativePlatform()) {
            applyStatus(await Network.getStatus());
            return;
        }

        applyStatus({
            connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
            connectionType: 'unknown',
        });
    };

    onUnmounted(() => {
        void listenerHandle?.remove();
        webCleanup?.();
    });

    const startListening = async (): Promise<void> => {
        await refresh();

        if (!Capacitor.isNativePlatform()) {
            const handleOnline = (): void => {
                applyStatus({ connected: true, connectionType: 'unknown' });
            };
            const handleOffline = (): void => {
                applyStatus({ connected: false, connectionType: 'none' });
            };

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
            webCleanup = () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
            };
            return;
        }

        listenerHandle = await Network.addListener('networkStatusChange', applyStatus);
    };

    void startListening();

    return {
        status,
        isOnline,
        refresh,
    };
};
