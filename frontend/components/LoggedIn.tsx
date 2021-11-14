import { Avatar, Loading, Page } from "@geist-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "./Header";
import { loggedInState } from "../store/loggedIn";
import Link from 'next/link';
import { userState } from "../store/user";
import { getAvatarUrl } from "../helpers/avatar";
import { useMemo } from "react";
import useUser from "../lib/useUser";

export default function LoggedIn(): JSX.Element {
  const { user, isLogggedin, isLoading } = useUser();

  if (isLoading) {
    return <Loading spaceRatio={2.5}/>
  }

  return (
    <>
      {
        isLogggedin === true && (
          user.username && (
            <Link href={'/' + user.username} passHref>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Avatar src={getAvatarUrl(user.username)} scale={3} />
              </motion.div>
            </Link>
          )
        )
      }
    </>
  )
}