# Avatar Widget テスト手順

## 1. 開発サーバーの起動

```bash
cd demo-avatar
npm run dev
```

サーバーが起動したら、`http://localhost:3000` でアクセスできます。

## 2. テストページにアクセス

ブラウザで以下のURLを開きます：

```
http://localhost:3000/test-widget.html
```

または

```
http://localhost:3000/widget-example.html
```

## 3. Widgetの初期化

1. **API Keyを入力**: OpenAI APIキーを入力（`sk-...`で始まる）
2. **API URLを確認**: `http://localhost:3000` が正しく設定されているか確認
3. **「Widgetを初期化」ボタンをクリック**

## 4. 動作確認

- Widgetが表示されることを確認
- 「テストメッセージ送信」ボタンでメッセージを送信
- ステータス表示でメッセージの送受信を確認

## 5. 実際の使用例

### シンプルなHTMLページ

```html
<!DOCTYPE html>
<html>
<head>
  <script src="http://localhost:3000/avatar-widget.js"></script>
</head>
<body>
  <h1>私のページ</h1>
  
  <avatar-widget
    api-key="your-api-key-here"
    api-url="http://localhost:3000"
    model-type="vrm"
    character-name="アシスタント"
  ></avatar-widget>
</body>
</html>
```

### JavaScriptから制御

```javascript
const widget = document.querySelector('avatar-widget');

// メッセージ送信
widget.sendMessage('こんにちは！');

// イベントリスナー
widget.addEventListener('ready', () => {
  console.log('Widget準備完了！');
});

widget.addEventListener('message-received', (e) => {
  console.log('受信:', e.detail.message);
});
```

## トラブルシューティング

### Widgetが表示されない

1. ブラウザのコンソールでエラーを確認
2. `avatar-widget.js`が正しく読み込まれているか確認
3. API URLが正しいか確認

### メッセージが送信されない

1. API Keyが正しく設定されているか確認
2. ネットワークタブでAPIリクエストを確認
3. ブラウザのコンソールでエラーを確認

### iframeの読み込みエラー

- CORSエラーが発生する場合は、Next.jsの設定を確認
- `next.config.js`でCORSヘッダーを追加する必要がある場合があります



