import { Avatar, Page } from "@geist-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "./Header";
import { loggedInState } from "../store/loggedIn";
import Link from 'next/link';
import { userState } from "../store/user";
import { getAvatarUrl } from "../helpers/avatar";
import { useMemo } from "react";

export default function LoggedIn(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
  const [user, _setUser] = useRecoilState(userState);

  const avatarUrl = useMemo(() => getAvatarUrl(user.username), [user.username])

  return (
    <>
      <Link href={'/' + user.username} passHref>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isLoggedIn ? <Avatar src={avatarUrl} scale={3} /> : ''}
        </motion.div>
      </Link>
    </>
  )
}