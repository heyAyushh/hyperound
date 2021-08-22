import React, { FC, useMemo } from 'react';
import { WalletProvider } from "./Basic/src/WalletProvider";
import { WalletConnectButton, WalletDialogProvider, WalletDisconnectButton, WalletMultiButton } from './src';
import { getPhantomWallet, getSolflareWallet, getTorusWallet, getSolongWallet, getLedgerWallet, getMathWallet, getSolletWallet } from './wallets/src';

export const Wallet: FC = () => {
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you want to instantiate here will be compiled into your application
    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSolflareWallet(),
        getTorusWallet({
            options: { clientId: 'Go to https://developer.tor.us and create a client ID' }
        }),
        getLedgerWallet(),
        getSolongWallet(),
        getMathWallet(),
        getSolletWallet(),
    ], []);

    return (
        <WalletProvider wallets={wallets} autoConnect>
            <WalletDialogProvider>
                <WalletConnectButton/>
                <WalletDisconnectButton/>
            </WalletDialogProvider>
        </WalletProvider>
    );
};