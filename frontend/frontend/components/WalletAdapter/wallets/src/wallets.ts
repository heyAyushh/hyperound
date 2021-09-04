import { WalletAdapter } from "../../base/src";
import { MathWalletWalletAdapter, MathWalletWalletAdapterConfig } from "../../mathwallet/src/adapter";
import { PhantomWalletAdapter, PhantomWalletAdapterConfig } from "../../phantom/src/adapter";
import { SolletWalletAdapter, SolletWalletAdapterConfig } from "../../sollet/src/adapter";

export enum WalletName {
    MathWallet = 'MathWallet',
    Phantom = 'Phantom',
    Sollet = 'Sollet',
}

export interface Wallet {
    name: WalletName;
    url: string;
    icon: string;
    adapter: () => WalletAdapter;
}

export const ICONS_URL = 'https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons';

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

export const getSolletWallet = (config?: SolletWalletAdapterConfig): Wallet => ({
    name: WalletName.Sollet,
    url: 'https://www.sollet.io',
    icon: `${ICONS_URL}/sollet.svg`,
    adapter: () => new SolletWalletAdapter(config),
});

