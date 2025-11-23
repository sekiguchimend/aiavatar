import Image from 'next/image'

import AdvancedSettings from './advancedSettings'
import MessageReceiverSetting from './messageReceiver'
import PresetQuestions from './presetQuestions'
import TestAnswerUpload from './testAnswerUpload'

const Other = () => {
  return (
    <>
      <div className="flex items-center mb-6">
        <Image
          src="/images/setting-icons/other-settings.svg"
          alt="Other Settings"
          width={24}
          height={24}
          className="mr-2"
        />
        <h2 className="text-2xl font-bold">{'その他'}</h2>
      </div>

      <AdvancedSettings />
      <PresetQuestions />
      <MessageReceiverSetting />
      <TestAnswerUpload />
    </>
  )
}
export default Other
