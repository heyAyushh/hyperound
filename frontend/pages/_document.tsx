import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import SITE from '../SITE.config'
import { CssBaseline } from '@geist-ui/react'
import flush from 'styled-jsx/server'

class SITEDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<{
    styles: JSX.Element;
    html: string;
    head?: JSX.Element[];
  }> {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
          {flush()}
        </>
      ),
    }
  }

  render(): JSX.Element {
    return (
      <Html lang={SITE.language}>
        <Head >
          <meta charSet="utf-8" />
          {/* apple touch icon */}
          <link rel="apple-touch-icon" sizes="57x57" href={'/apple-touch-icon.png'} />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${SITE.googleAnalytics}`}
          />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${SITE.googleAnalytics}');
              `,
            }}
          />
        </body>
      </Html>
    )
  }
}

export default SITEDocument