import { useWallet } from "../Basic/src/useWallet";
import React, { FC, ReactElement, MouseEventHandler, useCallback, useMemo, useEffect } from 'react';
import { ButtonDropdown, Dot, Image, Loading } from "@geist-ui/react";
import { LogIn, Twitter } from "@geist-ui/react-icons";
import { useRouter } from 'next/router'
import { getProvider } from "../../../helpers/SolanaProvider";
import axios from "axios";
import { WalletName } from "../wallets/src";
import { motion } from "framer-motion";

export interface WalletDialogProps extends Omit<unknown, 'title' | 'open'> {
  title?: ReactElement;
}

export const WalletDialog: FC = ({
  children,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  onClick
}) => {
  const { wallets, select, wallet, disconnect, connecting, disconnecting, connected, autoConnect } = useWallet();
  const router = useRouter();

  const handleDisconnectClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) disconnect();
    },
    [onClick, disconnect]
  );

  const twitter: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) router.push(`${process.env.NEXT_PUBLIC_BACKEND}/login/twitter`)
  }

  const content = useMemo(() => {
    if (children) return children;
    if (disconnecting) return <Loading spaceRatio={2.5} type="warning"> Disconnecting </Loading>;
    if (connecting) return <Loading spaceRatio={2.5} > Connecting </Loading>;
    if (connected) return 'Disconnect';
    if (wallet) return 'Connect';
    return null;
  }, [children, connecting, disconnecting, connected, wallet]);

  return (
    <div>
      <ButtonDropdown>
        {
          content === 'Disconnect' ?
            <ButtonDropdown.Item main onClick={handleDisconnectClick}>
              <div className='flex flex-row justify-center hover:ml-2'>

                <div className='flex flex-row pr-4 pl-4 h-full'>
                  <div className="mt-1 mr-6 h-2 circle-ripple-green" />
                  Connected
                </div>
                <LogIn size={20} />
              </div>
            </ButtonDropdown.Item>
            :
            <ButtonDropdown.Item main onClick={(event) => {
              if (!event.defaultPrevented)
                select('Phantom' as WalletName);
            }}>
              <div className='flex flex-row'>
                <LogIn size={20} />
                <div className='pr-4 pl-8 hover:ml-2 h-4 right text-m'>
                  {content ? content : 'Connect'}
                </div>
              </div>
            </ButtonDropdown.Item>
        }
        <ButtonDropdown.Item onClick={twitter}>
          <div className='flex flex-row pl-4 hover:ml-2 w-full'>
            <div className='w-6 '>
              <Twitter size={20} />
            </div>
            <div className='pr-4 pl-8 right text-m'>
              Twitter
            </div>
          </div>
        </ButtonDropdown.Item>
        {
          wallets.map((wlt) => (
            <ButtonDropdown.Item
              key={wlt.name}
              onClick={async (event) => {
                if (!event.defaultPrevented)
                  select(wlt.name);
              }}>
              <div className="flex flex-row pl-4 hover:ml-2 w-full">
                <div className='w-6 bg-black rounded-full'>
                  <Image src={wlt.icon} alt="wallet-icon" />
                </div>
                <div className='pr-4 pl-8 h-4 right text-m'>
                  {wlt.name}
                </div>
              </div>
            </ButtonDropdown.Item>
          ))
        }
      </ButtonDropdown>
    </div >
  );
};