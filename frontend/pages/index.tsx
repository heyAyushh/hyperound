import Header from '../components/Header';
import { Page, Spacer, Text } from "@geist-ui/react";
import Link from "next/link";
import { useRecoilValueLoadable } from "recoil";
import { loggedInState } from "../store/loggedIn";
import Footer from "../components/Footer";

export default function Home(): JSX.Element {
  const { contents: loggedIn } = useRecoilValueLoadable(loggedInState)

  return (
    <Page>
      <Header />
      <Page.Content>
        <div className="">


          {loggedIn ? (<>
            <Text h1>Feed</Text>
          </>) : (<>
            <Spacer h={7} />
            <h1 className="font-extrabold md:text-9xl m-5 text-2xl"> Namaste 🙏</h1>
            <Link href="/explore" passHref>
              <Text className="font-extrabold md:text-9xl m-5 text-2xl hover:cursor-text dark:hover:text-transparent hover:text-transparent text-black bg-clip-text bg-gradient-conic-l from-yellow-200 via-red-500 to-fuchsia-500"> Explore </Text>
            </Link>
            <Link href="/about-us" passHref>
              <Text className="font-extrabold md:text-9xl m-5 text-2xl hover:cursor-text dark:hover:text-transparent hover:text-transparent text-black bg-clip-text bg-gradient-to-bl from-green-200 via-green-300 to-blue-500"> About Us </Text>
            </Link>
          </>)
          }
          {/* <Canvas /> */}

        </div>
      </Page.Content>
      <Footer />
    </Page>
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
