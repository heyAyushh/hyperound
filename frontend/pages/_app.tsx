import "../styles/globals.css"
import "../styles/styles.css";
import { GeistProvider, CssBaseline } from "@geist-ui/react"
import { ThemeProvider, useTheme } from 'next-themes';
import '../styles/global.css';

const Geist = ({ Component, pageProps }) => {

  let { theme } = useTheme();

  return (
    <GeistProvider themeType={theme? theme: 'light'}>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}

function MyApp({ Component, pageProps }) {

  return (
    <ThemeProvider defaultTheme="light" attribute="class" >
      <Geist Component={Component} pageProps={pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
