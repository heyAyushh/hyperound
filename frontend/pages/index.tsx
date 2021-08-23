import Header from '../components/header';
import { Page } from "@geist-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Page>
      <div className="m-8">
        <Header />
        <h1 className="font-extrabold text-9xl m-5"> Namaste 🙏</h1>
        <Link href="/explore" passHref>
          <h1 className="font-extrabold text-9xl m-5"> Explore </h1>
        </Link>
      </div>
    </Page>
  )
}