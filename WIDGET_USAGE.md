# Avatar Widget - Script Tag Integration

このドキュメントでは、Avatar Widgetをscriptタグで導入する方法を説明します。

## 基本的な使用方法

### 1. Scriptタグの追加

HTMLページの`<head>`または`<body>`に以下のscriptタグを追加します：

```html
<script src="https://your-domain.com/avatar-widget.js"></script>
```

**注意**: 開発環境では `http://localhost:3000/avatar-widget.js` を使用してください。

### 2. Widget要素の追加

HTMLの任意の場所に`<avatar-widget>`要素を追加します：

```html
<!-- Gemini API使用例 -->
<avatar-widget
  google-key="your-google-api-key"
  api-url="http://localhost:3000"
  ai-service="google"
  ai-model="gemini-2.5-flash"
  model-type="vrm"
  character-name="Character"
  width="100%"
  height="100vh"
  position="fixed"
></avatar-widget>

<!-- OpenAI API使用例 -->
<avatar-widget
  api-key="your-openai-api-key"
  api-url="http://localhost:3000"
  model-type="vrm"
  character-name="Character"
  width="100%"
  height="100vh"
  position="fixed"
></avatar-widget>
```

**重要**: `api-url`は、Next.jsアプリが動作しているURLを指定してください。

## 属性オプション

| 属性名 | 説明 | デフォルト値 | 必須 |
|--------|------|--------------|------|
| `api-key` | OpenAI APIキー | - | OpenAI使用時 |
| `google-key` | Google Gemini APIキー | - | Gemini使用時 |
| `ai-service` | AIサービス (`google`, `openai`, `anthropic`など) | - | 任意 |
| `ai-model` | AIモデル (`gemini-2.5-flash`, `gpt-4o`など) | `gemini-2.5-flash` (google-key指定時) | 任意 |
| `api-url` | APIサーバーのURL | `window.location.origin` | 任意 |
| `model-type` | モデルタイプ (`vrm` または `live2d`) | `vrm` | 任意 |
| `character-name` | キャラクター名 | `Character` | 任意 |
| `width` | ウィジェットの幅 | `100%` | 任意 |
| `height` | ウィジェットの高さ | `100vh` | 任意 |
| `position` | CSS position値 | `fixed` | 任意 |

## プログラムからの使用

JavaScriptからも制御できます：

```javascript
// Widget要素を取得
const widget = document.querySelector('avatar-widget');

// メッセージを送信
widget.sendMessage('こんにちは！');

// 設定を変更
widget.setConfig({
  'model-type': 'live2d',
  'character-name': '新しいキャラクター'
});

// イベントリスナー
widget.addEventListener('ready', (e) => {
  console.log('Widget is ready!', e.detail);
});

widget.addEventListener('message-received', (e) => {
  console.log('Message received:', e.detail.message);
});
```

## イベント

Widgetは以下のイベントを発火します：

- `ready`: Widgetの準備が完了したとき
- `message-sent`: メッセージが送信されたとき
- `message-received`: メッセージが受信されたとき
- `error`: エラーが発生したとき

## パフォーマンスについて

### 質問から返答までのスピード

**✅ scriptタグで導入しても、質問から返答までのスピードは変わりません。**

#### 理由

1. **API呼び出しは同じ**: Widget内でも同じAPIエンドポイント（`/api/chat`など）を使用します
2. **ネットワークレイテンシーは同じ**: APIサーバーへのリクエストは同じ経路を通ります
3. **処理ロジックは同じ**: メッセージ処理、音声生成、アニメーション処理は同じコードを使用します
4. **iframeのオーバーヘッドは無視できる**: iframeの通信オーバーヘッドは数ミリ秒程度で、API呼び出し（通常1-5秒）に比べて無視できます

#### 実際のパフォーマンス

- **質問送信 → API呼び出し**: 通常1-5秒（AIモデルとネットワークに依存）
- **音声生成**: 通常1-3秒（TTSサービスに依存）
- **アニメーション表示**: 即座（ローカル処理）

**合計**: 通常2-8秒（scriptタグ導入前後で変化なし）

### 初期読み込み時間

- **初回読み込み**: Widgetスクリプト（~10KB）とReactアプリ（~500KB-1MB）の読み込みが必要
  - 通常: 1-3秒（ネットワーク速度に依存）
- **2回目以降**: ブラウザキャッシュにより高速化（0.5-1秒）
- **CDN使用**: CDNを使用することで、読み込み時間をさらに短縮可能（0.3-0.8秒）

### 最適化のヒント

1. **CDNの使用**: WidgetスクリプトをCDNにホストすることで読み込みを高速化
2. **Preload**: `<link rel="preload" href="avatar-widget.js">`で事前読み込み
3. **Lazy Loading**: 必要になったときに読み込む（Intersection Observer API使用）
4. **Next.jsの最適化**: 既にNext.jsの最適化機能（コード分割、Tree Shaking）が適用されています

## セキュリティ

- Widgetはiframe内で動作するため、ホストページから分離されています
- APIキーはURLパラメータとして渡されますが、HTTPSを使用することを推奨します
- メッセージは`postMessage` APIを使用して安全に通信されます

## 例

### 最小構成

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://your-domain.com/avatar-widget.js"></script>
</head>
<body>
  <h1>My Page</h1>
  <avatar-widget api-key="your-api-key"></avatar-widget>
</body>
</html>
```

### カスタム設定

```html
<avatar-widget
  api-key="sk-..."
  api-url="https://api.example.com"
  model-type="live2d"
  character-name="アシスタント"
  width="800px"
  height="600px"
  position="absolute"
  style="top: 100px; left: 100px;"
></avatar-widget>
```

## トラブルシューティング

### Widgetが表示されない

1. Scriptタグが正しく読み込まれているか確認
2. ブラウザのコンソールでエラーを確認
3. API URLが正しいか確認

### メッセージが送信されない

1. APIキーが正しく設定されているか確認
2. ネットワーク接続を確認
3. ブラウザのコンソールでエラーを確認

## サポート

問題が発生した場合は、ブラウザのコンソールログを確認してください。

