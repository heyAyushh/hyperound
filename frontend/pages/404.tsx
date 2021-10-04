import Header from '../components/Header';
import { Page } from "@geist-ui/react";
import Footer from "../components/Footer";

export default function Home(): JSX.Element {
  return (
    <Page>
      <Header />
      <Page.Content>
        <div className="container p-4">


          <h1 className="font-extrabold text-9xl m-5"> कहाँ  ? </h1>

        </div>
      </Page.Content>
      <Footer />
    </Page>
  )
}