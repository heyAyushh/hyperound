import Header from '../components/header';
import { Page, Text } from "@geist-ui/react";

export default function Home(): JSX.Element {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>

      <Text h1 className={'font-extrabold md:text-9xl m-5 text-5xl'}> see multiple creator posts here </Text>
    </Page>
  );
}