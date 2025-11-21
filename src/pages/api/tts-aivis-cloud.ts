import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = {
  audio?: ArrayBuffer
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    text,
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
  } = req.body

  const apiUrl = 'https://api.aivis-project.com/v1/tts/synthesize'

  // 必須パラメータのバリデーション
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' })
  }

  if (!modelUuid) {
    return res
      .status(400)
      .json({ error: 'Model UUID is required. Please set it in settings.' })
  }

  try {
    // リクエストボディを構築
    const requestBody: any = {
      text,
      model_uuid: modelUuid,
      speed_scale: speed,
      pitch_scale: pitch,
      tempo_dynamics_scale: tempoDynamics,
      intonation_scale: intonationScale,
      pre_phoneme_length: prePhonemeLength,
      post_phoneme_length: postPhonemeLength,
    }

    // スタイルの指定方法を選択
    // style_name が優先、その次に style_id (0以外)
    if (useStyleName && styleName) {
      requestBody.style_name = styleName
    } else if (styleId && styleId !== '0' && styleId !== '') {
      requestBody.style_id = parseInt(styleId)
    }
    // スタイルを指定しない場合は、requestBodyにフィールドを追加しない
    // （APIがデフォルトスタイルを使用する）

    console.log('AIVIS Cloud TTS Request:', JSON.stringify(requestBody, null, 2))

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        Accept: 'audio/wav',
      },
      responseType: 'arraybuffer',
      timeout: 30000,
    })

    res.setHeader('Content-Type', 'audio/wav')
    res.send(response.data)
  } catch (error) {
    console.error('Error in AIVIS Cloud TTS:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      
      // エラーの詳細をクライアントに返す
      let errorMessage = 'Failed to generate speech with AIVIS Cloud API'
      if (error.response.status === 404) {
        errorMessage = 'Model or style not found. Please check your Model UUID and Style settings.'
      } else if (error.response.status === 401 || error.response.status === 403) {
        errorMessage = 'Invalid API key. Please check your AIVIS Cloud API Key.'
      } else if (error.response.data) {
        try {
          const errorData = JSON.parse(error.response.data.toString())
          if (errorData.detail) {
            errorMessage = `AIVIS Cloud API error: ${errorData.detail}`
          }
        } catch (e) {
          // データのパースに失敗した場合は元のメッセージを使用
        }
      }
      
      return res.status(error.response.status).json({ error: errorMessage })
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
