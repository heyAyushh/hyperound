import { GeistProvider, CssBaseline } from "@geist-ui/react"
import { ThemeProvider, useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/global.css';
import Cursor from "../components/cursor";
import {
  RecoilRoot,
} from 'recoil';
import { HMSRoomProvider, HMSThemeProvider } from "@100mslive/hms-video-react";
import { Disconnect } from "../components/Live/Disconnect";
import React from "react";
import KBar from "../components/KBar";
import { SWRConfig } from "swr";
import { fetcher } from "../helpers/swr";

import "../styles/filepond.css";

const Geist = ({ Component, pageProps, router }): JSX.Element => {
  const { theme } = useTheme() as { theme: 'light' | 'dark' };

  const ISSERVER = typeof window === 'undefined';

  if (ISSERVER) {
    return <></>
  }

  return (
    <HMSRoomProvider>
      <HMSThemeProvider config={{}} appBuilder={{ theme }}>
        <GeistProvider themeType={theme}>
          <CssBaseline />
          <Disconnect />
          <motion.div key={router.route}
            initial="pageInitial"
            animate="pageAnimate"
            exit="pageExit"
            variants={{
              pageInitial: {
                opacity: 0,
                overflowY: 'hidden',
              },
              pageAnimate: {
                opacity: 1,
                overflowY: 'hidden',
              },
              pageExit: {
                // filter: [
                //   'hue-rotate(0) contrast(100%)',
                //   'hue-rotate(360deg) contrast(200%)',
                //   'hue-rotate(45deg) contrast(300%)',
                //   'hue-rotate(0) contrast(100%)'
                // ],
                opacity: 0
              },
            }}>
            {/* // actual component goes inside */}
            <KBar Component={Component} pageProps={pageProps} />
            <Cursor />
          </motion.div>
        </GeistProvider>
      </HMSThemeProvider>
    </HMSRoomProvider >
  )
}

function MyApp({ Component, pageProps, router }): JSX.Element {

  return (
    <SWRConfig value={{
      fetcher: fetcher,
      onError: (err) => {
        console.error(err);
      },
    }}>
      <RecoilRoot>
        <ThemeProvider defaultTheme="dark" attribute="class" >
          <AnimatePresence>
            <Geist Component={Component} pageProps={pageProps} router={router} />
          </AnimatePresence>
        </ThemeProvider >
      </RecoilRoot>
    </SWRConfig>
  )
}

export default MyApp;
