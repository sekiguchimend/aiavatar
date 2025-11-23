import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'
import { useCallback } from 'react'

const ExternalLinkage = () => {
  const externalLinkageMode = settingsStore((s) => s.externalLinkageMode)

  const handleExternalLinkageModeChange = useCallback((newMode: boolean) => {
    settingsStore.setState({
      externalLinkageMode: newMode,
    })

    if (newMode) {
      settingsStore.setState({
        conversationContinuityMode: false,
        realtimeAPIMode: false,
      })
    }
  }, [])

  return (
    <div className="mb-10">
      <div className="mb-4 text-xl font-bold">{'外部連携モード(ベータ版)'}</div>
      <div className="my-2">
        <TextButton
          onClick={() => {
            handleExternalLinkageModeChange(!externalLinkageMode)
          }}
        >
          {externalLinkageMode ? '状態:ON' : '状態:OFF'}
        </TextButton>
      </div>
    </div>
  )
}
export default ExternalLinkage
