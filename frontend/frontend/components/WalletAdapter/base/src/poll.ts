import { WalletAdapter } from './adapter';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function poll(callback: () => boolean | Promise<boolean>, interval: number, count: number) {
    if (count > 0) {
        setTimeout(async () => {
            const done = await callback();
            if (!done) poll(callback, interval, count - 1);
        }, interval);
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function pollUntilReady(adapter: WalletAdapter, pollInterval: number, pollCount: number) {
    poll(
        () => {
            const { ready } = adapter;
            if (ready) {
                if (!adapter.emit('ready')) {
                    console.warn(`${adapter.constructor.name} is ready but no listener was registered`);
                }
            }
            return ready;
        },
        pollInterval,
        pollCount
    );
}
