import "../styles/globals.css"
import "../styles/styles.css";
import { GeistProvider, CssBaseline } from "@geist-ui/react"

function MyApp({ Component, pageProps }) {
  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}

export default MyApp
