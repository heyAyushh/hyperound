import { useWallet } from "../Basic/src/useWallet";
import React, { FC, useMemo, useState } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { WalletConnectButton } from './WalletConnectButton';
import { WalletDialogButton } from './WalletDialogButton';
import { WalletIcon } from './WalletIcon';

export const WalletMultiButton: FC<any> = ({
    color = 'primary',
    variant = 'contained',
    children,
    disabled,
    onClick,
    ...props
}) => {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setOpen } = useWalletDialog();
    const [anchor, setAnchor] = useState<HTMLElement>();

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (children) return children;
        if (!wallet || !base58) return null;
        return base58.substr(0, 4) + '..' + base58.substr(-4, 4);
    }, [children, wallet, base58]);

    if (!wallet) {
        return <WalletDialogButton color={color} variant={variant} {...props} />;
    }

    if (!base58) {
        return <WalletConnectButton color={color} variant={variant} {...props} />;
    }

    return (
        // <>
        //     <Button
        //         color={color}
        //         variant={variant}
        //         startIcon={<WalletIcon wallet={wallet} />}
        //         onClick={(event) => setAnchor(event.currentTarget)}
        //         aria-controls="wallet-menu"
        //         aria-haspopup="true"
        //         className={styles.root}
        //         {...props}
        //     >
        //         {content}
        //     </Button>
        //     <Menu
        //         id="wallet-menu"
        //         anchorEl={anchor}
        //         open={!!anchor}
        //         onClose={() => setAnchor(undefined)}
        //         className={styles.menu}
        //         marginThreshold={0}
        //         TransitionComponent={Fade}
        //         transitionDuration={250}
        //         keepMounted
        //     >
        //         <MenuItem onClick={() => setAnchor(undefined)} button={false}>
        //             <Button
        //                 color={color}
        //                 variant={variant}
        //                 startIcon={<WalletIcon wallet={wallet} />}
        //                 className={styles.root}
        //                 onClick={(event) => setAnchor(undefined)}
        //                 fullWidth
        //                 {...props}
        //             >
        //                 {wallet.name}
        //             </Button>
        //         </MenuItem>
        //         <Collapse in={!!anchor}>
        //             <MenuItem
        //                 onClick={async () => {
        //                     setAnchor(undefined);
        //                     await navigator.clipboard.writeText(base58);
        //                 }}
        //             >
        //                 <ListItemIcon>
        //                     <CopyIcon />
        //                 </ListItemIcon>
        //                 Copy address
        //             </MenuItem>
        //             <MenuItem
        //                 onClick={() => {
        //                     setAnchor(undefined);
        //                     setOpen(true);
        //                 }}
        //             >
        //                 <ListItemIcon>
        //                     <SwitchIcon />
        //                 </ListItemIcon>
        //                 Connect a different wallet
        //             </MenuItem>
        //             <MenuItem
        //                 onClick={() => {
        //                     setAnchor(undefined);
        //                     // eslint-disable-next-line @typescript-eslint/no-empty-function
        //                     disconnect().catch(() => {});
        //                 }}
        //             >
        //                 <ListItemIcon>
        //                     <DisconnectIcon />
        //                 </ListItemIcon>
        //                 Disconnect
        //             </MenuItem>
        //         </Collapse>
        //     </Menu>
        // </>
        <div>
            
        </div>
    );
};
