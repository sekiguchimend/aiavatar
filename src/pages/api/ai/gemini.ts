import { NextRequest } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { Message } from '@/features/messages/messages'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method Not Allowed',
        errorCode: 'METHOD_NOT_ALLOWED',
      }),
      {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  const { messages } = await req.json()

  // APIキーの取得
  const apiKey =
    process.env.GOOGLE_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_KEY ||
    ''

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'Google API Key is required',
        errorCode: 'EmptyAPIKey',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const google = createGoogleGenerativeAI({ apiKey })

    const result = await streamText({
      model: google('gemini-2.0-flash-exp'),
      messages: messages as any[],
      temperature: 1.0,
      maxTokens: 4096,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in Gemini API call:', error)

    return new Response(
      JSON.stringify({
        error: 'Gemini API Error',
        errorCode: 'AIAPIError',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
