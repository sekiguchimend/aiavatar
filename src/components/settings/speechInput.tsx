import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'
import Image from 'next/image'
import { useEffect } from 'react'
import { WhisperTranscriptionModel } from '@/features/constants/settings'
import { Link } from '../link'
import { getOpenAIWhisperModels } from '@/features/constants/aiModels'

const SpeechInput = () => {
  const noSpeechTimeout = settingsStore((s) => s.noSpeechTimeout)
  const showSilenceProgressBar = settingsStore((s) => s.showSilenceProgressBar)
  const speechRecognitionMode = settingsStore((s) => s.speechRecognitionMode)
  const whisperTranscriptionModel = settingsStore(
    (s) => s.whisperTranscriptionModel
  )
  const openaiKey = settingsStore((s) => s.openaiKey)
  const continuousMicListeningMode = settingsStore(
    (s) => s.continuousMicListeningMode
  )
  const initialSpeechTimeout = settingsStore((s) => s.initialSpeechTimeout)
  const realtimeAPIMode = settingsStore((s) => s.realtimeAPIMode)
  const audioMode = settingsStore((s) => s.audioMode) // whisperモードの場合、自動的にnoSpeechTimeoutを0に、showSilenceProgressBarをfalseに設定
  useEffect(() => {
    if (speechRecognitionMode === 'whisper') {
      settingsStore.setState({
        initialSpeechTimeout: 0,
        noSpeechTimeout: 0,
        showSilenceProgressBar: false,
        continuousMicListeningMode: false,
      })
    }
  }, [speechRecognitionMode])

  // realtimeAPIモードかaudioモードがオンの場合、強制的にbrowserモードに設定
  useEffect(() => {
    if (realtimeAPIMode || audioMode) {
      settingsStore.setState({
        speechRecognitionMode: 'browser',
      })
    }
  }, [realtimeAPIMode, audioMode])

  const whisperModels: { value: WhisperTranscriptionModel; label: string }[] =
    getOpenAIWhisperModels().map((m) => ({
      value: m as WhisperTranscriptionModel,
      label: m,
    }))

  // realtimeAPIモードかaudioモードがオンの場合はボタンを無効化
  const isSpeechModeSwitchDisabled = realtimeAPIMode || audioMode

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <Image
          src="/images/setting-icons/microphone-settings.svg"
          alt="Microphone Settings"
          width={24}
          height={24}
          className="mr-2"
        />
        <h2 className="text-2xl font-bold">{'音声入力設定'}</h2>
      </div>
      <div className="my-6">
        <div className="my-4 text-xl font-bold">{'音声認識モード'}</div>
        <div className="my-4 text-base whitespace-pre-line">
          {`音声認識モードを選択できます。
「ブラウザ標準」はブラウザ内蔵の音声認識を使用します。「OpenAI TTS」はOpenAIのText to Speech APIを使用します。
一般的には「ブラウザ標準」の方が精度が高く、認識速度も速いため推奨されます。ただし、FirefoxなどWebSpeech APIに対応していないブラウザを使用している場合は、「OpenAI TTS」を選択してください。`}
        </div>
        {isSpeechModeSwitchDisabled && (
          <div className="my-4 text-sm text-orange-500 whitespace-pre-line">
            {`オーディオモードが有効な場合、ブラウザ音声認識のみが使用可能です。
また、リアルタイムAPIモードではブラウザ音声認識のみが使用可能な上、音声認識タイムアウト機能が無効になります。`}
          </div>
        )}
        <div className="mt-2">
          <TextButton
            onClick={() =>
              settingsStore.setState({
                speechRecognitionMode:
                  speechRecognitionMode === 'browser' ? 'whisper' : 'browser',
              })
            }
            disabled={isSpeechModeSwitchDisabled}
          >
            {speechRecognitionMode === 'browser'
              ? 'ブラウザ標準の音声認識を使用'
              : 'OpenAI TTS音声認識を使用'}
          </TextButton>
        </div>
      </div>
      {speechRecognitionMode === 'whisper' && (
        <>
          <div className="my-6">
            <div className="my-4 text-xl font-bold">{'OpenAI API キー'}</div>
            <div className="my-4">
              {
                'APIキーは下記のリンクから取得できます。取得したAPIキーをフォームに入力してください。'
              }
              <br />
              <Link
                url="https://platform.openai.com/account/api-keys"
                label="OpenAI"
              />
            </div>
            <input
              className="text-ellipsis px-4 py-2 w-full md:w-1/2 bg-white hover:bg-white-hover rounded-lg"
              type="text"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) =>
                settingsStore.setState({ openaiKey: e.target.value })
              }
            />
          </div>
          <div className="mt-6">
            <div className="mb-4 text-xl font-bold">{'文字起こしモデル'}</div>
            <div className="mb-4 text-base whitespace-pre-line">
              {
                '音声認識に使用するモデルを選択できます。より高性能なモデルほど高精度で認識可能ですが、APIコストが高くなる場合があります。'
              }
            </div>
            <select
              id="whisper-model-select"
              className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg w-full md:w-1/2"
              value={whisperTranscriptionModel}
              onChange={(e) =>
                settingsStore.setState({
                  whisperTranscriptionModel: e.target
                    .value as WhisperTranscriptionModel,
                })
              }
            >
              {whisperModels.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      {speechRecognitionMode === 'browser' && !realtimeAPIMode && (
        <>
          <div className="my-6">
            <div className="my-4 text-xl font-bold">
              {'音声認識タイムアウト'}
            </div>
            <div className="my-4 text-base whitespace-pre-line">
              {`音声認識開始後、最初の発話が検出されるまでの待機時間を設定します。この時間内に発話が検出されない場合、音声認識は自動的に停止します。
0秒に設定すると、待機時間は無制限になります。`}
            </div>
            <div className="mt-6 font-bold">
              <div className="select-none">
                {'音声認識タイムアウト'}: {initialSpeechTimeout.toFixed(1)}秒
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="0.5"
                value={initialSpeechTimeout}
                onChange={(e) =>
                  settingsStore.setState({
                    initialSpeechTimeout: parseFloat(e.target.value),
                  })
                }
                className="mt-2 mb-4 input-range"
              />
            </div>
          </div>
          <div className="my-6">
            <div className="my-4 text-xl font-bold">
              {'無音検出タイムアウト'}
            </div>
            <div className="my-4 text-base whitespace-pre-line">
              {`音声入力時に無音状態が続いた場合、自動的に入力を終了するまでの時間を設定します。
0秒に設定すると、無音検出による自動送信を無効にします。`}
            </div>
            <div className="mt-6 font-bold">
              <div className="select-none">
                {'無音検出タイムアウト'}: {noSpeechTimeout.toFixed(1)}秒
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={noSpeechTimeout}
                onChange={(e) =>
                  settingsStore.setState({
                    noSpeechTimeout: parseFloat(e.target.value),
                  })
                }
                className="mt-2 mb-4 input-range"
              />
            </div>
            <div className="mt-6">
              <div className="font-bold mb-2">
                {'無音検出プログレスバーを表示'}
              </div>
              <TextButton
                onClick={() =>
                  settingsStore.setState({
                    showSilenceProgressBar: !showSilenceProgressBar,
                  })
                }
              >
                {showSilenceProgressBar ? '状態:ON' : '状態:OFF'}
              </TextButton>
            </div>
          </div>
          <div className="my-6">
            <div className="my-4 text-xl font-bold">{'常時マイク入力'}</div>
            <div className="my-4 text-base whitespace-pre-line">
              {`AIの発話が終了したタイミングで自動的にマイク入力を再開します。設定された無音時間経過後に自動的に送信します。
音声認識がされないまま設定時間を超えると、自動的に常時マイク入力はOFFになるため、常にONにしておきたい場合は音声認識タイムアウトを0秒に設定してください。`}
            </div>
            <TextButton
              onClick={() =>
                settingsStore.setState({
                  continuousMicListeningMode: !continuousMicListeningMode,
                })
              }
            >
              {continuousMicListeningMode ? '状態:ON' : '状態:OFF'}
            </TextButton>
          </div>
        </>
      )}
    </div>
  )
}

export default SpeechInput
