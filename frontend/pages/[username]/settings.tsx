import { Page, Spacer, useToasts } from "@geist-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { loggedInState } from "../../store/loggedIn";
import { userState } from "../../store/user";

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
  const { username } = context.params;
  const backend = process.env.NEXT_PUBLIC_BACKEND;

  const res = await fetch(`${backend}/profile`)
  const data = await res.json()
  // or use context.resolvedUrl for conditional redirect
  // if(context.resolvedUrl == "/")
  if (data.statusCode === 404) {
    return {
      redirect: {
        destination: '/404',
        permanent: true,
      },
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}

export default function Post(): JSX.Element {
  const router = useRouter();

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
    <Page>
      <Header />
      <Spacer h={7} />
      <Page.Content>
        <h1>Toggle your settings here.</h1>
      </Page.Content>
      <Footer />
    </Page>
  )
}