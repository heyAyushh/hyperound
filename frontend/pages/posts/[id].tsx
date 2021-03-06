import { Page, Spacer } from "@geist-ui/react";
import { useRouter } from 'next/router';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function Post(): JSX.Element {
  const router = useRouter();

  const { id } = router.query;

  return (
    <div className="page">
      <Header />
      <div>
        <div className="container p-4">

          <>

            <Spacer h={7} />
            <h1>Buy HypeCoins here</h1>

          </>
          <Footer />
        </div>
      </div>
    </div>
  )
}