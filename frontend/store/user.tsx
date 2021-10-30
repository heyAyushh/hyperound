import { atom, AtomOptions } from "recoil";

type User = {
  username: string,
  isCreator: boolean,
  userId: string,
}

export const userState = atom({
  key: 'userState',
  default: {
    username: '',
    isCreator: false,
    userId: '',
  },
} as AtomOptions<User>);
