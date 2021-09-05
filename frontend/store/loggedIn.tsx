import { PublicKey } from "@solana/web3.js";
import { atom, selector } from "recoil";

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
});

export const loggedInTwitterState = atom({
  key: 'loggedInTwitter', // unique ID (with respect to other atoms/selectors)
  default: false
});

export const loggedInWalletState = atom({
  key: 'loggedInWallet', // unique ID (with respect to other atoms/selectors)
  default: {
    provider: `localStorage.getItem('WalletName')`,
    publicKey: ('' as unknown) as PublicKey | null,
    verified: false,
  }
});

// export const charCountState = selector({
//   key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => {
//     const text = get(textState);

//     return text.length;
//   },
// });