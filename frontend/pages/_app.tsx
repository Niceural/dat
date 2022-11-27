import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Fredoka } from '@next/font/google'

const fredoka = Fredoka({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${fredoka.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
