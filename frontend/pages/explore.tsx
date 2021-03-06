import Header from '../components/Header';
import { Page, Text, useMediaQuery, useToasts } from "@geist-ui/react";
import React, { useState } from "react";
import useSWR, { SWRConfig } from 'swr';
import { fetcher } from "../helpers/swr";
import axios from "axios";
import Footer from "../components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.

  const feedResponse = await axios.get(`${BACKEND_URL}/feed/latest`);
  const feed = feedResponse.data;

  return {
    props: {
      fallback: {
        [`${BACKEND_URL}/feed/latest`]: feed
      }
    }
  }
}

function Article() {
  // `data` will always be available as it's in `fallback`.
  const { data, isValidating, error } = useSWR(`${BACKEND_URL}/feed/latest`);
  const [, setToast] = useToasts();

  if (data) {
    return (
      <>
        <div className="flex flex-col">
          {data?.map((el, i) => <><h4 key={'postsFeed' + i}>{el.text}</h4> <br key={'postsFeedbr' + i} /></>)}
        </div>
      </>
    );
  } else if (isValidating && !data && !error) {

    return (
      <>
        Validating
      </>
    )

  } else if (error && !data && !isValidating) {
    setToast({
      type: 'error',
      text: 'Error occured while getting feed.'
    });

    return (
      <>
        Some error occured.
      </>
    )
  }

}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Explore({ fallback }): JSX.Element {
  const [isShown, setIsShown] = useState(false);
  const isMobile = useMediaQuery('md', { match: "down" });

  return (
    <SWRConfig value={{ fallback }}>
      <div className="page">
          <Header />
          <div style={{ marginBottom: `${isMobile ? "300px" : "120px"}` }}>
            <div className=" flex flex-row">
              <Article />
              <Footer />
            </div>
          </div>
        <Footer />
      </div>
    </SWRConfig>
  );
}