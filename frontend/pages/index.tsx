import Header from '../components/header';
import { Page, Text } from "@geist-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import Canvas from "../components/canvas";

export default function Home(): JSX.Element {

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <h1 className="font-extrabold md:text-9xl m-5 text-2xl"> Namaste 🙏</h1>
      <Link href="/explore" passHref>
        <Text className="font-extrabold md:text-9xl m-5 text-2xl hover:cursor-text dark:hover:text-transparent hover:text-transparent text-black bg-clip-text bg-gradient-conic-l from-yellow-200 via-red-500 to-fuchsia-500"> Explore </Text>
      </Link>
      <Link href="/about-us" passHref>
        <Text className="font-extrabold md:text-9xl m-5 text-2xl hover:cursor-text dark:hover:text-transparent hover:text-transparent text-black bg-clip-text bg-gradient-to-bl from-green-200 via-green-300 to-blue-500"> About Us </Text>
      </Link>
      {/* <Canvas /> */}
    </Page>
  )
}