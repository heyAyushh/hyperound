import { Page, Spacer } from "@geist-ui/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { userState } from "../../store/user";
import { withSessionSsr } from "../../lib/withSession";

// choose tools
// create tokens (price based on tools)
// POST CONTENT !! GO LIVE !!

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user?.isCreator) {
      return {
        redirect: {
          destination: '/creators/join',
          permanent: true,
        },
      }
    }

    return {
      props: {
        user,
      },
    };
  },
);

export default function Post({ user }): JSX.Element {
  const router = useRouter();
  const backend = process.env.NEXT_PUBLIC_BACKEND;

  // console.log(profile.isCreator);

  return (
    <div className="page">
      <Header />
      <div className="container p-4">
        <>
          <Spacer h={7} />
          <h1>Creator Dashboard</h1>
        </>
      </div>
      <Footer />
    </div>
  )
}