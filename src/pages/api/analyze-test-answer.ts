import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
}

type AnalysisResult = {
  incorrectAnswers: number
  totalAnswers: number
  proficiencyScore: number
  details: string
  questionList: {
    questionNumber: number
    isCorrect: boolean
    explanation?: string
  }[]
  weakAreas: string[]
  recommendedStudyTopics: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Create form parser with proper configuration
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    multiples: true,
  })

  try {
    // Parse the form
    const [fields, files] = await new Promise<
      [formidable.Fields<string>, formidable.Files<string>]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    // Get the uploaded file
    const fileArray = files.file
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray

    // Check file type
    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
    const extension = path.extname(file.originalFilename || '').toLowerCase()
    if (!validExtensions.includes(extension)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: '画像（JPG、PNG）またはPDFファイルのみアップロード可能です',
      })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath)

    // Log file info for debugging
    console.log(
      `処理ファイル: ${file.originalFilename}, サイズ: ${fileBuffer.length} バイト, タイプ: ${extension}`
    )

    // Convert to base64
    const base64Image = fileBuffer.toString('base64')

    // Set proper MIME type
    const mimeType =
      extension === '.pdf'
        ? 'application/pdf'
        : `image/${extension.substring(1)}`
    console.log(`MIMEタイプ: ${mimeType}`)

    // Initialize Gemini API
    const apiKey =
      process.env.GEMINI_API_KEY || 'AIzaSyDquv5JsikJVqweEAOtMxEt5oTEtI4IMmc' // Use the provided API key
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) // Using the model that's already set

    // Prepare the prompt for analysis in Japanese
    const prompt = `
    あなたは教育評価の専門家です。このテスト答案シートを分析してください。

    1. シート上のすべての回答を特定してください
    2. 不正解の回答を判断してください
    3. 問題の総数と不正解の数を計算してください
    4. 習熟度スコア（正解率のパーセンテージ）を計算してください
    5. 各問題の正誤と、可能であれば問題番号を特定してください
    6. 不正解の問題については、なぜその回答が間違っているのか、正しい考え方や解法を含めた詳細な説明を提供してください
    7. 誤りのパターンに基づいて、学生の理解度の詳細な分析を提供してください
    8. 弱点領域を特定してください
    9. 改善のための学習トピックを推奨してください
    
    以下の構造のJSONオブジェクトとして回答を整形してください:
    {
      "incorrectAnswers": 不正解数（数値）,
      "totalAnswers": 総問題数（数値）,
      "proficiencyScore": 習熟度スコア（数値、0-100）,
      "details": "詳細な分析テキスト（日本語）",
      "questionList": [
        {
          "questionNumber": 問題番号（数値）,
          "isCorrect": 正解かどうか（真偽値）,
          "explanation": "この問題に関する説明（不正解の場合は、なぜ間違っているのか、正しい考え方や解法を詳しく説明してください。日本語）"
        },
        ...
      ],
      "weakAreas": ["弱点領域1", "弱点領域2", ...],
      "recommendedStudyTopics": ["推奨学習トピック1", "推奨学習トピック2", ...]
    }
    
    JSONオブジェクトのみを返してください。それ以外は何も返さないでください。
    `

    try {
      // Call Gemini API for analysis
      console.log('Gemini APIにリクエスト送信中...')

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType, data: base64Image } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096, // 増やして詳細な分析を可能に
        },
      })

      const response = result.response
      const text = response.text()

      // For debugging
      console.log('Gemini APIからの応答を受信しました')
      console.log('応答プレビュー:', text.substring(0, 200) + '...')

      // Parse the JSON response
      try {
        // Extract JSON from the response (in case there's any extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          // If no JSON found, create a default response
          return res.status(200).json({
            success: true,
            analysis: {
              incorrectAnswers: 0,
              totalAnswers: 0,
              proficiencyScore: 0,
              details:
                '画像を適切に分析できませんでした。画像が鮮明で、テスト回答が見えることを確認してください。',
              questionList: [],
              weakAreas: [],
              recommendedStudyTopics: [],
            },
          })
        }

        const jsonStr = jsonMatch[0]
        const analysis = JSON.parse(jsonStr) as AnalysisResult

        return res.status(200).json({
          success: true,
          analysis,
        })
      } catch (parseError) {
        console.error('Gemini応答の解析エラー:', parseError)
        // Return a default response instead of an error
        return res.status(200).json({
          success: true,
          analysis: {
            incorrectAnswers: 0,
            totalAnswers: 0,
            proficiencyScore: 0,
            details:
              '画像の分析中にエラーが発生しました。応答形式が予期しないものでした。',
            questionList: [],
            weakAreas: [],
            recommendedStudyTopics: [],
          },
        })
      }
    } catch (aiError: any) {
      console.error('Gemini APIエラー:', aiError)
      console.error('エラー詳細:', aiError.message)

      // Check for specific error types
      if (aiError.message && aiError.message.includes('RESOURCE_EXHAUSTED')) {
        return res.status(200).json({
          success: true,
          analysis: {
            incorrectAnswers: 0,
            totalAnswers: 0,
            proficiencyScore: 0,
            details:
              'ファイルが大きすぎるか、AIサービスが処理するには複雑すぎます。より小さいか単純なファイルを試してください。',
            questionList: [],
            weakAreas: [],
            recommendedStudyTopics: [],
          },
        })
      }

      if (aiError.message && aiError.message.includes('INVALID_ARGUMENT')) {
        return res.status(200).json({
          success: true,
          analysis: {
            incorrectAnswers: 0,
            totalAnswers: 0,
            proficiencyScore: 0,
            details:
              'ファイル形式を正しく処理できませんでした。鮮明で適切にフォーマットされたPDFまたは画像ファイルをアップロードしていることを確認してください。',
            questionList: [],
            weakAreas: [],
            recommendedStudyTopics: [],
          },
        })
      }

      return res.status(200).json({
        success: true,
        analysis: {
          incorrectAnswers: 0,
          totalAnswers: 0,
          proficiencyScore: 0,
          details:
            'AIサービスへの接続中にエラーが発生しました。後でもう一度お試しください。',
          questionList: [],
          weakAreas: [],
          recommendedStudyTopics: [],
        },
      })
    }
  } catch (error: any) {
    console.error('テスト回答の処理エラー:', error)
    console.error(
      'エラー詳細:',
      error.message || '詳細なメッセージはありません'
    )

    // Return a more specific error message based on the error type
    let errorMessage =
      'ファイルの処理中にエラーが発生しました。別のファイルで再試行してください。'

    if (error.message && error.message.includes('maxFileSize')) {
      errorMessage =
        'アップロードされたファイルが最大許容サイズ（10MB）を超えています。より小さいファイルをアップロードしてください。'
    } else if (error.message && error.message.includes('parse')) {
      errorMessage =
        'アップロードされたファイルの解析中にエラーが発生しました。ファイルが破損していないことを確認してください。'
    }

    return res.status(200).json({
      success: true,
      analysis: {
        incorrectAnswers: 0,
        totalAnswers: 0,
        proficiencyScore: 0,
        details: errorMessage,
        questionList: [],
        weakAreas: [],
        recommendedStudyTopics: [],
      },
    })
  }
}
