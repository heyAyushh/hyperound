import { Avatar, Page } from "@geist-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "./Header";
import { loggedInState } from "../store/loggedIn";
import Link from 'next/link';
import { userState } from "../store/user";

export default function LoggedIn(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [user, _setUser] = useRecoilState(userState);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

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

  const getUrl = () => {
    const url = process.env.NEXT_PUBLIC_AVATAR_SRC + (getRandomInt(2) ? '/male/' : '/female/') + user.username + '.svg';

    return url;
  }

  return (
    <>
      <Link href={'/' + user.username} passHref>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isLoggedIn ? <Avatar src={getUrl()} scale={4} /> : ''}
        </motion.div>
      </Link>
    </>
  )
}