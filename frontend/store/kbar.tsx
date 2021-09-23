import { PublicKey } from "@solana/web3.js";
import { atom, selector } from "recoil";

export const kbarVisible = atom({
  key: 'loggedInState',
  default: false,
});

// export const charCountState = selector({
//   key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//   get: ({ get }) => {
//     const text = get(textState);
//     return text.length;
//   },
// });