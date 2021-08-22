import React, { FC, MouseEventHandler, useCallback } from 'react';
import { useWalletDialog } from './useWalletDialog';

export const WalletDialogButton: FC<any> = ({
    children = 'Select Wallet',
    color = 'primary',
    variant = 'contained',
    onClick,
    ...props
}) => {
    const { setOpen } = useWalletDialog();

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setOpen(true);
        },
        [onClick, setOpen]
    );

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    );
};
