import Header from '../components/Header';
import { Page, Text } from "@geist-ui/react";
import { ArrowUpRight } from '@geist-ui/react-icons'
import { useState } from "react";
import { useKBar } from "kbar";
import Footer from "../components/Footer";

export default function Home(): JSX.Element {
  const [isShown, setIsShown] = useState(false);

  return (
    <Page>
      <Header />
      <Page.Content>
        <div className=" relative flex  flex-col p-4 h-full ">
          <>
            <a href="https://1drv.ms/b/s!AgCX9eaTq2RjgtVKYvi_ifv9aaZ7aQ?e=ZSkfX4"
              onMouseEnter={() => setIsShown(true)}
              onMouseLeave={() => setIsShown(false)}
              className="flex "
            >
              <Text h1 className={'font-extrabold md:text-9xl m-5 text-2xl hover:underline hover:cursor-text dark:hover:text-transparent hover:text-transparent text-black bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'}>
                Read our document.
                <ArrowUpRight size={96} className="flex-row  " />
              </Text>
            </a>
          </>
        </div>
      </Page.Content>
      <Footer />
    </Page>
  );
}