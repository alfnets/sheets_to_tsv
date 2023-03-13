# gas-gsheet2tsv-github
Google Apps Script を使用して Google Sheets を TSV に変換したものを GitHub上のリポジトリに commit & push し、Pull Request を作成してくれます。また、フローは GitHub Flow に則り、commit & push する前に新しい ブランチ を作成してくます。これにより、i18n（多言語）対応などを Google Sheets で管理し、簡単に GitHub 上のリポジトリに反映することが可能となります。

# Usage
- GitHub の アクセストークン を発行する（権限は必要最小限にすることを推奨）
- TSV で管理したいファイルを Google Sheets で作成
- 作成した Google Sheets で Apps Script のエディタを開く
- [gsheetToTsv.jp](https://github.com/alfnets/gas-gsheet2tsv-github/blob/main/gsheetToTsv.js) のコードを貼り付ける
- 発行した GitHub の アクセストークン を用いて setup関数 を一度だけ実行する
- setup関数 をコメントアウトする
- 必要なパラメータをコード内に設定する
  - repoOwner
  - repoName
  - fileName(拡張子は不要)
  - filePath
- 編集したコードを保存する
- トリガーを設定する
  - 実行する関数: onOpen
  - イベントのソースを選択: スプレッドシートから
  - イベントの種類を選択: 起動時
  - エラー通知設定: 任意のもの
- 作成した Google Sheets を開き直す
- メニューに追加された `Custom Menu` から `Convert to TSV and push to GitHub` を実行

# Demo
- [デモファイル](https://docs.google.com/spreadsheets/d/1wOVgwXeu_E7bvrr2IBxzh9EN73IjsuC1nHtgU9E4-Bw/edit?usp=sharing) にアクセス
- ファイルを編集する
- メニューバー の `Custom Menu` から `Convert to TSV and push to GitHub` を実行
- 本リポジトリに Pull Request が作成されていることを確認
  - 検証以外の目的でいたずらに連続で実行することは禁止

# Author
あるふ (alf)

# License
This software is released under the MIT License, see LICENSE.<br>
https://opensource.org/licenses/mit-license.php
