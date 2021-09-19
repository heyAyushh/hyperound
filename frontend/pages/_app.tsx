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
import { KBarProvider, KBarSearch, KBarContent, KBarResults } from 'kbar';
import React from "react";
import { useRouter } from 'next/router';

function Render({ action, handlers, state }) {
  const ownRef = React.useRef<HTMLDivElement>(null);

  const active = state.index === state.activeIndex;

  React.useEffect(() => {
    if (active) {
      // wait for the KBarContent to resize, _then_ scrollIntoView.
      // https://medium.com/@owencm/one-weird-trick-to-performant-touch-response-animations-with-react-9fe4a0838116
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          const element = ownRef.current;
          if (!element) {
            return;
          }
          element.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
            inline: "start",
          });
        })
      );
    }
  }, [active]);

  return (
    <div
      ref={ownRef}
      {...handlers}
      style={{
        padding: "12px 16px",
        background: active ? "var(--a1)" : "var(--background)",
        borderLeft: `2px solid ${active ? "var(--foreground)" : "transparent"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <span>{action.name}</span>
      {action.shortcut?.length ? (
        <kbd
          style={{
            padding: "4px 6px",
            background: "rgba(0 0 0 / .1)",
            borderRadius: "4px",
          }}
        >
          {action.shortcut}
        </kbd>
      ) : null}
    </div>
  );
}

const searchStyles = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "var(--background)",
  color: "var(--foreground)",
};

const Geist = ({ Component, pageProps, router }) => {

  const { theme } = useTheme();

  const ISSERVER = typeof window === "undefined";

  const history = useRouter();

  const actions = [
    {
      id: "searchDocsAction",
      name: "Search docs…",
      shortcut: [],
      keywords: "find",
      section: "",
      children: ["docs1", "docs2"],
    },
    {
      id: "homeAction",
      name: "Home",
      shortcut: ["h"],
      keywords: "back",
      section: "Navigation",
      perform: () => history.push("/"),
    },
    {
      id: "docsAction",
      name: "Docs",
      shortcut: ["d"],
      keywords: "help",
      section: "Navigation",
      perform: () => history.push("/docs"),
    },
    {
      id: "contactAction",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email hello",
      section: "Navigation",
      perform: () => window.open("mailto:timchang@hey.com", "_blank"),
    },
    {
      id: "twitterAction",
      name: "Twitter",
      shortcut: ["t"],
      keywords: "social contact dm",
      section: "Navigation",
      perform: () => window.open("https://twitter.com/timcchang", "_blank"),
    },
    {
      id: "docs1",
      name: "Docs 1 (Coming soon)",
      shortcut: [],
      keywords: "Docs 1",
      section: "",
      perform: () => window.alert("nav -> Docs 1"),
      parent: "searchBlogAction",
    },
    {
      id: "docs2",
      name: "Docs 2 (Coming soon)",
      shortcut: [],
      keywords: "Docs 2",
      section: "",
      perform: () => window.alert("nav -> Docs 2"),
      parent: "searchBlogAction",
    },
    {
      id: "theme",
      name: "Change theme…",
      shortcut: [],
      keywords: "interface color dark light",
      section: "",
      children: ["darkTheme", "lightTheme"],
    },
    {
      id: "darkTheme",
      name: "Dark",
      shortcut: [],
      keywords: "dark",
      section: "",
      perform: () =>
        document.documentElement.setAttribute("data-theme-dark", ""),
      parent: "theme",
    },
    {
      id: "lightTheme",
      name: "Light",
      shortcut: [],
      keywords: "light",
      section: "",
      perform: () =>
        document.documentElement.removeAttribute("data-theme-dark"),
      parent: "theme",
    },
  ]

  if (ISSERVER) {
    return (
      <>
      </>
    )
  }

  return (
    <HMSRoomProvider>
      <HMSThemeProvider config={{}} appBuilder={{ theme: "dark" }}>
        <GeistProvider themeType={theme}>

<CssBaseline />
            <Disconnect />
            <motion.div key={router.route}
              initial="pageInitial"
              animate="pageAnimate"
              exit="pageExit"
              variants={{
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
          {/* </KBarProvider> */}
        </GeistProvider>
      </HMSThemeProvider>
    </HMSRoomProvider>
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
function useHistory() {
  throw new Error("Function not implemented.");
}

