import { useWallet } from "../Basic/src/useWallet";
import React, { FC, ReactElement, MouseEventHandler, useCallback, useMemo } from 'react';
import { ButtonDropdown, Image } from "@geist-ui/react";
import { LogIn, Twitter } from "@geist-ui/react-icons";
import { useRouter } from 'next/router'

export interface WalletDialogProps extends Omit<any, 'title' | 'open'> {
  title?: ReactElement;
}

export const WalletDialog: FC<WalletDialogProps> = ({ title = 'Select your wallet',
  onClose,
  color = 'primary',
  variant = 'contained',
  children,
  disabled,
  onClick,
  ...props }) => {
  const { wallets, select, wallet, connect, disconnect, connecting, disconnecting, connected } = useWallet();
  const router = useRouter();

  const handleDisconnectClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      if (!event.defaultPrevented) disconnect().catch(() => { });
    },
    [onClick, disconnect]
  );

  const twitter: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) router.push('https://api.hyperound.com/login/twitter')
  }

  const content = useMemo(() => {
    if (children) return children;
    if (disconnecting) return 'Disconnecting ...';
    if (connecting) return 'Connecting ...';
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
              <div className='flex flex-row'>
                <LogIn size={20} />
                <div className='pl-8 pr-4 h-4 right text-m'>
                  {content}
                </div>
              </div>
            </ButtonDropdown.Item>
            :
            <ButtonDropdown.Item main onClick={twitter}>
              <div className='flex flex-row'>
                <LogIn size={20} />
                <div className='pl-8 pr-4 h-4 right text-m'>
                  {content ? content : 'Connect'}
                </div>
              </div>
            </ButtonDropdown.Item>
        }
        <ButtonDropdown.Item >
          <div className='flex flex-row w-full pl-6'>
            <div className='w-6 '>
              <Twitter size={20} />
            </div>
            <div className='pl-6 pr-4 right text-m'>
              Twitter
            </div>
          </div>
        </ButtonDropdown.Item>
        {
          wallets.map((wlt) => (
            <ButtonDropdown.Item
              key={wlt.name}
              onClick={(event) => {
                select(wlt.name);
              }}>
              <div className="flex flex-row w-full pl-4">
                <div className='w-6 bg-black rounded-full'>
                  <Image src={wlt.icon} />
                </div>
                <div className='pl-8 pr-4 h-4 right text-m'>
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