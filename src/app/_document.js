import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

// extending classes in Javascript?! The official suggestion from the Next.js team:
// https://github.com/zeit/next.js/blob/canary/examples/with-google-analytics/pages/_document.js
export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <script defer src="https://cloud.umami.is/script.js" data-website-id="78db0d63-9409-47bf-ad77-bd47e1e234a5"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}