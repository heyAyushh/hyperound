import { Page, Spacer, useToasts } from "@geist-ui/react";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { withSessionSsr } from "../../lib/withSession";
import { loggedInState } from "../../store/loggedIn";
import { userState } from "../../store/user";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const token = req.session.token;
    const backend = process.env.NEXT_PUBLIC_BACKEND;

    if (!token) {
      return {
        redirect: {
          destination: '/404',
          permanent: true,
        },
      }
    }

    try {
      const res = await axios.get(`${backend}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const profile = res.data as {

      };

      return {
        props: {
          profile
        }, // will be passed to the page component as props
      }

    } catch (err) {
      if (err.statusCode === 404) {
        return {
          redirect: {
            destination: '/404',
            permanent: true,
          },
        }
      } else if (err.statusCode === 403) {
        return {
          redirect: {
            destination: '/',
            permanent: true,
          },
        }
      }
    }

  }
  // or use context.resolvedUrl for conditional redirect
);

export default function Post({ profile }): JSX.Element {
  const router = useRouter();

  console.log(profile)

  const [user, setUser] = useRecoilState(userState);
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInState);
  const [, setToast] = useToasts();

  const { username } = router.query;

  useEffect(() => {
    if (user?.username !== username) {
      console.log({
        usr: user?.username,
        route: username,
        loggedIn,
      })
    }
  })

  if (!loggedIn) {
    console.log({
      usr: user?.username,
      loggedIn,
      route: username
    })
  }

  return (
    <div className="page">
      <Header />
      <div>
        <div className="container p-4">
          <>
            <Spacer h={7} />
            <h1>Toggle your settings here.</h1>
          </>
        </div>
      </div>
      <Footer />
    </div>
  )
}