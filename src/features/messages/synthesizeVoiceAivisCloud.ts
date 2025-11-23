import { Talk } from './messages'

export async function synthesizeVoiceAivisCloudApi(
  talk: Talk,
  apiKey: string,
  modelUuid: string,
  styleId: string,
  styleName: string,
  useStyleName: boolean,
  speed: number,
  pitch: number,
  tempoDynamics: number,
  intonationScale: number,
  prePhonemeLength: number,
  postPhonemeLength: number
): Promise<ArrayBuffer> {
  try {
    const res = await fetch('/api/tts-aivis-cloud', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: talk.message,
        apiKey,
        modelUuid,
        styleId,
        styleName,
        useStyleName,
        speed,
        pitch,
        tempoDynamics,
        intonationScale,
        prePhonemeLength,
        postPhonemeLength,
      }),
    })

    if (!res.ok) {
      throw new Error(
        `AIVIS Cloud APIからの応答が異常です。ステータスコード: ${res.status}`
      )
    }

    return await res.arrayBuffer()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AIVIS Cloud APIでエラーが発生しました: ${error.message}`)
    } else {
      throw new Error('AIVIS Cloud APIで不明なエラーが発生しました')
    }
  }
}
