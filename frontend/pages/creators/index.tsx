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

    console.log(user)

    if (user?.isCreator !== true) {
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

// export async function getServerSideProps(context: GetServerSidePropsContext): Promise<any> {
//   const backend = process.env.NEXT_PUBLIC_BACKEND;

//   let data;

//   try {
//     const res = await fetch(`${backend}/profile`, {
//       method: 'GET'
//     });
//     data = await res.json();
//     console.log(data)
//   } catch (err) {
//     return {
//       redirect: {
//         destination: '/creators/join',
//         permanent: true,
//       },
//     }
//   }

//   // or use context.resolvedUrl for conditional redirect
//   // if(context.resolvedUrl == "/")
//   if (data.statusCode === 404) {
//     return {
//       redirect: {
//         destination: '/creators',
//         permanent: true,
//       },
//     }
//   }

//   return {
//     props: { profile: data, }, // will be passed to the page component as props
//   }
// }

export default function Post({ profile }): JSX.Element {
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