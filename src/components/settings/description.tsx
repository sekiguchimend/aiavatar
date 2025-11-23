import Image from 'next/image'

const Description = () => {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Image
            src="/images/setting-icons/description.svg"
            alt="Description Settings"
            width={24}
            height={24}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold">
            {'このアプリケーションについて'}
          </h2>
        </div>
        <div className="mb-6">
          <div className="my-2 whitespace-pre-line">
            このアプリケーションについて
            アバターデモでは、WebブラウザだけでAIキャラクターとの会話を楽しめます。キャラクターの変更や性格設定、音声調整は各設定項目を確認してください。
          </div>
        </div>
        <div className="my-10">
          <div className="mb-4 text-xl font-bold">{'お問い合わせ'}</div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="mailto:taichi.taniguchi@queue-tech.jp"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              Email: taichi.taniguchi@queue-tech.jp
            </a>
          </div>
        </div>
        <div className="mt-10">
          <div className="mb-4 text-xl font-bold">{'作成者情報'}</div>
          <div className="my-2 whitespace-pre-line">作成者: ジョン</div>
        </div>
      </div>
    </>
  )
}
export default Description
