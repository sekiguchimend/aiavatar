---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Queue株式会社'
  text: 'AIキャラクターとの対話・YouTube配信を簡単に実現'
  tagline: 'オープンソースのAIキャラクターアプリケーション構築キット'
  image:
    src: /logo.png
    alt: Queue株式会社
  actions:
    - theme: brand
      text: はじめに
      link: /guide/introduction
    - theme: brand
      text: クイックスタート
      link: /guide/quickstart

features:
  - icon: 🤖
    title: AIキャラとの対話
    details: 各種LLMのAPIキーを使って、AIキャラクターと簡単に会話できます。マルチモーダル対応で、画像認識も可能です。
    link: /guide/ai/common
  - icon: 📺
    title: YouTube配信
    details: YouTubeの配信コメントを取得して、AIキャラクターが自動で応答。会話継続モードでコメントがなくても自発的に発言できます。
    link: /guide/youtube-settings
  - icon: 🎤
    title: 多彩な音声合成
    details: VOICEVOX、Koeiromap、Google Text-to-Speech、ElevenLabsなど、様々な音声合成エンジンに対応しています。
    link: /guide/voice-settings
  - icon: 🎭
    title: VRM/Live2Dサポート
    details: 3DモデルのVRMファイルと2DモデルのLive2Dファイルの両方に対応。お好みのキャラクターを使用できます。
    link: /guide/character/common
  - icon: 🔄
    title: 外部連携モード
    details: WebSocketでサーバーアプリと連携し、より高度な機能を実現できます。
    link: /guide/ai/external-linkage
  - icon: 📊
    title: スライドモード
    details: AIキャラクターがスライドを自動で発表するモードを搭載。プレゼンテーションも任せられます。
    link: /guide/slide-settings
---

<div class="custom-block warning">
  <p><strong>セキュリティに関する重要な注意事項</strong>: このリポジトリは、個人利用やローカル環境での開発はもちろん、適切なセキュリティ対策を施した上での商用利用も想定しています。Web環境にデプロイする際は、APIキーの適切な管理が必要です。</p>
</div>

<div class="custom-block info">
  <p><strong>お知らせ</strong>: 本プロジェクトはバージョン v2.0.0 以降、カスタムライセンスを採用しています。商用目的でご利用の場合は、<a href="/guide/license">ライセンス</a>セクションをご確認ください。</p>
</div>

