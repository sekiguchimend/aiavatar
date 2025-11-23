import { useEffect, useState } from 'react'
import Image from 'next/image'
import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'

const Based = () => {
  const showAssistantText = settingsStore((s) => s.showAssistantText)
  const showCharacterName = settingsStore((s) => s.showCharacterName)
  const showControlPanel = settingsStore((s) => s.showControlPanel)
  const useVideoAsBackground = settingsStore((s) => s.useVideoAsBackground)
  const changeEnglishToJapanese = settingsStore(
    (s) => s.changeEnglishToJapanese
  )
  const [backgroundFiles, setBackgroundFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const backgroundImageUrl = homeStore((s) => s.backgroundImageUrl)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetch('/api/get-background-list')
      .then((res) => res.json())
      .then((files) =>
        setBackgroundFiles(files.filter((file: string) => file !== 'bg-c.png'))
      )
      .catch((error) => {
        console.error('Error fetching background list:', error)
        setError('背景リストの取得に失敗しました')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleBackgroundUpload = async (file: File) => {
    // ファイルタイプの検証
    if (!file.type.startsWith('image/')) {
      setUploadError('画像ファイルのみアップロード可能です')
      return
    }

    // ファイルサイズの検証（例：5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ファイルサイズは5MB以下にしてください')
      return
    }

    setIsUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-background', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`${'アップロード失敗'}: ${response.status}`)
      }

      const { path } = await response.json()
      homeStore.setState({ backgroundImageUrl: path })

      // バックグラウンドリストを更新
      setIsLoading(true)
      setError(null)
      const listResponse = await fetch('/api/get-background-list')
      if (!listResponse.ok) {
        throw new Error('背景リストの取得に失敗しました')
      }
      const files = await listResponse.json()
      setBackgroundFiles(files.filter((file: string) => file !== 'bg-c.png'))
    } catch (error) {
      console.error('Error uploading background:', error)
      setUploadError('背景画像のアップロードに失敗しました')
    } finally {
      setIsUploading(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Image
            src="/images/setting-icons/basic-settings.svg"
            alt="Basic Settings"
            width={24}
            height={24}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold">{'基本設定'}</h2>
        </div>
      </div>
      <div className="my-6">
        <div className="my-4 text-base font-bold">
          {'英単語を日本語で読み上げる'}
        </div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState((prevState) => ({
                changeEnglishToJapanese: !prevState.changeEnglishToJapanese,
              }))
            }
          >
            {changeEnglishToJapanese ? '状態：ON' : '状態：OFF'}
          </TextButton>
        </div>
      </div>
      <div className="mt-6">
        <div className="my-4 text-xl font-bold">{'背景設定'}</div>
        <div className="my-4">
          {'アプリケーションの背景画像をアップロードして選択できます。'}
        </div>

        {isLoading && <div className="my-2">{'読み込み中...'}</div>}
        {error && <div className="my-2 text-red-500">{error}</div>}
        {uploadError && <div className="my-2 text-red-500">{uploadError}</div>}

        <div className="flex flex-col mb-4">
          <label className="mb-2 text-base">{'背景画像'}</label>
          <select
            className="text-ellipsis px-4 py-2 w-col-span-2 bg-white hover:bg-white-hover rounded-lg"
            value={backgroundImageUrl}
            onChange={(e) => {
              const path = e.target.value
              homeStore.setState({ backgroundImageUrl: path })
            }}
            disabled={isLoading || isUploading}
          >
            <option value="/backgrounds/bg-c.png">{'デフォルト背景'}</option>
            {backgroundFiles.map((file) => (
              <option key={file} value={`/backgrounds/${file}`}>
                {file}
              </option>
            ))}
          </select>
        </div>

        <div className="my-4">
          <TextButton
            onClick={() => {
              const { fileInput } = menuStore.getState()
              if (fileInput) {
                fileInput.accept = 'image/*'
                fileInput.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) {
                    handleBackgroundUpload(file)
                  }
                }
                fileInput.click()
              }
            }}
            disabled={isLoading || isUploading}
          >
            {isUploading ? 'アップロード中...' : '背景画像をアップロード'}
          </TextButton>
        </div>
      </div>

      {/* アシスタントテキスト表示設定 */}
      <div className="my-6">
        <div className="my-4 text-xl font-bold">{'回答欄を表示する'}</div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                showAssistantText: !s.showAssistantText,
              }))
            }
          >
            {showAssistantText ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>

      {/* キャラクター名表示設定 */}
      <div className="my-6">
        <div className="my-4 text-xl font-bold">
          {'回答欄にキャラクター名を表示する'}
        </div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                showCharacterName: !s.showCharacterName,
              }))
            }
          >
            {showCharacterName ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>

      {/* コントロールパネル表示設定 */}
      <div className="my-6">
        <div className="my-4 text-xl font-bold">{'操作パネルを表示する'}</div>
        <div className="my-4 text-base whitespace-pre-wrap">
          {`設定画面は Cmd + . (Mac) / Ctrl + . (Windows) で表示することができます。
スマートフォンをご利用の場合は、画面左上を長押し(約1秒)でも可能です。`}
        </div>

        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState({
                showControlPanel: !showControlPanel,
              })
            }
          >
            {showControlPanel ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>
    </>
  )
}
export default Based
