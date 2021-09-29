import React, { FC, useMemo } from 'react';
import { useRecoilValue } from "recoil";
import { walletAutoConnectState } from "../../store/loggedIn";
import { WalletProvider } from "./Basic/src/WalletProvider";
import { WalletDialog } from './src';
import { getPhantomWallet, getSolletWallet } from './wallets/src';

export const Wallet: FC = () => {

  const autoconnect = useRecoilValue(walletAutoConnectState);

  const wallets = useMemo(() => [
    getPhantomWallet(),
    getSolletWallet(),
  ], []);

  return (
    <WalletProvider wallets={wallets} autoConnect={autoconnect}>
      <WalletDialog />
    </WalletProvider>
  );
};