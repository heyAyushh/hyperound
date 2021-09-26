import { Page } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "../components/Header";
import { loggedInTwitterState } from "../store/loggedIn";
import Footer from "../components/Footer";
import { useEffect } from "react";

export default function Restricted(): JSX.Element {

  return (
    <Page>
      <Header />
      <Page.Content>
        <h1>You don&#39;t have access to this page.</h1>
      </Page.Content>
      <Footer />
    </Page>
  )
}