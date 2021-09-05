import { atom } from "recoil";

export const tokenState = atom({
  key: 'tokenState',
  default: {
    exists: false,
    signature: '',
    transaction: {},
    mint: {}
  },
});
