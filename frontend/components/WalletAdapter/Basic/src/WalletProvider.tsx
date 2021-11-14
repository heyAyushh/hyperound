/* eslint-disable react-hooks/rules-of-hooks */
import { WalletAdapter, WalletError, WalletNotConnectedError, WalletNotReadyError } from '../../base/src';
import { Wallet, WalletName } from "../../wallets/src";
import { PublicKey, Transaction } from '@solana/web3.js';
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { WalletNotSelectedError } from './errors';
import { useLocalStorage } from './useLocalStorage';
import { WalletContext } from './useWallet';
import { useToasts } from "@geist-ui/react";
import axios from "axios";
import { getProvider } from "../../../../helpers/SolanaProvider";
import { loggedInState, loggedInWalletState, walletAutoConnectState } from "../../../../store/loggedIn";
import { useRecoilState } from "recoil";
import { userState } from "../../../../store/user";
import useUser from "../../../../lib/useUser";
import fetchJson from "../../../../helpers/fetchJson";
import router from "next/router";

export interface WalletProviderProps {
  children: ReactNode;
  wallets: Wallet[];
  autoConnect?: boolean;
  onError?: (error: WalletError) => void;
  localStorageKey?: string;
}

export const WalletProvider: FC<WalletProviderProps> = ({
  children,
  wallets,
  autoConnect = false,
  onError = (error: WalletError, setToast, msg?: string) => {
    if (setToast) {
      if (msg) {
        setToast({
          text: msg,
          type: 'error',
        })
        return;
      } else if (error?.message) {
        setToast({
          text: error.message,
          type: 'error',
        })
        return;
      }
    }
  },
  localStorageKey = 'walletName',
}) => {
  const ISSERVER = typeof window === "undefined";

  const [, setToast] = useToasts();

  if (!ISSERVER) {
    const [name, setName] = useLocalStorage<WalletName | null>(localStorageKey, null);
    const [wallet, setWallet] = useState<Wallet>();
    const [adapter, setAdapter] = useState<WalletAdapter>();
    const [ready, setReady] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [autoApprove, setAutoApprove] = useState(false);
    const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
    const [loggedIn, setLoggedin] = useRecoilState(loggedInState);
    const [loggedInWallet, setloggedInWallet] = useRecoilState(loggedInWalletState);
    const [recoilUser, setUser] = useRecoilState(userState);
    const { user, mutateUser, isLogggedin, isLoading } = useUser();
    const provider = getProvider();

    const walletsByName = useMemo(
      () =>
        wallets.reduce((walletsByName, wallet) => {
          walletsByName[wallet.name] = wallet;
          return walletsByName;
        }, {} as { [name in WalletName]: Wallet }),
      [wallets]
    );

    const select = useCallback(
      async (selected: WalletName | null) => {
        if (name === selected) return;
        if (adapter) await adapter.disconnect();
        setName(selected);
      },
      [name, adapter, setName]
    );

    const reset = useCallback(() => {
      setReady(false);
      setConnecting(false);
      setDisconnecting(false);
      setConnected(false);
      setAutoApprove(false);
      setPublicKey(null);
    }, [setReady, setConnecting, setDisconnecting, setConnected, setAutoApprove, setPublicKey]);

    const onReady = useCallback(() => setReady(true), [setReady]);

    useEffect(() => {
      setUser(user);
    }, [])

    // wallet login verify for backend
    const signLoginString = async () => {
      if (provider && !loggedIn) {
        const challenge_req = await axios({
          method: "get",
          url: `${process.env.NEXT_PUBLIC_BACKEND}/login/wallet/challenge?address=${provider && provider.publicKey ? provider.publicKey : ""}`
        })

        const data = new TextEncoder().encode(challenge_req.data.challenge);
        // const data = new TextEncoder().encode("hello");
        const signedMsg = await provider.signMessage(data);
        const signature_array = [...signedMsg.signature];
        // console.log(signature_array);
        // const signedMsgString = new TextDecoder().decode(signedMsg.signature);

        // console.log(challenge_req.data.challenge);
        // console.log(provider ? provider.publicKey?.toBase58() : "");
        // console.log(signature_array);
        // console.log(provider.publicKey);

        const backend_res_raw = await axios({
          method: "post",
          url: `/api/login`,
          withCredentials: true,
          data: {
            address: provider ? provider.publicKey?.toBase58() : "",
            signature: signature_array
          }
        });

        const user = backend_res_raw.data.user;

        console.log('session', user);

        setUser(user)
        setLoggedin(true);
        setloggedInWallet({
          publicKey: provider.publicKey?.toBase58(),
          provider: provider?.isPhantom,
          verified: true,
        });

        router.push('/');
      }
    }

    const logoutBackend = async () => {
      mutateUser(
        await fetchJson("/api/logout", { method: "POST" }),
        false,
      );
      router.push('/')
    }

    const onConnect = useCallback(async () => {
      if (!adapter) return;

      try {
        console.log('connecting', isLogggedin);
        if (!user) {
          await signLoginString();
        }
        setUser(user)
        setLoggedin(true);
        setloggedInWallet({
          publicKey: provider.publicKey?.toBase58(),
          provider: provider?.isPhantom,
          verified: true,
        });
        setConnected(true);
        setAutoApprove(adapter.autoApprove);
        setPublicKey(adapter.publicKey);

        if (loggedInWallet?.publicKey === adapter?.publicKey) {
          setToast({
            text: 'Connected Successfully!',
            type: 'success'
          })
        }
      } catch (err) {
        console.log('wallet onconnect 141');
        select(null);
      }

    }, [adapter, select, setConnected, setAutoApprove, setPublicKey, setToast, loggedInWallet]);

    const onDisconnect = useCallback(() => reset(), [reset]);

    const connect = useCallback(async () => {
      if (connecting || disconnecting || connected) return;

      if (!wallet || !adapter) {
        const error = new WalletNotSelectedError();
        throw error;
      }
      if (!ready) {
        window.open(wallet.url, '_blank');

        const error = new WalletNotReadyError();
        throw error;
      }

      setConnecting(true);
      try {
        await adapter.connect();
      } catch (err) {
        console.log('wallet connect', err);
      }
      finally {
        setConnecting(false);
      }
    }, [connecting, disconnecting, connected, adapter, ready, wallet, setConnecting]);

    const disconnect = useCallback(async () => {
      if (disconnecting) return;

      if (!adapter) {
        await select(null);
        return;
      }

      setDisconnecting(true);
      try {
        await adapter.disconnect();
        await logoutBackend();

        setToast({
          text: 'Disconnected Successfully!',
          type: 'success',
        })

      } catch (err) {
        setToast({
          text: 'Error logging out',
          type: 'error',
        });
      } finally {

        // Clear Login
        setDisconnecting(false);
        setLoggedin(false);
        setloggedInWallet({
          verified: false,
          publicKey: null,
          provider: null
        });
        setUser({
          username: null,
          isCreator: null,
        });

        await select(null);
      }
    }, [disconnecting, adapter, select, setDisconnecting, setToast, setLoggedin, setloggedInWallet, logoutBackend]);

    const signTransaction = useCallback(
      async (transaction: Transaction) => {
        if (!adapter) {
          const error = new WalletNotSelectedError();
          console.log('wallet not selected 209')
          onError(error, setToast);
          throw error;
        }
        if (!connected) {
          const error = new WalletNotConnectedError();
          console.log('wallet not connected 215')
          onError(error, setToast);
          throw error;
        }

        return await adapter.signTransaction(transaction);
      },
      [adapter, onError, connected, setToast]
    );

    const signAllTransactions = useCallback(
      async (transactions: Transaction[]) => {
        if (!adapter) {
          const error = new WalletNotSelectedError();
          console.log('wallet not selected 229')
          onError(error, setToast);
          throw error;
        }
        if (!connected) {
          const error = new WalletNotConnectedError();
          console.log('wallet not connected 235')
          onError(error, setToast);
          throw error;
        }

        return await adapter.signAllTransactions(transactions);
      },
      [adapter, onError, connected, setToast]
    );

    const [walletAutoConnect, setWalletAutoConnect] = useRecoilState(walletAutoConnectState)

    // Reset state and set the wallet, adapter, and ready state when the name changes
    useEffect(() => {
      reset();

      const wallet = name ? walletsByName[name] : undefined;
      const adapter = wallet ? wallet.adapter() : undefined;

      setWallet(wallet);
      setAdapter(adapter);
      setReady(adapter ? adapter.ready : false);
    }, [reset, name, walletsByName, setWallet, setAdapter, setReady]);

    // Setup and teardown event listeners when the adapter changes
    useEffect(() => {
      if (adapter) {
        adapter.on('ready', onReady);
        adapter.on('connect', onConnect);
        adapter.on('disconnect', onDisconnect);
        adapter.on('error', (err) => onError(err, setToast));
        return () => {
          adapter.off('ready', onReady);
          adapter.off('connect', onConnect);
          adapter.off('disconnect', onDisconnect);
          adapter.off('error', (err) => onError(err, setToast));
        };
      }
    }, [adapter, onReady, onConnect, onDisconnect, onError, setToast]);

    // If autoConnect is enabled, try to connect when the adapter changes and is ready
    useEffect(() => {
      if (autoConnect && setWalletAutoConnect && adapter && ready) {
        (async function () {
          setConnecting(true);
          try {
            await adapter.connect();
          } catch (error) {
            // Don't throw error, but onError will still be called
            setWalletAutoConnect(false);
          } finally {
            setConnecting(false);
          }
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoConnect, adapter, ready, setConnecting]);

    return (
      <WalletContext.Provider
        value={{
          wallets,
          autoConnect,
          wallet,
          select,
          publicKey,
          ready,
          connecting,
          disconnecting,
          connected,
          autoApprove,
          connect,
          disconnect,
          signTransaction,
          signAllTransactions,
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }

  return (
    <>
    </>
  )
};
