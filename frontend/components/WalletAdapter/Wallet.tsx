import React, { FC, useMemo } from 'react';
import { WalletProvider } from "./Basic/src/WalletProvider";
import { WalletDialog } from './src';
import { getPhantomWallet, getSolletWallet } from './wallets/src';

export const Wallet: FC = () => {
  const wallets = useMemo(() => [
    getPhantomWallet(),
    getSolletWallet(),
  ], []);

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletDialog />
    </WalletProvider>
  );
};