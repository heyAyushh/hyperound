import { ConnectionProvider } from "@solana/wallet-adapter-react";
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
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
      <WalletProvider wallets={wallets} autoConnect={autoconnect}>
        <WalletDialog />
      </WalletProvider>
    </ConnectionProvider>
  );
};