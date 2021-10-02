import { Page, Spacer } from "@geist-ui/react";
import { useRouter } from 'next/router';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

// got an invite?
// choose tools
// create tokens (price based on tools)
// POST CONTENT !! GO LIVE !!

export default function Post(): JSX.Element {
  const router = useRouter();

  const { username } = router.query;

  return (
    <div className="page">
      <Header />
      <div className="container p-4">
        <>
          <Spacer h={7} />
          <h1>Creators</h1>
        </>
        <Footer />
      </div>
    </div>
  )
}