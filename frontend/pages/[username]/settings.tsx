import { Page, Spacer } from "@geist-ui/react";
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
      <Spacer h={7} />
      <h1>Toggle your settings here.</h1>
    </Page>
  )
}