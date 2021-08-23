import { useWallet } from "../Basic/src/useWallet";
import React, { FC, ReactElement, MouseEventHandler, useCallback, useMemo, useEffect } from 'react';
import { ButtonDropdown, Image } from "@geist-ui/react";
import { LogIn, Twitter } from "@geist-ui/react-icons";
import { useRouter } from 'next/router'
import { getProvider } from "../../../helpers/SolanaProvider";
import axios from "axios";

export interface WalletDialogProps extends Omit<unknown, 'title' | 'open'> {
  title?: ReactElement;
}

export const WalletDialog: FC = ({
  children,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  onClick
}) => {

  const provider = getProvider();

  const { wallets, select, wallet, disconnect, connecting, disconnecting, connected } = useWallet();
  const router = useRouter();

  const handleDisconnectClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (onClick) onClick(event);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  const signLoginString = async () => {
    const challenge_req = await axios({
      method: "get",
      url: `https://api.hyperound.com/login/wallet/challenge?address=${provider && provider.publicKey ? provider.publicKey : ""}`
    })

    const data = new TextEncoder().encode(challenge_req.data.challenge);
    const signedMsg = await provider.signMessage(data);
    const signature_array = [...signedMsg.signature];
    console.log(signature_array);
    const signedMsgString = new TextDecoder().decode(signedMsg.signature);

    try {
      // console.log(provider.publicKey)
      const done_req = await axios({
        method: "post",
        url: `https://api.hyperound.com/login/wallet/done`,
        data: {
          address: provider ? provider.publicKey?.toBase58() : "",
          signature: signature_array
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <button onClick={signLoginString} className="mr-4">Login</button>
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
              onClick={() => {
                select(wlt.name);
              }}>
              <div className="flex flex-row w-full pl-4">
                <div className='w-6 bg-black rounded-full'>
                  <Image src={wlt.icon} alt="wallet-icon"/>
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