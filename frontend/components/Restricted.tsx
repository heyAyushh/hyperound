import { Page } from "@geist-ui/react";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import Header from "../components/header";
import { loggedInTwitterState } from "../store/loggedIn";

export default function Post(): JSX.Element {

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <h1>You can&#39;t access this page.</h1>
    </Page>
  )
}