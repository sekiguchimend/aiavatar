import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form } from '@/components/form'
import MessageReceiver from '@/components/messageReceiver'
import { Menu } from '@/components/menu'
import ModalImage from '@/components/modalImage'
import VrmViewer from '@/components/vrmViewer'
import Live2DViewer from '@/components/live2DViewer'
import { Toasts } from '@/components/toasts'
import { WebSocketManager } from '@/components/websocketManager'
import CharacterPresetMenu from '@/components/characterPresetMenu'
import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'
import { handleSendChatFn } from '@/features/chat/handlers'
import { buildUrl } from '@/utils/buildUrl'

const Widget = () => {
  const router = useRouter()
  const {
    'api-key': apiKey,
    'model-type': modelType,
    'character-name': characterName,
  } = router.query

  const webcamStatus = homeStore((s) => s.webcamStatus)
  const captureStatus = homeStore((s) => s.captureStatus)
  const backgroundImageUrl = homeStore((s) => s.backgroundImageUrl)
  const useVideoAsBackground = settingsStore((s) => s.useVideoAsBackground)
  const messageReceiverEnabled = settingsStore((s) => s.messageReceiverEnabled)
  const currentModelType = settingsStore((s) => s.modelType)

  const bgUrl =
    (webcamStatus || captureStatus) && useVideoAsBackground
      ? ''
      : `url(${buildUrl(backgroundImageUrl)})`

  useEffect(() => {
    // Apply widget configuration
    if (router.query.widget === 'true') {
      // Hide introduction for widget mode
      homeStore.setState({ showIntroduction: false })

      // Apply API key if provided
      if (apiKey && typeof apiKey === 'string') {
        settingsStore.setState({ openaiKey: apiKey })
      }

      // Apply model type if provided
      if (modelType && typeof modelType === 'string') {
        settingsStore.setState({ modelType: modelType as 'vrm' | 'live2d' })
      }

      // Apply character name if provided
      if (characterName && typeof characterName === 'string') {
        settingsStore.setState({ characterName })
      }

      // Notify parent that widget is ready
      if (typeof window !== 'undefined' && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'widget-ready',
            data: { status: 'ready' },
          },
          '*'
        )
      }
    }
  }, [router.query, apiKey, modelType, characterName])

  const handleSendChat = handleSendChatFn()

  // Listen for messages from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'send-message') {
        const message = event.data.data?.message
        if (message && typeof message === 'string') {
          // Send message directly
          handleSendChat(message)

          // Notify parent
          if (typeof window !== 'undefined' && window.parent !== window) {
            window.parent.postMessage(
              {
                type: 'message-sent',
                data: { message },
              },
              '*'
            )
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleSendChat])

  const assistantMessage = homeStore((s) => s.assistantMessage)

  // Listen for assistant messages to notify parent
  useEffect(() => {
    if (
      assistantMessage &&
      typeof window !== 'undefined' &&
      window.parent !== window
    ) {
      window.parent.postMessage(
        {
          type: 'message-received',
          data: { message: assistantMessage },
        },
        '*'
      )
    }
  }, [assistantMessage])

  const displayModelType = (
    modelType && typeof modelType === 'string' ? modelType : currentModelType
  ) as 'vrm' | 'live2d'

  return (
    <div className="h-[100svh] bg-cover" style={{ backgroundImage: bgUrl }}>
      {displayModelType === 'vrm' ? <VrmViewer /> : <Live2DViewer />}
      <Form />
      <Menu />
      <ModalImage />
      {messageReceiverEnabled && <MessageReceiver />}
      <Toasts />
      <WebSocketManager />
      <CharacterPresetMenu />
    </div>
  )
}

export default Widget
