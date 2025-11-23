import Image from 'next/image'

import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'
import { multiModalAIServices } from '@/features/stores/settings'

const YouTube = () => {
  const youtubeApiKey = settingsStore((s) => s.youtubeApiKey)
  const youtubeMode = settingsStore((s) => s.youtubeMode)
  const youtubeLiveId = settingsStore((s) => s.youtubeLiveId)
  const externalLinkageMode = settingsStore((s) => s.externalLinkageMode)

  const conversationContinuityMode = settingsStore(
    (s) => s.conversationContinuityMode
  )

  const handleChangeYoutubeMode = (youtubeMode: boolean) => {
    settingsStore.setState({ youtubeMode })

    if (youtubeMode) {
      homeStore.setState({ modalImage: '' })
      menuStore.setState({ showWebcam: false })
    } else {
      settingsStore.setState({ youtubePlaying: false })
    }
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <Image
          src="/images/setting-icons/youtube-settings.svg"
          alt="YouTube Settings"
          width={24}
          height={24}
          className="mr-2"
        />
        <h2 className="text-2xl font-bold">{'YouTube設定'}</h2>
      </div>
      <div className="mb-4 text-xl font-bold">{'YouTubeモード'}</div>
      <div className="my-2">
        {youtubeMode ? (
          <TextButton onClick={() => handleChangeYoutubeMode(false)}>
            {'状態:ON'}
          </TextButton>
        ) : (
          <TextButton onClick={() => handleChangeYoutubeMode(true)}>
            {'状態:OFF'}
          </TextButton>
        )}
      </div>
      <div className="mt-4">
        {(() => {
          if (youtubeMode) {
            return (
              <>
                <div className="">
                  {'先頭が「#」のコメントは無視されます。'}
                </div>
                <div className="my-4 text-xl font-bold">
                  {'YouTube API キー'}
                </div>
                <input
                  className="text-ellipsis px-4 py-2 w-col-span-2 bg-white hover:bg-white-hover rounded-lg"
                  type="text"
                  placeholder="..."
                  value={youtubeApiKey}
                  onChange={(e) =>
                    settingsStore.setState({
                      youtubeApiKey: e.target.value,
                    })
                  }
                />
                <div className="my-4 text-xl font-bold">
                  {'YouTube Live ID'}
                </div>
                <input
                  className="text-ellipsis px-4 py-2 w-col-span-2 bg-white hover:bg-white-hover rounded-lg"
                  type="text"
                  placeholder="..."
                  value={youtubeLiveId}
                  onChange={(e) =>
                    settingsStore.setState({
                      youtubeLiveId: e.target.value,
                    })
                  }
                />
                <div className="mt-6">
                  <div className="my-4 text-xl font-bold">
                    {'会話継続モード(ベータ版)'}
                  </div>
                  <div className="my-2">
                    {
                      'コメントが無いときにAIが自ら会話を継続しようとするモードです。現在OpenAI, Anthropic Claude, Google Geminiのみ対応しています。'
                    }
                  </div>
                  <div className="my-2">
                    {
                      '一度の回答で複数回LLMを呼び出すため、API利用料が増える可能性があります。ご注意ください。'
                    }
                  </div>
                  <div className="mb-4">
                    {
                      'gpt-4o, gpt-4-turbo, claude-3-opus, claude-3.5-sonnetで比較的安定動作します。'
                    }
                  </div>
                  <TextButton
                    onClick={() =>
                      settingsStore.setState({
                        conversationContinuityMode: !conversationContinuityMode,
                      })
                    }
                    disabled={externalLinkageMode}
                  >
                    {conversationContinuityMode ? '状態：ON' : '状態：OFF'}
                  </TextButton>
                </div>
              </>
            )
          }
        })()}
      </div>
    </>
  )
}
export default YouTube
