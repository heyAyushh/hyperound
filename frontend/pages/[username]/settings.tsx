import { Page } from "@geist-ui/react";
import { useRouter } from 'next/router';
import Header from "../../components/header";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <h1>Toggle your Settings</h1>
    </Page>
  )
}