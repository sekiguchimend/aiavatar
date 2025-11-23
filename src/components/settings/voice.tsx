import { useState, useEffect } from 'react'
import Image from 'next/image'

import {
  PRESET_A,
  PRESET_B,
  PRESET_C,
  PRESET_D,
} from '@/features/constants/koeiroParam'
import {
  AIVoice,
  OpenAITTSVoice,
  OpenAITTSModel,
} from '@/features/constants/settings'
import { getOpenAITTSModels } from '@/features/constants/aiModels'
import { testVoice } from '@/features/messages/speakCharacter'
import settingsStore from '@/features/stores/settings'
import { Link } from '../link'
import { TextButton } from '../textButton'
import speakers from '../speakers.json'
import speakersAivisInitial from '../../../public/speakers_aivis.json'

const Voice = () => {
  const [speakersAivis, setSpeakersAivis] = useState(speakersAivisInitial)
  const [aivisModels, setAivisModels] = useState<
    Array<{ uuid: string; name: string; creator_name?: string }>
  >([])
  const [loadingModels, setLoadingModels] = useState(false)
  const koeiromapKey = settingsStore((s) => s.koeiromapKey)
  const elevenlabsApiKey = settingsStore((s) => s.elevenlabsApiKey)

  const realtimeAPIMode = settingsStore((s) => s.realtimeAPIMode)
  const audioMode = settingsStore((s) => s.audioMode)

  const selectVoice = settingsStore((s) => s.selectVoice)
  const koeiroParam = settingsStore((s) => s.koeiroParam)
  const googleTtsType = settingsStore((s) => s.googleTtsType)
  const voicevoxSpeaker = settingsStore((s) => s.voicevoxSpeaker)
  const voicevoxSpeed = settingsStore((s) => s.voicevoxSpeed)
  const voicevoxPitch = settingsStore((s) => s.voicevoxPitch)
  const voicevoxIntonation = settingsStore((s) => s.voicevoxIntonation)
  const voicevoxServerUrl = settingsStore((s) => s.voicevoxServerUrl)
  const aivisSpeechSpeaker = settingsStore((s) => s.aivisSpeechSpeaker)
  const aivisSpeechSpeed = settingsStore((s) => s.aivisSpeechSpeed)
  const aivisSpeechPitch = settingsStore((s) => s.aivisSpeechPitch)
  const aivisSpeechIntonation = settingsStore((s) => s.aivisSpeechIntonation)
  const aivisSpeechServerUrl = settingsStore((s) => s.aivisSpeechServerUrl)
  const aivisCloudApiKey = settingsStore((s) => s.aivisCloudApiKey)
  const aivisCloudModelUuid = settingsStore((s) => s.aivisCloudModelUuid)
  const aivisCloudStyleId = settingsStore((s) => s.aivisCloudStyleId)
  const aivisCloudStyleName = settingsStore((s) => s.aivisCloudStyleName)
  const aivisCloudUseStyleName = settingsStore((s) => s.aivisCloudUseStyleName)
  const aivisCloudSpeed = settingsStore((s) => s.aivisCloudSpeed)
  const aivisCloudPitch = settingsStore((s) => s.aivisCloudPitch)
  const aivisCloudTempoDynamics = settingsStore(
    (s) => s.aivisCloudTempoDynamics
  )
  const aivisCloudIntonationScale = settingsStore(
    (s) => s.aivisCloudIntonationScale
  )
  const aivisCloudPrePhonemeLength = settingsStore(
    (s) => s.aivisCloudPrePhonemeLength
  )
  const aivisCloudPostPhonemeLength = settingsStore(
    (s) => s.aivisCloudPostPhonemeLength
  )
  const stylebertvits2ServerUrl = settingsStore(
    (s) => s.stylebertvits2ServerUrl
  )
  const stylebertvits2ApiKey = settingsStore((s) => s.stylebertvits2ApiKey)
  const stylebertvits2ModelId = settingsStore((s) => s.stylebertvits2ModelId)
  const stylebertvits2Style = settingsStore((s) => s.stylebertvits2Style)
  const stylebertvits2SdpRatio = settingsStore((s) => s.stylebertvits2SdpRatio)
  const stylebertvits2Length = settingsStore((s) => s.stylebertvits2Length)
  const gsviTtsServerUrl = settingsStore((s) => s.gsviTtsServerUrl)
  const gsviTtsModelId = settingsStore((s) => s.gsviTtsModelId)
  const gsviTtsBatchSize = settingsStore((s) => s.gsviTtsBatchSize)
  const gsviTtsSpeechRate = settingsStore((s) => s.gsviTtsSpeechRate)
  const elevenlabsVoiceId = settingsStore((s) => s.elevenlabsVoiceId)
  const openaiAPIKey = settingsStore((s) => s.openaiKey)
  const openaiTTSVoice = settingsStore((s) => s.openaiTTSVoice)
  const openaiTTSModel = settingsStore((s) => s.openaiTTSModel)
  const openaiTTSSpeed = settingsStore((s) => s.openaiTTSSpeed)
  const azureTTSKey = settingsStore((s) => s.azureTTSKey)
  const azureTTSEndpoint = settingsStore((s) => s.azureTTSEndpoint)
  const nijivoiceApiKey = settingsStore((s) => s.nijivoiceApiKey)
  const nijivoiceActorId = settingsStore((s) => s.nijivoiceActorId)
  const nijivoiceSpeed = settingsStore((s) => s.nijivoiceSpeed)
  const nijivoiceEmotionalLevel = settingsStore(
    (s) => s.nijivoiceEmotionalLevel
  )
  const nijivoiceSoundDuration = settingsStore((s) => s.nijivoiceSoundDuration)
  const [nijivoiceSpeakers, setNijivoiceSpeakers] = useState<Array<any>>([])
  const [prevNijivoiceActorId, setPrevNijivoiceActorId] = useState<string>('')
  const [speakers_aivis, setSpeakers_aivis] = useState<Array<any>>([])
  const [customVoiceText, setCustomVoiceText] = useState<string>('')

  // にじボイスの話者一覧を取得する関数
  const fetchNijivoiceSpeakers = async () => {
    try {
      const response = await fetch(
        `/api/get-nijivoice-actors?apiKey=${nijivoiceApiKey}`
      )
      const data = await response.json()
      if (data.voiceActors) {
        const sortedActors = data.voiceActors.sort(
          (a: any, b: any) => a.id - b.id
        )
        setNijivoiceSpeakers(sortedActors)
      }
    } catch (error) {
      console.error('Failed to fetch nijivoice speakers:', error)
    }
  }

  // AIVISの話者一覧を取得する関数
  const fetchAivisSpeakers = async () => {
    try {
      const response = await fetch('/speakers_aivis.json')
      const data = await response.json()
      setSpeakersAivis(data)
    } catch (error) {
      console.error('Failed to fetch AIVIS speakers:', error)
    }
  }

  // AIVIS Cloudのモデル一覧を取得する関数
  const fetchAivisModels = async () => {
    setLoadingModels(true)
    try {
      const response = await fetch(
        '/api/get-aivis-models?sort=download&limit=30'
      )
      const data = await response.json()
      if (data.models) {
        setAivisModels(data.models)
      }
    } catch (error) {
      console.error('Failed to fetch AIVIS models:', error)
    } finally {
      setLoadingModels(false)
    }
  }

  // コンポーネントマウント時またはにじボイス選択時に話者一覧を取得
  useEffect(() => {
    if (selectVoice === 'nijivoice') {
      fetchNijivoiceSpeakers()
    }
  }, [selectVoice, nijivoiceApiKey])

  // コンポーネントマウント時またはAIVIS選択時に話者一覧を取得
  useEffect(() => {
    if (selectVoice === 'aivis_speech') {
      fetchAivisSpeakers()
    }
  }, [selectVoice])

  // nijivoiceActorIdが変更された時にrecommendedVoiceSpeedを設定する処理を追加
  useEffect(() => {
    if (
      selectVoice === 'nijivoice' &&
      nijivoiceActorId &&
      nijivoiceActorId !== prevNijivoiceActorId
    ) {
      // 現在選択されていキャラクターを探す
      const selectedActor = nijivoiceSpeakers.find(
        (actor) => actor.id === nijivoiceActorId
      )

      // キャラクターが見つかり、recommendedVoiceSpeedが設定されている場合
      if (selectedActor?.recommendedVoiceSpeed) {
        settingsStore.setState({
          nijivoiceSpeed: selectedActor.recommendedVoiceSpeed,
        })
      }

      // 前回の選択を更新
      setPrevNijivoiceActorId(nijivoiceActorId)
    }
  }, [nijivoiceActorId, nijivoiceSpeakers, prevNijivoiceActorId, selectVoice])

  // 追加: realtimeAPIMode または audioMode が true の場合にメッセージを表示
  if (realtimeAPIMode || audioMode) {
    return (
      <div className="text-center text-xl whitespace-pre-line">
        {`リアルタイムAPIモード または オーディオモードが有効の場合、
合成音声設定は不要です。`}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Image
          src="/images/setting-icons/voice-settings.svg"
          alt="Voice Settings"
          width={24}
          height={24}
          className="mr-2"
        />
        <h2 className="text-2xl font-bold">{'合成音声設定'}</h2>
      </div>
      <div className="mb-4 text-xl font-bold">{'合成音声エンジンの選択'}</div>
      <div>{'使用する合成音声エンジンを選択してください。'}</div>
      <div className="my-2">
        <select
          value={selectVoice}
          onChange={(e) =>
            settingsStore.setState({ selectVoice: e.target.value as AIVoice })
          }
          className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
        >
          <option value="voicevox">{'VOICEVOXを使用する'}</option>
          <option value="koeiromap">{'Koeiromapを使用する'}</option>
          <option value="google">{'Google Text-to-Speechを使用する'}</option>
          <option value="stylebertvits2">{'Style-Bert-VITS2を使用する'}</option>
          <option value="aivis_speech">{'AivisSpeechを使用する'}</option>
          <option value="aivis_cloud">{'AIVIS Cloud APIを使用する'}</option>
          <option value="gsvitts">{'GSVI TTSを使用する'}</option>
          <option value="elevenlabs">{'ElevenLabsを使用する'}</option>
          <option value="openai">{'OpenAIを使用する'}</option>
          <option value="azure">{'Azure OpenAIを使用する'}</option>
          <option value="nijivoice">{'にじボイスを使用する'}</option>
        </select>
      </div>

      <div className="mt-10">
        <div className="mb-4 text-xl font-bold">{'声の調整'}</div>
        {(() => {
          if (selectVoice === 'koeiromap') {
            return (
              <>
                <div>
                  {
                    'KoemotionのKoeiromap APIを使用しています。日本語のみに対応しています。詳しくは下記をご覧ください。'
                  }
                  <br />
                  <Link
                    url="https://koemotion.rinna.co.jp"
                    label="https://koemotion.rinna.co.jp"
                  />
                </div>
                <div className="mt-4 font-bold">API キー</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-2 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={koeiromapKey}
                    onChange={(e) =>
                      settingsStore.setState({ koeiromapKey: e.target.value })
                    }
                  />
                </div>

                <div className="mt-4 font-bold">プリセット</div>
                <div className="my-2 grid grid-cols-2 gap-[8px]">
                  <TextButton
                    onClick={() =>
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: PRESET_A.speakerX,
                          speakerY: PRESET_A.speakerY,
                        },
                      })
                    }
                  >
                    かわいい
                  </TextButton>
                  <TextButton
                    onClick={() =>
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: PRESET_B.speakerX,
                          speakerY: PRESET_B.speakerY,
                        },
                      })
                    }
                  >
                    元気
                  </TextButton>
                  <TextButton
                    onClick={() =>
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: PRESET_C.speakerX,
                          speakerY: PRESET_C.speakerY,
                        },
                      })
                    }
                  >
                    かっこいい
                  </TextButton>
                  <TextButton
                    onClick={() =>
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: PRESET_D.speakerX,
                          speakerY: PRESET_D.speakerY,
                        },
                      })
                    }
                  >
                    渋い
                  </TextButton>
                </div>
                <div className="mt-6">
                  <div className="select-none">x : {koeiroParam.speakerX}</div>
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    step={0.001}
                    value={koeiroParam.speakerX}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: Number(e.target.value),
                          speakerY: koeiroParam.speakerY,
                        },
                      })
                    }}
                  ></input>
                  <div className="select-none">y : {koeiroParam.speakerY}</div>
                  <input
                    type="range"
                    min={-10}
                    max={10}
                    step={0.001}
                    value={koeiroParam.speakerY}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        koeiroParam: {
                          speakerX: koeiroParam.speakerX,
                          speakerY: Number(e.target.value),
                        },
                      })
                    }}
                  ></input>
                </div>
              </>
            )
          } else if (selectVoice === 'voicevox') {
            return (
              <>
                <div>
                  {
                    'VOICEVOXを使用しています。日本語のみに対応しています。ローカルAPIを使用するので下記のサイトから環境にあったアプリをダウンロードし、起動しておく必要があります。'
                  }
                  <br />
                  <Link
                    url="https://voicevox.hiroshiba.jp/"
                    label="https://voicevox.hiroshiba.jp/"
                  />
                </div>
                <div className="mt-4 font-bold">{'VOICEVOX サーバーURL'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="http://localhost:50021"
                    value={voicevoxServerUrl}
                    onChange={(e) =>
                      settingsStore.setState({
                        voicevoxServerUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'ボイスタイプ選択'}</div>
                <div className="flex items-center">
                  <select
                    value={voicevoxSpeaker}
                    onChange={(e) =>
                      settingsStore.setState({
                        voicevoxSpeaker: e.target.value,
                      })
                    }
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    <option value="">{'選択してください'}</option>
                    {speakers.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.speaker}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-6 font-bold">
                  <div className="select-none">
                    {'話速'}: {voicevoxSpeed}
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={voicevoxSpeed}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        voicevoxSpeed: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'音高'}: {voicevoxPitch}
                  </div>
                  <input
                    type="range"
                    min={-0.15}
                    max={0.15}
                    step={0.01}
                    value={voicevoxPitch}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        voicevoxPitch: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'抑揚'}: {voicevoxIntonation}
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={2.0}
                    step={0.01}
                    value={voicevoxIntonation}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        voicevoxIntonation: Number(e.target.value),
                      })
                    }}
                  ></input>
                </div>
              </>
            )
          } else if (selectVoice === 'google') {
            return (
              <>
                <div>
                  {
                    'Google Cloud Text-to-Speechを使用しています。多言語に対応可能です。'
                  }
                  {
                    'APIキーまたは認証用のJSONファイルが必要です。下記から取得し、JSONファイルの場合はリポジトリのルートフォルダに credentials.json という名称で配置してください。'
                  }
                  <br />
                  <Link
                    url="https://developers.google.com/workspace/guides/create-credentials?#create_credentials_for_a_service_account"
                    label="https://developers.google.com/workspace/guides/create-credentials?#create_credentials_for_a_service_account"
                  />
                  <br />
                  <br />
                  {'言語モデルは下記のURLから選択してください。'}
                  <br />
                  <Link
                    url="https://cloud.google.com/text-to-speech/docs/voices"
                    label="https://cloud.google.com/text-to-speech/docs/voices"
                  />
                </div>
                <div className="mt-4 font-bold">{'言語選択'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={googleTtsType}
                    onChange={(e) =>
                      settingsStore.setState({ googleTtsType: e.target.value })
                    }
                  />
                </div>
              </>
            )
          } else if (selectVoice === 'stylebertvits2') {
            return (
              <>
                <div>
                  {
                    'Style-Bert-VITS2を使用しています。日・英・中のみに対応しています。ローカルAPIを使用する場合は、下記のサイトから環境にあったアプリをダウンロードし起動しておく必要があります。必要な場合はAPIキーも設定してください。'
                  }
                  <br />
                  <Link
                    url="https://github.com/litagin02/Style-Bert-VITS2"
                    label="https://github.com/litagin02/Style-Bert-VITS2"
                  />
                  <br />
                  <br />
                </div>
                <div className="mt-4 font-bold">{'サーバーURL'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={stylebertvits2ServerUrl}
                    onChange={(e) =>
                      settingsStore.setState({
                        stylebertvits2ServerUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'API キー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={stylebertvits2ApiKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        stylebertvits2ApiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'モデルID'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="number"
                    placeholder="..."
                    value={stylebertvits2ModelId}
                    onChange={(e) =>
                      settingsStore.setState({
                        stylebertvits2ModelId: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'スタイル'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={stylebertvits2Style}
                    onChange={(e) =>
                      settingsStore.setState({
                        stylebertvits2Style: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">
                  {'SDP/DP混合比'}: {stylebertvits2SdpRatio}
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.0}
                  step={0.01}
                  value={stylebertvits2SdpRatio}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      stylebertvits2SdpRatio: Number(e.target.value),
                    })
                  }}
                ></input>
                <div className="mt-4 font-bold">
                  {'話速'}: {stylebertvits2Length}
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={2.0}
                  step={0.01}
                  value={stylebertvits2Length}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      stylebertvits2Length: Number(e.target.value),
                    })
                  }}
                ></input>
              </>
            )
          } else if (selectVoice === 'aivis_speech') {
            return (
              <>
                <div>
                  {
                    'AivisSpeechを使用しています。日本語のみに対応しています。ローカルAPIを使用するので下記のサイトから環境にあったアプリをダウンロードし、起動しておく必要があります。'
                  }
                  <br />
                  <Link
                    url="https://aivis-project.com/"
                    label="https://aivis-project.com/"
                  />
                </div>
                <div className="mt-4 font-bold">
                  {'AivisSpeech サーバーURL'}
                </div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="http://localhost:10101"
                    value={aivisSpeechServerUrl}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisSpeechServerUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'話者'}</div>
                <div className="flex items-center">
                  <select
                    value={aivisSpeechSpeaker}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisSpeechSpeaker: e.target.value,
                      })
                    }
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    <option value="">{'選択してください'}</option>
                    {speakersAivis.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.speaker}
                      </option>
                    ))}
                  </select>

                  <TextButton
                    onClick={async () => {
                      const response = await fetch(
                        '/api/update-aivis-speakers?serverUrl=' +
                          aivisSpeechServerUrl
                      )
                      if (response.ok) {
                        // 話者リストを再読み込み
                        const updatedSpeakersResponse = await fetch(
                          '/speakers_aivis.json'
                        )
                        const updatedSpeakers =
                          await updatedSpeakersResponse.json()
                        // speakers_aivisを更新
                        setSpeakersAivis(updatedSpeakers)
                      }
                    }}
                    className="ml-4"
                  >
                    {'話者リストを更新'}
                  </TextButton>
                </div>
                <div className="mt-6 font-bold">
                  <div className="select-none">
                    {'話速'}: {aivisSpeechSpeed}
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={aivisSpeechSpeed}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisSpeechSpeed: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'音高'}: {aivisSpeechPitch}
                  </div>
                  <input
                    type="range"
                    min={-0.15}
                    max={0.15}
                    step={0.01}
                    value={aivisSpeechPitch}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisSpeechPitch: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'抑揚'}: {aivisSpeechIntonation}
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={2.0}
                    step={0.01}
                    value={aivisSpeechIntonation}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisSpeechIntonation: Number(e.target.value),
                      })
                    }}
                  ></input>
                </div>
              </>
            )
          } else if (selectVoice === 'aivis_cloud') {
            return (
              <>
                <div>
                  {
                    'AIVIS Cloud APIを使用しています。日本語のみに対応しています。APIキーを下記のURLから取得してください。'
                  }
                  <br />
                  <Link
                    url="https://aivis-project.com/"
                    label="https://aivis-project.com/"
                  />
                </div>
                <div className="mt-4 font-bold">{'AIVIS Cloud API キー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="password"
                    placeholder="..."
                    value={aivisCloudApiKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisCloudApiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'モデルUUID'}</div>
                <div className="flex items-center gap-2">
                  <select
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg flex-1"
                    value={aivisCloudModelUuid}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisCloudModelUuid: e.target.value,
                      })
                    }
                  >
                    <option value="">{'選択してください'}</option>
                    {aivisModels.map((model) => (
                      <option key={model.uuid} value={model.uuid}>
                        {model.name}
                        {model.creator_name && ` (${model.creator_name})`}
                      </option>
                    ))}
                  </select>
                  <TextButton
                    onClick={fetchAivisModels}
                    disabled={loadingModels}
                    className="whitespace-nowrap"
                  >
                    {loadingModels ? '読み込み中...' : 'モデル一覧を読み込む'}
                  </TextButton>
                </div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder={'または直接UUIDを入力'}
                    value={aivisCloudModelUuid}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisCloudModelUuid: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'スタイルID(オプション)'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder={'空欄でデフォルトスタイル'}
                    value={aivisCloudStyleId}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisCloudStyleId: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'スタイル名(オプション)'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder=""
                    value={aivisCloudStyleName}
                    onChange={(e) =>
                      settingsStore.setState({
                        aivisCloudStyleName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={aivisCloudUseStyleName}
                      onChange={(e) =>
                        settingsStore.setState({
                          aivisCloudUseStyleName: e.target.checked,
                        })
                      }
                    />
                    <span>{'スタイル名を使用'}</span>
                  </label>
                </div>
                <div className="mt-6 font-bold">
                  <div className="select-none">
                    {'話速'}: {aivisCloudSpeed}
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={aivisCloudSpeed}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudSpeed: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'音高'}: {aivisCloudPitch}
                  </div>
                  <input
                    type="range"
                    min={-0.15}
                    max={0.15}
                    step={0.01}
                    value={aivisCloudPitch}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudPitch: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'テンポの緩急'}: {aivisCloudTempoDynamics}
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={2.0}
                    step={0.01}
                    value={aivisCloudTempoDynamics}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudTempoDynamics: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'感情表現強さ'}: {aivisCloudIntonationScale}
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={2.0}
                    step={0.01}
                    value={aivisCloudIntonationScale}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudIntonationScale: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'音声前の無音時間'}: {aivisCloudPrePhonemeLength}
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    value={aivisCloudPrePhonemeLength}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudPrePhonemeLength: Number(e.target.value),
                      })
                    }}
                  ></input>
                  <div className="select-none">
                    {'音声後の無音時間'}: {aivisCloudPostPhonemeLength}
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    value={aivisCloudPostPhonemeLength}
                    className="mt-2 mb-4 input-range"
                    onChange={(e) => {
                      settingsStore.setState({
                        aivisCloudPostPhonemeLength: Number(e.target.value),
                      })
                    }}
                  ></input>
                </div>
              </>
            )
          } else if (selectVoice === 'gsvitts') {
            return (
              <>
                <div>{'GSVI TTS設定'}</div>
                <div className="mt-4 font-bold">{'GSVI TTSサーバーのURL'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={gsviTtsServerUrl}
                    onChange={(e) =>
                      settingsStore.setState({
                        gsviTtsServerUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'GSVI TTS モデルID'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={gsviTtsModelId}
                    onChange={(e) =>
                      settingsStore.setState({ gsviTtsModelId: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">
                  {
                    'GSVI TTS バッチサイズ (1 ~ 100 数値が大きいほど推論速度は速くなりますが、大きすぎるとメモリを使い果たす可能性があります)'
                  }
                </div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="number"
                    step="1"
                    placeholder="..."
                    value={gsviTtsBatchSize}
                    onChange={(e) =>
                      settingsStore.setState({
                        gsviTtsBatchSize: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">
                  {'話速 (0.5 ~ 2.0 数値が大きいほど速い)'}
                </div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="number"
                    step="0.1"
                    placeholder="..."
                    value={gsviTtsSpeechRate}
                    onChange={(e) =>
                      settingsStore.setState({
                        gsviTtsSpeechRate: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )
          } else if (selectVoice === 'elevenlabs') {
            return (
              <>
                <div>
                  {
                    'ElevenLabs APIを使用しています。多言語に対応可能です。APIキーを下記のURLから取得してください。'
                  }
                  <br />
                  <Link
                    url="https://elevenlabs.io/api"
                    label="https://elevenlabs.io/api"
                  />
                  <br />
                </div>
                <div className="mt-4 font-bold">{'ElevenLabs APIキー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={elevenlabsApiKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        elevenlabsApiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'ElevenLabs ボイスID'}</div>
                <div className="mt-2">
                  {'ボイスIDは下記のURLから選択してください。'}
                  <br />
                  <Link
                    url="https://api.elevenlabs.io/v1/voices"
                    label="https://api.elevenlabs.io/v1/voices"
                  />
                  <br />
                </div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={elevenlabsVoiceId}
                    onChange={(e) =>
                      settingsStore.setState({
                        elevenlabsVoiceId: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )
          } else if (selectVoice === 'openai') {
            return (
              <>
                <div>
                  {
                    'OpenAIを使用しています。多言語に対応可能です。AIサービスでOpenAIを選択している場合は下記のAPIキーを設定する必要はありません。'
                  }
                </div>
                <div className="mt-4 font-bold">{'OpenAI API キー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={openaiAPIKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        openaiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'ボイスタイプ'}</div>
                <div className="mt-2">
                  <select
                    value={openaiTTSVoice}
                    onChange={(e) =>
                      settingsStore.setState({
                        openaiTTSVoice: e.target.value as OpenAITTSVoice,
                      })
                    }
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    <option value="alloy">alloy</option>
                    <option value="ash">ash</option>
                    <option value="ballad">ballad</option>
                    <option value="coral">coral</option>
                    <option value="echo">echo</option>
                    <option value="fable">fable</option>
                    <option value="onyx">onyx</option>
                    <option value="nova">nova</option>
                    <option value="sage">sage</option>
                    <option value="shimmer">shimmer</option>
                  </select>
                </div>
                <div className="mt-4 font-bold">{'モデル'}</div>
                <div className="mt-2">
                  <select
                    value={openaiTTSModel}
                    onChange={(e) =>
                      settingsStore.setState({
                        openaiTTSModel: e.target.value as OpenAITTSModel,
                      })
                    }
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    {getOpenAITTSModels().map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 font-bold">
                  {'話速'}: {openaiTTSSpeed}
                </div>
                <input
                  type="range"
                  min={0.25}
                  max={4.0}
                  step={0.01}
                  value={openaiTTSSpeed}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      openaiTTSSpeed: Number(e.target.value),
                    })
                  }}
                />
              </>
            )
          } else if (selectVoice === 'azure') {
            return (
              <>
                <div>
                  {'Azure OpenAIを使用しています。多言語に対応可能です。'}
                </div>
                <div className="mt-4 font-bold">{'Azure OpenAI API キー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={azureTTSKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        azureTTSKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'Azure Endpoint'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={azureTTSEndpoint}
                    onChange={(e) =>
                      settingsStore.setState({
                        azureTTSEndpoint: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'ボイスタイプ'}</div>
                <div className="mt-2">
                  <select
                    value={openaiTTSVoice}
                    onChange={(e) =>
                      settingsStore.setState({
                        openaiTTSVoice: e.target.value as OpenAITTSVoice,
                      })
                    }
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    <option value="alloy">alloy</option>
                    <option value="echo">echo</option>
                    <option value="fable">fable</option>
                    <option value="onyx">onyx</option>
                    <option value="nova">nova</option>
                    <option value="shimmer">shimmer</option>
                  </select>
                </div>
                <div className="mt-4 font-bold">{'モデル'}</div>
                <div className="mt-4 font-bold">
                  {'話速'}: {openaiTTSSpeed}
                </div>
                <input
                  type="range"
                  min={0.25}
                  max={4.0}
                  step={0.01}
                  value={openaiTTSSpeed}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      openaiTTSSpeed: Number(e.target.value),
                    })
                  }}
                />
              </>
            )
          } else if (selectVoice === 'nijivoice') {
            return (
              <>
                <div>
                  {
                    'にじボイス APIを使用しています。日本語のみに対応しています。APIキーを下記のURLから取得してください。'
                  }
                </div>
                <Link
                  url="https://app.nijivoice.com/"
                  label="https://app.nijivoice.com/"
                />
                <div className="mt-4 font-bold">{'にじボイス API キー'}</div>
                <div className="mt-2">
                  <input
                    className="text-ellipsis px-4 py-2 w-col-span-4 bg-white hover:bg-white-hover rounded-lg"
                    type="text"
                    placeholder="..."
                    value={nijivoiceApiKey}
                    onChange={(e) =>
                      settingsStore.setState({
                        nijivoiceApiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mt-4 font-bold">{'話者ID'}</div>
                <div className="mt-2">
                  <select
                    value={nijivoiceActorId}
                    onChange={(e) => {
                      settingsStore.setState({
                        nijivoiceActorId: e.target.value,
                      })
                    }}
                    className="px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
                  >
                    <option value="">{'選択してください'}</option>
                    {nijivoiceSpeakers.map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 font-bold">
                  {'話速'}: {nijivoiceSpeed}
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={3.0}
                  step={0.1}
                  value={nijivoiceSpeed}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      nijivoiceSpeed: Number(e.target.value),
                    })
                  }}
                />
                <div className="mt-4 font-bold">
                  {'感情レベル'}: {nijivoiceEmotionalLevel}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1.5}
                  step={0.1}
                  value={nijivoiceEmotionalLevel}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      nijivoiceEmotionalLevel: Number(e.target.value),
                    })
                  }}
                />
                <div className="mt-4 font-bold">
                  {'音声の長さ'}: {nijivoiceSoundDuration}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1.7}
                  step={0.1}
                  value={nijivoiceSoundDuration}
                  className="mt-2 mb-4 input-range"
                  onChange={(e) => {
                    settingsStore.setState({
                      nijivoiceSoundDuration: Number(e.target.value),
                    })
                  }}
                />
              </>
            )
          }
        })()}
      </div>

      {/* カスタムテキスト入力と統合テストボタン */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4 text-xl font-bold">{'ボイステスト'}</div>
        <div className="flex items-center">
          <input
            className="flex-1 px-4 py-2 bg-white hover:bg-white-hover rounded-lg"
            type="text"
            placeholder={'試聴したいテキストを入力してください'}
            value={customVoiceText}
            onChange={(e) => setCustomVoiceText(e.target.value)}
          />
        </div>
        <div className="flex items-center mt-4">
          <TextButton
            onClick={() => testVoice(selectVoice, customVoiceText)}
            disabled={!customVoiceText}
          >
            {'再生する'}
          </TextButton>
        </div>
      </div>
    </div>
  )
}
export default Voice
