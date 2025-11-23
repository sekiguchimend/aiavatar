import { useEffect, useState } from 'react'

import homeStore from '@/features/stores/home'
import { IconButton } from './iconButton'
import { Link } from './link'

export const Introduction = () => {
  const showIntroduction = homeStore((s) => s.showIntroduction)

  const [displayIntroduction, setDisplayIntroduction] = useState(false)
  const [opened, setOpened] = useState(true)

  useEffect(() => {
    setDisplayIntroduction(homeStore.getState().showIntroduction)
  }, [showIntroduction])

  return displayIntroduction && opened ? (
    <div className="absolute z-40 w-full h-full px-6 py-10 bg-black/30 font-M_PLUS_2">
      <div className="relative mx-auto my-auto max-w-3xl max-h-full p-6 overflow-y-auto bg-white rounded-2xl">
        <div className="sticky top-0 right-0 z-10 flex justify-end">
          <IconButton
            iconName="24/Close"
            isProcessing={false}
            onClick={() => {
              setOpened(false)
            }}
            className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white"
          ></IconButton>
        </div>
        <div className="mb-6">
          <div className="mb-2 font-bold text-xl text-secondary ">
            このアプリケーションについて
          </div>
          <div>
            アバターデモでは、WebブラウザだけでAIキャラクターとの会話を楽しめます。キャラクターの変更や性格設定、音声調整は各設定項目を確認してください。
          </div>
        </div>
        <div className="my-6">
          <div className="my-2 font-bold text-xl text-secondary">技術紹介</div>
          <div>
            このアプリはpixiv社の<b>ChatVRM</b>
            を改造して作成されています。元のソースコードは
            <Link url={'https://github.com/pixiv/ChatVRM'} label="こちら" />
            をご覧ください。
          </div>
          <div className="my-4">
            3Dモデルの表示や操作には
            <Link
              url={'https://github.com/pixiv/three-vrm'}
              label={'@pixiv/three-vrm'}
            />
            、 会話文生成には
            <Link
              url={
                'https://openai.com/blog/introducing-chatgpt-and-whisper-apis'
              }
              label={'OpenAI API'}
            />
            などの各種LLM、 音声合成には
            <Link
              url={
                'https://developers.rinna.co.jp/product/#product=koeiromap-free'
              }
              label={'Koemotion'}
            />
            などの各種TTSを使用しています。 詳細はこちらの
            <Link
              url={'https://note.com/nike_cha_n/n/ne98acb25e00f'}
              label="解説記事"
            />
            をご覧ください。
          </div>
          <div className="my-4">
            このアプリのソースコードはGitHubで公開しています。自由に変更や改変可能です。
          </div>
          <div className="my-4">
            商用利用に関しては、同リポジトリのREADMEをご覧ください。
          </div>
        </div>

        <div className="my-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showIntroduction}
              onChange={(e) => {
                homeStore.setState({
                  showIntroduction: e.target.checked,
                })
              }}
              className="mr-2"
            />
            <span>次回からこのダイアログを表示しない</span>
          </label>
        </div>

        <div className="my-6">
          <button
            onClick={() => {
              setOpened(false)
            }}
            className="font-bold bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled text-white px-6 py-2 rounded-full"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  ) : null
}
