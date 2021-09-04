import { Wallet } from "../wallets/src/wallets";
import React, { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';

export interface WalletIconProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    wallet?: Wallet;
}

export const WalletIcon: FC<WalletIconProps> = ({ wallet, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return wallet ? <img src={wallet.icon} alt={`${wallet.name} icon`} {...props} /> : null;
};
