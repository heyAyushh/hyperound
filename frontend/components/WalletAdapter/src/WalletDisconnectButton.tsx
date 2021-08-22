import { useWallet } from "../Basic/src/useWallet";
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react';
import { WalletIcon } from './WalletIcon';

export const WalletDisconnectButton: FC<any> = ({
    color = 'primary',
    variant = 'contained',
    children,
    disabled,
    onClick,
    ...props
}) => {
    const { wallet, disconnect, disconnecting } = useWallet();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            if (onClick) onClick(event);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (!event.defaultPrevented) disconnect().catch(() => {});
        },
        [onClick, disconnect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (disconnecting) return 'Disconnecting ...';
        if (wallet) return 'Disconnect';
        return 'Disconnect Wallet';
    }, [children, disconnecting, wallet]);

    return (
        <button
            onClick={handleClick}
            disabled={disabled || !wallet}
        >
            {content}
        </button>
    );
};
