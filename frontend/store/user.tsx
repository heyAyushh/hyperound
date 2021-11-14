import { atom, AtomOptions } from "recoil";
import useUser from "../lib/useUser";

type User = {
  username: string,
  isCreator?: boolean,
  isLoggedin?: boolean
  // userId: string,
}

export const userState = atom({
  key: 'userState',
  default: {
    username: '',
    isCreator: false,
    userId: '',
    isLoggedin: false
  },
} as AtomOptions<User>);

