import Header from '../components/Header';
import { Page, Spacer, Text } from "@geist-ui/react";
import Link from "next/link";
import { useRecoilValueLoadable } from "recoil";
import { loggedInState } from "../store/loggedIn";
import Footer from "../components/Footer";
import useUser from "../lib/useUser";
import { withSessionSsr } from "../lib/withSession";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if(!user) {
      return {
        props: {
          user: null, 
          isLoggedin: !!user,
        }
      }
    }

    return {
      props: {
        user,
        isLoggedin: !!user,
      },
    };
  },
);

export default function Home({ user, isLoggedin }): JSX.Element {

  return (
    <div className="page">
      <Header />
      <div>
        <div className="">
          {isLoggedin ? (<>
            <Text h1>Feed</Text>
            <Link href="/sol" passHref>
              <Text className="m-5 text-2xl md:text-9xl font-extrabold text-black hover:text-transparent dark:hover:text-transparent bg-clip-text from-yellow-200 via-red-500 hover:cursor-text bg-gradient-conic-l to-fuchsia-500"> SOL </Text>
            </Link>
          </>) : (<>
            <Spacer h={7} />
            <h1 className="m-5 text-2xl md:text-9xl font-extrabold"> Namaste 🙏</h1>
            <Link href="/explore" passHref>
              <Text className="m-5 text-2xl md:text-9xl font-extrabold text-black hover:text-transparent dark:hover:text-transparent bg-clip-text from-yellow-200 via-red-500 hover:cursor-text bg-gradient-conic-l to-fuchsia-500"> Explore </Text>
            </Link>
            <Link href="/about-us" passHref>
              <Text className="m-5 text-2xl md:text-9xl font-extrabold text-black hover:text-transparent dark:hover:text-transparent bg-clip-text bg-gradient-to-bl from-green-200 via-green-300 to-blue-500 hover:cursor-text"> About Us </Text>
            </Link>
          </>)
          }
          {/* <Canvas /> */}

        </div>
      </div>
      <Footer />
    </div>
  )
}

// This function gets called at build time
// export async function getStaticProps() {
//   // Call an external API endpoint to get posts
//   const res = await fetch('https://.../posts')
//   const posts = await res.json()

//   // By returning { props: { posts } }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       posts,
//     },
//   }
// }
