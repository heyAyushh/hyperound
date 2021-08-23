import Header from '../components/header';
import { Page } from "@geist-ui/react";
import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <Page>
      <div className="m-8">
        <Header />
        <h1 className="font-extrabold text-9xl m-5"> Namaste 🙏</h1>
        <Link href="/explore" passHref>
          <h1 className="font-extrabold text-9xl m-5 dark:hover:text-transparent  hover:text-transparent dark:text-white text-black bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"> Explore </h1>
        </Link>
      </div>
    </Page>
  )
}