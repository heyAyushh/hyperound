import { GeistProvider, CssBaseline } from "@geist-ui/react"
import { ThemeProvider, useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/global.css';
import Cursor from "../components/cursor";
import {
  RecoilRoot,
} from 'recoil';

const Geist = ({ Component, pageProps, router }) => {

  const { theme } = useTheme();

  const ISSERVER = typeof window === "undefined";

  if (ISSERVER) {
    return (
      <>
      </>
    )
  }

  return (
    <GeistProvider themeType={theme}>
      <CssBaseline />
      <motion.div key={router.route} initial="pageInitial" animate="pageAnimate" exit="pageExit" variants={{
        pageInitial: {
          opacity: 0
        },
        pageAnimate: {
          opacity: 1
        },
        pageExit: {
          // filter: [
          //   'hue-rotate(0) contrast(100%)',
          //   'hue-rotate(360deg) contrast(200%)',
          //   'hue-rotate(45deg) contrast(300%)',
          //   'hue-rotate(0) contrast(100%)'
          // ],
          opacity: 0
        }
      }}>
        <Component {...pageProps} />
        <Cursor />
      </motion.div>
    </GeistProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps, router }): JSX.Element {

  return (
    <RecoilRoot>
      <ThemeProvider defaultTheme="dark" attribute="class" >
        <AnimatePresence>
          <Geist Component={Component} pageProps={pageProps} router={router} />
        </AnimatePresence>
      </ThemeProvider >
    </RecoilRoot>
  )
}

export default MyApp
