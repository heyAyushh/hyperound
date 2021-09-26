import { Page } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "./Header";
import { loggedInTwitterState } from "../store/loggedIn";
import Footer from "./Footer";

export default function Post(): JSX.Element {

  return (
    <Page>
      <Header />
      <Footer />
      <h1>You can&#39;t access this page.</h1>
    </Page>
  )
}