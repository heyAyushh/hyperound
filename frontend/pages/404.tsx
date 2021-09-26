import Header from '../components/Header';
import { Page } from "@geist-ui/react";
import Footer from "../components/Footer";

export default function Home(): JSX.Element {
  return (
    <Page>
      <Header />
      <h1 className="font-extrabold text-9xl m-5"> कहाँ  ? </h1>
      <Footer />
    </Page>
  )
}