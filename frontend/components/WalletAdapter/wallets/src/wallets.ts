import { WalletAdapter } from "../../base/src";
import { LedgerWalletAdapter, LedgerWalletAdapterConfig } from "../../ledger/src/adapter";
import { MathWalletWalletAdapter, MathWalletWalletAdapterConfig } from "../../mathwallet/src/adapter";
import { PhantomWalletAdapter, PhantomWalletAdapterConfig } from "../../phantom/src/adapter";
import { SolflareWalletAdapter, SolflareWalletAdapterConfig } from "../../solflare/src/adapter";
import { SolletWalletAdapter, SolletWalletAdapterConfig } from "../../sollet/src/adapter";
import { SolongWalletAdapter, SolongWalletAdapterConfig } from "../../solong/src/adapter";
import { TorusWalletAdapter, TorusWalletAdapterConfig } from "../../torus/src/adapter";

export enum WalletName {
    Ledger = 'Ledger',
    MathWallet = 'MathWallet',
    Phantom = 'Phantom',
    Solflare = 'Solflare',
    SolflareWeb = 'Solflare (Web)',
    Sollet = 'Sollet',
    Solong = 'Solong',
    Torus = 'Torus',
}

export interface Wallet {
    name: WalletName;
    url: string;
    icon: string;
    adapter: () => WalletAdapter;
}

export const ICONS_URL = 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons';

export const getLedgerWallet = (config?: LedgerWalletAdapterConfig): Wallet => ({
    name: WalletName.Ledger,
    url: 'https://www.ledger.com',
    icon: `${ICONS_URL}/ledger.svg`,
    adapter: () => new LedgerWalletAdapter(config),
});

export const getMathWallet = (config?: MathWalletWalletAdapterConfig): Wallet => ({
    name: WalletName.MathWallet,
    url: 'https://mathwallet.org',
    icon: `${ICONS_URL}/mathwallet.svg`,
    adapter: () => new MathWalletWalletAdapter(config),
});

export const getPhantomWallet = (config?: PhantomWalletAdapterConfig): Wallet => ({
    name: WalletName.Phantom,
    url: 'https://www.phantom.app',
    icon: `${ICONS_URL}/phantom.svg`,
    adapter: () => new PhantomWalletAdapter(config),
});

export const getSolflareWallet = (config?: SolflareWalletAdapterConfig): Wallet => ({
    name: WalletName.Solflare,
    url: 'https://solflare.com',
    icon: `${ICONS_URL}/solflare.svg`,
    adapter: () => new SolflareWalletAdapter(config),
});

export const getSolflareWebWallet = (config?: SolletWalletAdapterConfig): Wallet => ({
    name: WalletName.SolflareWeb,
    url: 'https://solflare.com',
    icon: `${ICONS_URL}/solflare.svg`,
    adapter: () =>
        new SolletWalletAdapter({ ...config, provider: config?.provider || 'https://solflare.com/access-wallet' }),
});

export const getSolletWallet = (config?: SolletWalletAdapterConfig): Wallet => ({
    name: WalletName.Sollet,
    url: 'https://www.sollet.io',
    icon: `${ICONS_URL}/sollet.svg`,
    adapter: () => new SolletWalletAdapter(config),
});

export const getSolongWallet = (config?: SolongWalletAdapterConfig): Wallet => ({
    name: WalletName.Solong,
    url: 'https://solongwallet.com',
    icon: `${ICONS_URL}/solong.png`,
    adapter: () => new SolongWalletAdapter(config),
});

export const getTorusWallet = (config: TorusWalletAdapterConfig): Wallet => ({
    name: WalletName.Torus,
    url: 'https://tor.us',
    icon: `${ICONS_URL}/torus.svg`,
    adapter: () => new TorusWalletAdapter(config),
});
