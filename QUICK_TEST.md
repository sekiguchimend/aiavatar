# クイックテスト手順

## 1. 開発サーバーを起動

```bash
cd demo-avatar
npm run dev
```

サーバーが起動したら、`http://localhost:3000` でアクセスできます。

## 2. テストページを開く

ブラウザで以下のURLを開きます：

```
http://localhost:3000/test-widget.html
```

## 3. テスト手順

1. **API Keyを入力**
   - OpenAI APIキーを入力（`sk-...`で始まる）
   - または、設定画面でAPIキーを設定済みの場合は空欄でもOK

2. **「Widgetを初期化」ボタンをクリック**
   - Widgetが表示されるまで数秒待ちます

3. **動作確認**
   - Widget内で直接会話できることを確認
   - 「テストメッセージ送信」ボタンでプログラムからメッセージを送信
   - ステータス表示でメッセージの送受信を確認

## 4. 実際の使用例（別のHTMLページ）

新しいHTMLファイルを作成して、以下をコピー：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>私のページ</title>
  <script src="http://localhost:3000/avatar-widget.js"></script>
</head>
<body>
  <h1>こんにちは！</h1>
  <p>このページにAvatar Widgetが表示されます。</p>
  
  <avatar-widget
    api-key="your-api-key-here"
    api-url="http://localhost:3000"
    model-type="vrm"
    character-name="アシスタント"
    width="100%"
    height="600px"
    position="relative"
  ></avatar-widget>
</body>
</html>
```

このHTMLファイルをブラウザで開くと、Widgetが表示されます。

## パフォーマンス確認

- **質問から返答まで**: 通常2-8秒（scriptタグ導入前後で変化なし）
- **初期読み込み**: 1-3秒（初回のみ）

## トラブルシューティング

### Widgetが表示されない
- ブラウザのコンソール（F12）でエラーを確認
- `avatar-widget.js`が読み込まれているか確認
- API URLが正しいか確認

### メッセージが送信されない
- API Keyが正しく設定されているか確認
- ネットワークタブ（F12 → Network）でAPIリクエストを確認



