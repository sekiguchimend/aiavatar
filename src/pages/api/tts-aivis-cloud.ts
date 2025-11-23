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

    console.log(
      'AIVIS Cloud TTS Request:',
      JSON.stringify(requestBody, null, 2)
    )

    // 再試行ロジック（最大3回）
    let lastError: any
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            Accept: 'audio/wav',
          },
          responseType: 'arraybuffer',
          timeout: 10000, // 10秒に短縮（元は30秒）
        })

        res.setHeader('Content-Type', 'audio/wav')
        return res.send(response.data)
      } catch (err) {
        lastError = err
        if (axios.isAxiosError(err) && err.response?.status === 503 && attempt < 3) {
          console.log(`AIVIS Cloud 503 error, retrying... (attempt ${attempt + 1}/3)`)
          // 再試行間隔を短縮（500ms, 1000ms）
          await new Promise(resolve => setTimeout(resolve, 500 * attempt))
          continue
        }
        throw err
      }
    }
  } catch (error) {
    console.error('Error in AIVIS Cloud TTS:', error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Response data (raw):', error.response.data)
        // バッファをデコード
        if (Buffer.isBuffer(error.response.data)) {
          const decoded = error.response.data.toString('utf-8')
          console.error('Response data (decoded):', decoded)
        }
        console.error('Response status:', error.response.status)
        console.error('Response headers:', error.response.headers)
      } else if (error.request) {
        console.error('No response received:', error.request)
      }
      console.error('Error config:', error.config)

      // エラーの詳細をクライアントに返す
      let errorMessage = 'Failed to generate speech with AIVIS Cloud API'
      let statusCode = 500

      if (error.response) {
        statusCode = error.response.status
        if (error.response.status === 404) {
          errorMessage =
            'Model or style not found. Please check your Model UUID and Style settings.'
        } else if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          errorMessage = 'Invalid API key. Please check your AIVIS Cloud API Key.'
        } else if (error.response.data) {
          try {
            let dataString = ''
            if (Buffer.isBuffer(error.response.data)) {
              dataString = error.response.data.toString('utf-8')
            } else {
              dataString = error.response.data.toString()
            }
            const errorData = JSON.parse(dataString)
            if (errorData.detail) {
              errorMessage = `AIVIS Cloud API error: ${errorData.detail}`
            }
          } catch (e) {
            console.error('Failed to parse error response:', e)
          }
        }
      } else if (error.request) {
        errorMessage = 'No response from AIVIS Cloud API. Please check your network connection.'
      } else {
        errorMessage = `Request setup error: ${error.message}`
      }

      return res.status(statusCode).json({ error: errorMessage })
    }
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
