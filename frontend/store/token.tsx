import { atom } from "recoil";

export const userState = atom({
  key: 'tokenState',
  default: {
    exists: false,
    address: 'null',
  },
});
