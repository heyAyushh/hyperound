import { PublicKey } from "@solana/web3.js";
import { atom, selector } from "recoil";

export const loggedInState = atom({
  key: 'loggedInState', // unique ID (with respect to other atoms/selectors)
  default: {
    twitter: false,
    wallet: {
      provider: `localStorage.getItem('WalletName')`,
      publicKey: ('' as unknown) as PublicKey | null,
      verified: false,
    },
    loggedIn: false,
  }, // default value (aka initial value)
});

export const charCountState = selector({
  key: 'charCountState', // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const text = get(textState);

    return text.length;
  },
});