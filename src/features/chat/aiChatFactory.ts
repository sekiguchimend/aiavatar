import { Message } from '@/features/messages/messages'
import { messageSelectors } from '@/features/messages/messageSelectors'
import settingsStore from '@/features/stores/settings'

export async function getAIChatResponseStream(
  messages: Message[]
): Promise<ReadableStream<string> | null> {
  const ss = settingsStore.getState()

  // メッセージを処理
  const processedMessages = messageSelectors.getProcessedMessages(
    messages,
    ss.includeTimestampInUserMessage
  )

  try {
    const response = await fetch('/api/ai/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: processedMessages,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'API request failed')
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    // データストリームをテキストストリームに変換
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('0:')) {
                const text = line.slice(2).replace(/^"|"$/g, '')
                if (text) {
                  controller.enqueue(text)
                }
              }
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })
  } catch (error) {
    console.error('Error in getAIChatResponseStream:', error)
    throw error
  }
}
