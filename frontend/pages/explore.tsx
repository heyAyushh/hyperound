import Header from '../components/header';
import { Page, Text } from "@geist-ui/react";
import React, { useState } from "react";
import useSWR, { SWRConfig } from 'swr';
import { fetcher } from "../helpers/fetcher";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  const feedRes = await axios.get('http://api.hyperound.com/feed/latest');
  const feed = feedRes.data;

  return {
    props: {
      fallback: {
        'http://api.hyperound.com/feed/latest': feed
      }
    }
  }
}

function Article() {
  // `data` will always be available as it's in `fallback`.
  const { data } = useSWR(`${BACKEND_URL}/feed/latest`, fetcher)
  return (
    <>
      {data?.map((el, i) => <h1 key={'postsFeed' + i}>{el.text}</h1>)}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Explore({ fallback }): JSX.Element {
  const [isShown, setIsShown] = useState(false);

  return (
    <SWRConfig value={{ fallback }}>
      <Page>
        <Page.Header>
          <Header />
        </Page.Header>
        <Article />
      </Page>
    </SWRConfig>
  );
}