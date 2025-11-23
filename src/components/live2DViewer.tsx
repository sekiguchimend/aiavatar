'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import homeStore from '@/features/stores/home'

const Live2DComponent = dynamic(() => import('./Live2DComponent'), {
  ssr: false,
  loading: () => null,
})

export default function Live2DViewer() {
  const [isMounted, setIsMounted] = useState(false)
  const [scriptLoadRetries, setScriptLoadRetries] = useState({
    cubismcore: 0,
  })
  const MAX_RETRIES = 3

  const isCubismCoreLoaded = homeStore((s) => s.isCubismCoreLoaded)
  const setIsCubismCoreLoaded = homeStore((s) => s.setIsCubismCoreLoaded)

  const retryLoadScript = (scriptName: 'cubismcore') => {
    if (scriptLoadRetries[scriptName] < MAX_RETRIES) {
      setScriptLoadRetries((prev) => ({
        ...prev,
        [scriptName]: prev[scriptName] + 1,
      }))
      return true
    }
    return false
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <div className="fixed bottom-0 right-0 w-screen h-screen z-5">
      <Script
        key={`cubismcore-${scriptLoadRetries.cubismcore}`}
        src="/scripts/live2dcubismcore.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setIsCubismCoreLoaded(true)
        }}
        onError={() => {
          if (typeof window !== 'undefined') {
            const cdnScript = document.createElement('script')
            cdnScript.src =
              'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'
            cdnScript.async = true
            cdnScript.onload = () => {
              setIsCubismCoreLoaded(true)
            }
            cdnScript.onerror = () => {
              retryLoadScript('cubismcore')
            }
            document.head.appendChild(cdnScript)
          }
        }}
      />
      {isCubismCoreLoaded && <Live2DComponent />}
    </div>
  )
}
