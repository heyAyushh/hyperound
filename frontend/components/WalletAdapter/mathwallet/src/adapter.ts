import {
    EventEmitter,
    pollUntilReady,
    WalletAccountError,
    WalletAdapter,
    WalletAdapterEvents,
    WalletDisconnectedError,
    WalletNotConnectedError,
    WalletNotFoundError,
    WalletNotInstalledError,
    WalletPublicKeyError,
    WalletSignatureError,
} from "../../base/src";
import { PublicKey, Transaction } from '@solana/web3.js';

interface MathWallet {
    isMathWallet?: boolean;
    getAccount: () => Promise<string>;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

interface MathWalletWindow extends Window {
    solana?: MathWallet;
}

declare const window: MathWalletWindow;

export interface MathWalletWalletAdapterConfig {
    pollInterval?: number;
    pollCount?: number;
}

export class MathWalletWalletAdapter extends EventEmitter<WalletAdapterEvents> implements WalletAdapter {
    private _connecting: boolean;
    private _wallet: MathWallet | null;
    private _publicKey: PublicKey | null;

    constructor(config: MathWalletWalletAdapterConfig = {}) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;

        if (!this.ready) pollUntilReady(this, config.pollInterval || 1000, config.pollCount || 3);
    }

    get publicKey(): PublicKey | null {
        return this._publicKey;
    }

    get ready(): boolean {
        return !!window.solana?.isMathWallet;
    }

    get connecting(): boolean {
        return this._connecting;
    }

    get connected(): boolean {
        return !!this._wallet;
    }

    get autoApprove(): boolean {
        return false;
    }

    async connect(): Promise<void> {
        try {
            if (this.connected || this.connecting) return;
            this._connecting = true;

            const wallet = window.solana;
            if (!wallet) throw new WalletNotFoundError();
            if (!wallet.isMathWallet) throw new WalletNotInstalledError();

            // @TODO: handle if popup is blocked

            let account: string;
            try {
                account = await wallet.getAccount();
            } catch (error) {
                throw new WalletAccountError(error?.message, error);
            }

            let publicKey: PublicKey;
            try {
                publicKey = new PublicKey(account);
            } catch (error) {
                throw new WalletPublicKeyError(error?.message, error);
            }

            window.addEventListener('message', this._messaged);

            this._wallet = wallet;
            this._publicKey = publicKey;

            this.emit('connect');
        } catch (error) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        if (this._wallet) {
            window.removeEventListener('message', this._messaged);

            this._wallet = null;
            this._publicKey = null;

            this.emit('disconnect');
        }
    }

    async signTransaction(transaction: Transaction): Promise<Transaction> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return wallet.signTransaction(transaction);
            } catch (error) {
                throw new WalletSignatureError(error?.message, error);
            }
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return wallet.signAllTransactions(transactions);
            } catch (error) {
                throw new WalletSignatureError(error?.message, error);
            }
        } catch (error) {
            this.emit('error', error);
            throw error;
        }
    }

    private _messaged = (event: MessageEvent) => {
        const data = event.data;
        if (data && data.origin === 'mathwallet_internal' && data.type === 'lockStatusChanged' && !data.payload) {
            this._disconnected();
        }
    };

    private _disconnected = () => {
        if (this._wallet) {
            window.removeEventListener('message', this._messaged);

            this._wallet = null;
            this._publicKey = null;

            this.emit('error', new WalletDisconnectedError());
            this.emit('disconnect');
        }
    };
}
