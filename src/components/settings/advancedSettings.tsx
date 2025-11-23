import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'

const AdvancedSettings = () => {
  const includeTimestampInUserMessage = settingsStore(
    (s) => s.includeTimestampInUserMessage
  )
  const useVideoAsBackground = settingsStore((s) => s.useVideoAsBackground)
  const showCharacterPresetMenu = settingsStore(
    (s) => s.showCharacterPresetMenu
  )

  return (
    <div className="mb-10">
      <div className="mb-6 grid-cols-2">
        <div className="mb-4 text-xl font-bold">{'設定をリセットする'}</div>
        <div className="my-4 text-base">
          {
            '環境変数が設定されている場合はその値が優先されます。ページが再読み込みされます。'
          }
        </div>
        <TextButton
          onClick={() => {
            settingsStore.persist.clearStorage()
            window.location.reload()
          }}
        >
          {'設定リセット'}
        </TextButton>
      </div>
      <div className="my-6">
        <div className="my-4 text-xl font-bold">
          {'共有画面またはWebカメラを背景として使用する'}
        </div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                useVideoAsBackground: !s.useVideoAsBackground,
              }))
            }
          >
            {useVideoAsBackground ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>
      <div className="my-6">
        <div className="my-4 text-xl font-bold">
          {'キャラクタープリセットメニューボタンを表示する'}
        </div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState((s) => ({
                showCharacterPresetMenu: !s.showCharacterPresetMenu,
              }))
            }
          >
            {showCharacterPresetMenu ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>
      <div className="my-6">
        <div className="my-4 text-xl font-bold">
          {'ユーザー発言にタイムスタンプを含める'}
        </div>
        <div className="my-4 text-base whitespace-pre-line">
          {`ユーザー発言にタイムスタンプを含めることで、AIが時間を考慮して応答を生成できるようになります。
以下のような文章をシステムプロンプトに含めてください。

「ユーザー入力が [timestamp] 付きでリクエストされる場合があります。これはリクエスト時点のUTCタイムゾーンの時刻を表しているので、その時刻を考慮したうえで回答を生成してください。」`}
        </div>
        <div className="my-2">
          <TextButton
            onClick={() =>
              settingsStore.setState({
                includeTimestampInUserMessage: !includeTimestampInUserMessage,
              })
            }
          >
            {includeTimestampInUserMessage ? '状態:ON' : '状態:OFF'}
          </TextButton>
        </div>
      </div>
    </div>
  )
}
export default AdvancedSettings
