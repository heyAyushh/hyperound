import { Avatar, Page } from "@geist-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "../components/header";
import { loggedInState } from "../store/loggedIn";
import Link from 'next/link';

export default function LoggedIn(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);

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
    const url = 'https://avatars.dicebear.com/api/' + (getRandomInt(2) ? 'male/' : 'female/') + makeid(5) + '.svg';

    console.log(url);
    return url;
  }

  return (
    <>
      <Link href={'/' + makeid(5)}>
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