import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form } from '@/components/form'
import MessageReceiver from '@/components/messageReceiver'
import { Introduction } from '@/components/introduction'
import { Menu } from '@/components/menu'
import { Meta } from '@/components/meta'
import ModalImage from '@/components/modalImage'
import VrmViewer from '@/components/vrmViewer'
import Live2DViewer from '@/components/live2DViewer'
import { Toasts } from '@/components/toasts'
import { WebSocketManager } from '@/components/websocketManager'
import CharacterPresetMenu from '@/components/characterPresetMenu'
import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'
import { handleSendChatFn } from '@/features/chat/handlers'
import { AIService } from '@/features/constants/settings'
import { buildUrl } from '@/utils/buildUrl'
import toastStore from '@/features/stores/toast'

const Home = () => {
  const router = useRouter()
  const {
    widget,
    'api-key': apiKey,
    'google-key': googleKey,
    'ai-service': aiService,
    'ai-model': aiModel,
    'model-type': modelType,
    'character-name': characterName,
  } = router.query
  const webcamStatus = homeStore((s) => s.webcamStatus)
  const captureStatus = homeStore((s) => s.captureStatus)
  const backgroundImageUrl = homeStore((s) => s.backgroundImageUrl)
  const useVideoAsBackground = settingsStore((s) => s.useVideoAsBackground)
  const bgUrl =
    (webcamStatus || captureStatus) && useVideoAsBackground
      ? ''
      : `url(${buildUrl(backgroundImageUrl)})`
  const messageReceiverEnabled = settingsStore((s) => s.messageReceiverEnabled)
  const currentModelType = settingsStore((s) => s.modelType)
  const handleSendChat = handleSendChatFn()

  // Widget mode configuration
  useEffect(() => {
    if (widget === 'true') {
      homeStore.setState({ showIntroduction: false })

      // API Key設定（google-keyパラメータもサポート）
      if (googleKey && typeof googleKey === 'string') {
        settingsStore.setState({ googleKey })
        settingsStore.setState({ selectAIService: 'google' })
        settingsStore.setState({ selectAIModel: 'gemini-2.5-flash' })
      } else if (apiKey && typeof apiKey === 'string') {
        // デフォルトはOpenAI
        settingsStore.setState({ openaiKey: apiKey })
      }

      // AI Service設定
      if (aiService && typeof aiService === 'string') {
        settingsStore.setState({ selectAIService: aiService as AIService })
      }

      // AI Model設定
      if (aiModel && typeof aiModel === 'string') {
        settingsStore.setState({ selectAIModel: aiModel })
      }

      if (modelType && typeof modelType === 'string') {
        settingsStore.setState({ modelType: modelType as 'vrm' | 'live2d' })
      } else {
        // デフォルトをVRMに設定
        settingsStore.setState({ modelType: 'vrm' })
      }

      if (characterName && typeof characterName === 'string') {
        settingsStore.setState({ characterName })
      }

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
  }, [widget, apiKey, googleKey, aiService, aiModel, modelType, characterName])

  // Listen for messages from parent (widget mode)
  useEffect(() => {
    if (widget !== 'true') return

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'send-message') {
        const message = event.data.data?.message
        if (message && typeof message === 'string') {
          handleSendChat(message)
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
  }, [widget, handleSendChat])

  const assistantMessage = homeStore((s) => s.assistantMessage)

  // Notify parent of assistant messages (widget mode)
  useEffect(() => {
    if (
      widget === 'true' &&
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
  }, [widget, assistantMessage])
  const characterPresets = [
    {
      key: 'characterPreset1',
      value: settingsStore((s) => s.characterPreset1),
    },
    {
      key: 'characterPreset2',
      value: settingsStore((s) => s.characterPreset2),
    },
    {
      key: 'characterPreset3',
      value: settingsStore((s) => s.characterPreset3),
    },
    {
      key: 'characterPreset4',
      value: settingsStore((s) => s.characterPreset4),
    },
    {
      key: 'characterPreset5',
      value: settingsStore((s) => s.characterPreset5),
    },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
        // shiftキーを押しながら数字キーを押すためのマッピング
        const keyMap: { [key: string]: number } = {
          Digit1: 1,
          Digit2: 2,
          Digit3: 3,
          Digit4: 4,
          Digit5: 5,
        }

        const keyNumber = keyMap[event.code]

        if (keyNumber) {
          settingsStore.setState({
            systemPrompt: characterPresets[keyNumber - 1].value,
          })
          const presetNames = [
            'プリセット1',
            'プリセット2',
            'プリセット3',
            'プリセット4',
            'プリセット5',
          ]
          toastStore.getState().addToast({
            message: `${presetNames[keyNumber - 1]}に切り替わりました。`,
            type: 'info',
            tag: `character-preset-switching`,
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="h-[100svh] bg-cover" style={{ backgroundImage: bgUrl }}>
      <Meta />
      <Introduction />
      {(modelType && typeof modelType === 'string'
        ? modelType
        : currentModelType) === 'vrm' ? (
        <VrmViewer />
      ) : (
        <Live2DViewer />
      )}
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

export default Home
