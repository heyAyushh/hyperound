import { Page, Spacer } from "@geist-ui/react";
import { useRouter } from 'next/router';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  return (
    <Page>
      <Header />
      <Spacer h={7} />
      <h1>Creators</h1>
      <Footer />
    </Page>
  )
}