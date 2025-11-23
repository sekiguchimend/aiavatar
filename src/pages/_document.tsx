import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2&family=Montserrat&display=swap"
          rel="stylesheet"
        />
        {/* Live2D Cubism Core preload for faster loading */}
        <link
          rel="preload"
          href="/scripts/live2dcubismcore.min.js"
          as="script"
        />
        <link rel="dns-prefetch" href="https://cubism.live2d.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
