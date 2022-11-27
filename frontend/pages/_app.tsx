import { useState, useCallback } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserContext } from '../components/UserContext'

import { Fredoka } from '@next/font/google'

const fredoka = Fredoka({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState("");
  const reset = useCallback(() => {
    setAccount("")
  }, [])

  return (
    <UserContext.Provider value={{
      account,
      setAccount,
      reset
    }}>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <style jsx global>{`
        * {
          font-family: ${fredoka.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
