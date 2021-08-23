import { useWallet } from "../Basic/src/useWallet";
import React, { FC, ReactElement, MouseEventHandler, SyntheticEvent, useCallback, useMemo } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { WalletIcon } from './WalletIcon';
import { Button, ButtonDropdown, Image, Text } from "@geist-ui/react";
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
  const { wallets, select } = useWallet();
  const { wallet, connect, disconnect, connecting, disconnecting, connected } = useWallet();
  const router = useRouter();

  const handleDisconnectClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented) disconnect().catch(() => { });
    },
    [onClick, disconnect]
  );

  const twitter: MouseEventHandler<HTMLButtonElement> = () => {
    router.push('https://api.hyperound.com/login/twitter')
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
    // <Dialog open={open} onClose={handleClose} className={styles.root} {...props}>
    //     <DialogTitle>
    //         {title}
    //         <IconButton onClick={handleClose}>
    //             <CloseIcon />
    //         </IconButton>
    //     </DialogTitle>
    //     <DialogContent>
    //         <List>
    //             {wallets.map((wallet) => (
    //                 <ListItem key={wallet.name}>
    //                     <Button
    //                         onClick={(event) => {
    //                             select(wallet.name);
    //                             handleClose(event);
    //                         }}
    //                         endIcon={<WalletIcon wallet={wallet} />}
    //                     >
    //                         {wallet.name}
    //                     </Button>
    //                 </ListItem>
    //             ))}
    //         </List>
    //     </DialogContent>
    // </Dialog>
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
          wallets.map((wallet) => (
            <ButtonDropdown.Item
              key={wallet.name}
              onClick={(event) => {
                select(wallet.name);
              }}>
              <div className="flex flex-row w-full pl-4">
                <div className='w-6 bg-black rounded-full'>
                  <Image src={wallet.icon} />
                </div>
                <div className='pl-8 pr-4 h-4 right text-m'>
                  {wallet.name}
                </div>
              </div>
            </ButtonDropdown.Item>
          ))
        }
      </ButtonDropdown>
    </div >
  );
};