import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import settingsStore, {
  multiModalAIServiceKey,
} from '@/features/stores/settings'
import { AssistantText } from './assistantText'
import { ChatLog } from './chatLog'
import { IconButton } from './iconButton'
import Settings from './settings'
import { Webcam } from './webcam'
import Capture from './capture'
import { multiModalAIServices } from '@/features/stores/settings'

// モバイルデバイス検出用のカスタムフック
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // モバイルデバイス検出用の関数
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      )
    }

    // 初回レンダリング時とウィンドウサイズ変更時に検出
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export const Menu = () => {
  const selectAIService = settingsStore((s) => s.selectAIService)
  const assistantMessage = homeStore((s) => s.assistantMessage)
  const showWebcam = menuStore((s) => s.showWebcam)
  const showControlPanel = settingsStore((s) => s.showControlPanel)
  const showCapture = menuStore((s) => s.showCapture)
  const showAssistantText = settingsStore((s) => s.showAssistantText)

  const [showSettings, setShowSettings] = useState(false)
  const [showChatLog, setShowChatLog] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const imageFileInputRef = useRef<HTMLInputElement>(null)

  // ロングタップ用のステート
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null)
  const [touchEndTime, setTouchEndTime] = useState<number | null>(null)

  // モバイルデバイス検出
  const isMobile = useIsMobile()

  const { t } = useTranslation()

  // ロングタップ処理用の関数
  const handleTouchStart = () => {
    setTouchStartTime(Date.now())
  }

  const handleTouchEnd = () => {
    setTouchEndTime(Date.now())
    if (touchStartTime && Date.now() - touchStartTime >= 800) {
      // 800ms以上押し続けるとロングタップと判定
      setShowSettings(true)
    }
    setTouchStartTime(null)
  }

  const handleTouchCancel = () => {
    setTouchStartTime(null)
  }


  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      const file = files[0]
      if (!file) return

      const file_type = file.name.split('.').pop()

      if (file_type === 'vrm') {
        const blob = new Blob([file], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)

        const hs = homeStore.getState()
        hs.viewer.loadVrm(url)
      }

      event.target.value = ''
    },
    []
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '.') {
        setShowSettings((prevState) => !prevState)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    console.log('onChangeWebcamStatus')
    homeStore.setState({ webcamStatus: showWebcam })

    if (showWebcam) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          setShowPermissionModal(false)
        })
        .catch(() => {
          setShowPermissionModal(true)
          homeStore.setState({ webcamStatus: false })
          menuStore.setState({ showWebcam: false })
        })
    }
  }, [showWebcam])

  useEffect(() => {
    homeStore.setState({ captureStatus: showCapture })
  }, [showCapture])

  const toggleCapture = useCallback(() => {
    menuStore.setState(({ showCapture }) => ({ showCapture: !showCapture }))
    menuStore.setState({ showWebcam: false })
    if (!showCapture) {
      homeStore.setState({ webcamStatus: false })
    }
  }, [showCapture])

  const toggleWebcam = useCallback(() => {
    menuStore.setState(({ showWebcam }) => ({ showWebcam: !showWebcam }))
    menuStore.setState({ showCapture: false })
    if (!showWebcam) {
      homeStore.setState({ captureStatus: false })
    }
  }, [showWebcam])

  return (
    <>
      {isMobile && !showControlPanel && (
        <div
          className="absolute top-0 left-0 z-30 w-20 h-20"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div className="w-full h-full opacity-0"></div>
        </div>
      )}

      <div className="absolute z-15 m-6">
        <div
          className="grid md:grid-flow-col gap-[8px] mb-10"
          style={{ width: 'max-content' }}
        >
          {showControlPanel && (
            <>
              <div className="md:order-1 order-2">
                <IconButton
                  iconName="24/Settings"
                  isProcessing={false}
                  onClick={() => setShowSettings(true)}
                ></IconButton>
              </div>
              <div className="md:order-2 order-1">
                {showChatLog ? (
                  <IconButton
                    iconName="24/CommentOutline"
                    label={t('ChatLog')}
                    isProcessing={false}
                    onClick={() => setShowChatLog(false)}
                  />
                ) : (
                  <IconButton
                    iconName="24/CommentFill"
                    label={t('ChatLog')}
                    isProcessing={false}
                    disabled={false}
                    onClick={() => setShowChatLog(true)}
                  />
                )}
              </div>
              {multiModalAIServices.includes(
                selectAIService as multiModalAIServiceKey
              ) && (
                <>
                  <div className="order-3">
                    <IconButton
                      iconName="screen-share"
                      isProcessing={false}
                      onClick={toggleCapture}
                    />
                  </div>
                  <div className="order-4">
                    <IconButton
                      iconName="24/Camera"
                      isProcessing={false}
                      onClick={toggleWebcam}
                    />
                  </div>
                  <div className="order-4">
                    <IconButton
                      iconName="24/AddImage"
                      isProcessing={false}
                      onClick={() => imageFileInputRef.current?.click()}
                    />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={imageFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (e) => {
                            const imageUrl = e.target?.result as string
                            homeStore.setState({ modalImage: imageUrl })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {showChatLog && <ChatLog />}
      {showSettings && <Settings onClickClose={() => setShowSettings(false)} />}
      {!showChatLog &&
        assistantMessage &&
        showAssistantText && <AssistantText message={assistantMessage} />}
      {showWebcam && navigator.mediaDevices && <Webcam />}
      {showCapture && <Capture />}
      {showPermissionModal && (
        <div className="modal">
          <div className="modal-content">
            <p>カメラの使用を許可してください。</p>
            <button onClick={() => setShowPermissionModal(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={(fileInput) => {
          if (!fileInput) {
            menuStore.setState({ fileInput: null })
            return
          }

          menuStore.setState({ fileInput })
        }}
        onChange={handleChangeVrmFile}
      />
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={(bgFileInput) => {
          if (!bgFileInput) {
            menuStore.setState({ bgFileInput: null })
            return
          }

          menuStore.setState({ bgFileInput })
        }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            const imageUrl = URL.createObjectURL(file)
            homeStore.setState({ backgroundImageUrl: imageUrl })
          }
        }}
      />
    </>
  )
}
