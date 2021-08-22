import { useWallet } from "../Basic/src/useWallet";
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react';
import { WalletIcon } from './WalletIcon';

export const WalletConnectButton = ({
    color = 'primary',
    variant = 'contained',
    children,
    disabled,
    onClick,
    ...props
}) => {
    const { wallet, connect, connecting, connected } = useWallet();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            if (onClick) onClick(event);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (!event.defaultPrevented) connect().catch(() => {});
        },
        [onClick, connect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (connecting) return 'Connecting ...';
        if (connected) return 'Connected';
        if (wallet) return 'Connect';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);

    return (
        <button
            onClick={handleClick}
            disabled={disabled || !wallet || connecting || connected}
        >
            {content}
        </button>
    );
};
