import '@charcoal-ui/icons'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'

import homeStore from '@/features/stores/home'
import '@/styles/globals.css'
import migrateStore from '@/utils/migrateStore'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const hs = homeStore.getState()

    if (hs.userOnboarded) {
      return
    }

    migrateStore()

    homeStore.setState({ userOnboarded: true })
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
