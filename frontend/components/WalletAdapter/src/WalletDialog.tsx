import { useWallet } from "../Basic/src/useWallet";
import React, { FC, ReactElement, SyntheticEvent, useCallback } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { WalletIcon } from './WalletIcon';


export interface WalletDialogProps extends Omit<any, 'title' | 'open'> {
    title?: ReactElement;
}

export const WalletDialog: FC<WalletDialogProps> = ({ title = 'Select your wallet', onClose, ...props }) => {
    const { wallets, select } = useWallet();
    const { open, setOpen } = useWalletDialog();

    const handleClose = useCallback(
        (event: SyntheticEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
            if (onClose) onClose(event, reason!);
            if (!event.defaultPrevented) setOpen(false);
        },
        [setOpen, onClose]
    );

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
            <h1>{title}</h1>
            <ul>
                {wallets.map((wallet) => (
                    <li key={wallet.name}>
                        <button
                            onClick={(event) => {
                                select(wallet.name);
                                handleClose(event);
                            }}
                        >
                            {wallet.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
