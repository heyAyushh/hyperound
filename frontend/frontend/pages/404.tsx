import Header from '../components/header';
import { Page } from "@geist-ui/react";

export default function Home(): JSX.Element {
  return (
    <Page>
      <Header />
      <h1 className="font-extrabold text-9xl m-5"> कहाँ  ? </h1>
    </Page>
  )
}