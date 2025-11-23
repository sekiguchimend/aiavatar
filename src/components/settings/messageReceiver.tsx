import React, { useCallback, useEffect } from 'react'
import Image from 'next/image'
import settingsStore from '@/features/stores/settings'
import { TextButton } from '../textButton'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

const MessageReceiverSetting = () => {
  const { messageReceiverEnabled, clientId } = settingsStore()

  const generateClientId = useCallback(() => {
    if (!clientId) {
      const newClientId = uuidv4()
      settingsStore.setState({ clientId: newClientId })
    }
  }, [clientId])

  useEffect(() => {
    if (messageReceiverEnabled && !clientId) {
      generateClientId()
    }
  }, [messageReceiverEnabled, clientId, generateClientId])

  const toggleMessageReceiver = () => {
    const newState = !messageReceiverEnabled
    settingsStore.setState({ messageReceiverEnabled: newState })
    if (newState && !clientId) {
      generateClientId()
    }
  }

  return (
    <div className="mt-2 mb-2">
      <div className="my-4 text-xl font-bold">
        {'外部からの指示を受け付ける'}
      </div>
      <p className="">
        {'APIを利用してAIキャラの発言を外部から指示することができます。'}
      </p>
      <div className="my-2">
        <TextButton onClick={toggleMessageReceiver}>
          {messageReceiverEnabled ? '状態:ON' : '状態:OFF'}
        </TextButton>
      </div>
      {messageReceiverEnabled && clientId && (
        <>
          <div className="mt-4">
            <div className="font-bold">{'Client ID'}</div>
            <div className="bg-gray-100 p-2 rounded">{clientId}</div>
          </div>
          <div className="mt-4">
            <Link href={`/send-message`} passHref legacyBehavior>
              <a
                target="_blank" // 新しいタブで開く
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm bg-primary hover:bg-primary-hover rounded-3xl text-white font-bold transition-colors duration-200 whitespace-nowrap"
              >
                {'メッセージ送信ページを開く'}
                <Image
                  src="/images/icons/external-link.svg"
                  alt="open in new tab"
                  width={16}
                  height={16}
                  className="ml-1"
                />
              </a>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default MessageReceiverSetting
