import React, { useState } from 'react'
import settingsStore from '@/features/stores/settings'
import { speakCharacter } from '@/features/messages/speakCharacter'
import homeStore from '@/features/stores/home'
import { Talk } from '@/features/messages/messages'
import { generateMessageId } from '@/utils/messageUtils'

type QuestionItem = {
  questionNumber: number
  isCorrect: boolean
  explanation?: string
}

const TestAnswerUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isExplaining, setIsExplaining] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState<string | null>(
    null
  )
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    analysis?: {
      incorrectAnswers: number
      totalAnswers: number
      proficiencyScore: number
      details?: string
      questionList?: QuestionItem[]
      weakAreas?: string[]
      recommendedStudyTopics?: string[]
    }
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/analyze-test-answer', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult({
          success: true,
          message: '分析完了',
          analysis: result.analysis,
        })
      } else {
        setUploadResult({
          success: false,
          message: result.error || 'アップロード失敗',
        })
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'アップロード失敗',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mb-8 p-4 bg-white bg-opacity-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">{'テスト答案アップロード'}</h3>
      <p className="mb-4 text-sm text-gray-600">
        {
          'テスト答案をアップロードして理解度と習熟度を分析します。システムはOCRを使用して不正解の箇所を特定し、詳細な分析を提供します。'
        }
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {'テスト答案ファイルを選択'}
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
          !file || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark'
        }`}
      >
        {isUploading ? 'アップロード中...' : 'アップロードして分析'}
      </button>

      {uploadResult && (
        <div
          className={`mt-4 p-4 rounded-md ${
            uploadResult.success ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <p
            className={`font-medium ${
              uploadResult.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {uploadResult.message}
          </p>
          {uploadResult.success && uploadResult.analysis && (
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                {'不正解数'}: {uploadResult.analysis.incorrectAnswers} /{' '}
                {uploadResult.analysis.totalAnswers}
              </p>
              <p className="text-sm text-gray-700">
                {'習熟度スコア'}:{' '}
                {uploadResult.analysis.proficiencyScore.toFixed(1)}%
              </p>

              {/* 問題リスト */}
              {uploadResult.analysis.questionList &&
                uploadResult.analysis.questionList.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-2">問題リスト:</h4>
                    <div className="max-h-60 overflow-y-auto bg-white rounded p-2">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1 px-2">問題番号</th>
                            <th className="text-left py-1 px-2">結果</th>
                            <th className="text-left py-1 px-2">説明</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResult.analysis.questionList.map(
                            (question) => (
                              <tr
                                key={question.questionNumber}
                                className="border-b"
                              >
                                <td className="py-1 px-2">
                                  {question.questionNumber}
                                </td>
                                <td className="py-1 px-2">
                                  <span
                                    className={
                                      question.isCorrect
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }
                                  >
                                    {question.isCorrect ? '正解' : '不正解'}
                                  </span>
                                </td>
                                <td className="py-1 px-2">
                                  {question.explanation ? (
                                    <div className="flex items-center">
                                      <span className="mr-2 text-xs">
                                        {question.isCorrect
                                          ? question.explanation?.substring(
                                              0,
                                              20
                                            ) + '...'
                                          : '不正解の理由と解説があります'}
                                      </span>
                                      <button
                                        onClick={() => handleExplain(question)}
                                        disabled={isExplaining}
                                        className={`px-2 py-1 text-xs rounded ${
                                          isExplaining
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : question.isCorrect
                                              ? 'bg-green-500 hover:bg-green-600 text-white'
                                              : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                      >
                                        {'解説'}
                                      </button>
                                    </div>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* 弱点領域 */}
              {uploadResult.analysis.weakAreas &&
                uploadResult.analysis.weakAreas.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-1">弱点領域:</h4>
                    <ul className="list-disc list-inside bg-white rounded p-2 text-sm">
                      {uploadResult.analysis.weakAreas.map((area, index) => (
                        <li key={index} className="py-1">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* 推奨学習トピック */}
              {uploadResult.analysis.recommendedStudyTopics &&
                uploadResult.analysis.recommendedStudyTopics.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-1">
                      推奨学習トピック:
                    </h4>
                    <ul className="list-disc list-inside bg-white rounded p-2 text-sm">
                      {uploadResult.analysis.recommendedStudyTopics.map(
                        (topic, index) => (
                          <li key={index} className="py-1">
                            {topic}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* 詳細分析 */}
              {uploadResult.analysis.details && (
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-1">詳細分析:</h4>
                  <div className="mt-1 p-2 bg-white rounded text-sm text-gray-700">
                    <p className="whitespace-pre-line">
                      {uploadResult.analysis.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 解説モーダル */}
      {currentExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">{'AIアバター解説'}</h3>
            <div className="whitespace-pre-line mb-4">
              <div className="bg-gray-100 p-3 rounded-lg mb-3 border-l-4 border-blue-500">
                <p className="font-medium text-blue-800 mb-1">{'解説:'}</p>
                <p>{currentExplanation}</p>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>
                  ※
                  AIアバターが解説を読み上げています。聞き取りにくい場合は上記のテキストをご参照ください。
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentExplanation(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
              >
                {'閉じる'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // 解説ボタンがクリックされたときの処理
  function handleExplain(question: QuestionItem) {
    if (!question.explanation) return

    setIsExplaining(true)
    setCurrentExplanation(question.explanation)

    // アバターに解説を読み上げさせる
    const sessionId = generateMessageId()

    // 不正解の場合は「悲しい」表情で説明し、正解の場合は「嬉しい」表情で説明
    const emotion = question.isCorrect ? 'happy' : 'sad'

    // 解説メッセージを作成
    let message = `問題${question.questionNumber}の解説です。`

    // 不正解の場合は特別なメッセージを追加
    if (!question.isCorrect) {
      message += 'この問題は不正解でした。' + question.explanation
    } else {
      message += question.explanation
    }

    const talk: Talk = {
      message: message,
      emotion: emotion,
    }

    // メッセージをチャットログに追加
    homeStore.getState().upsertMessage({
      role: 'assistant',
      content: talk.message,
    })

    // アバターに読み上げさせる
    speakCharacter(
      sessionId,
      talk,
      () => {
        homeStore.setState({ isSpeaking: true })
      },
      () => {
        homeStore.setState({ isSpeaking: false })
        setIsExplaining(false)
      }
    )
  }
}

export default TestAnswerUpload
