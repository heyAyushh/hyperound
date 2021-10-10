import { Avatar, Page } from "@geist-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "./Header";
import { loggedInState } from "../store/loggedIn";
import Link from 'next/link';
import { userState } from "../store/user";
import { getAvatarUrl } from "../helpers/avatar";

export default function LoggedIn(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [user, _setUser] = useRecoilState(userState);

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  return (
    <>
      <Link href={'/' + user.username} passHref>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isLoggedIn ? <Avatar src={getAvatarUrl(user.username)} scale={4} /> : ''}
        </motion.div>
      </Link>
    </>
  )
}