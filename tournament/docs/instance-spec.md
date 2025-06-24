
# 一時的な仕様

# ステータス
 200 - 成功
 400 - 失敗
 404 - 存在しないAPIパス

# エラー形式
 終了ステータスは常に400
 * errors - 配列（万が一複数のエラーを出力すべき時に使用
 * errors.type - エラータイプ (各APIでざっくりと定義されている) (string)
 * errors.message - エラーメッセージ (日本語)

# トーナメント
 Base: /tournaments
 C: /tournaments
 R: /tournaments/{id}
 R: /tournaments
 U: /tournaments/{id}
 D: /tournaments/{id}
 
 U: /tournaments/{id}/open : トーナメントを開始する パラメータ無し
 U: /tournaments/{id}/close : トーナメントを終了する パラメータ無し
 R: /tournaments/{id}/participants : 参加者取得
 R: /tournaments/{id}/matches : マッチ取得

## 1つのトーナメントに保存するデータ
 * id : トーナメントID　連番
 * name : トーナメント名
 * status : トーナメントの状況 - [reception, open, close] 変更可
 * num : 現在の参加人数
 * max_num : 最大人数 (最大で16人まで) 変更可
 * participants : 参加者リスト
 * matches : マッチリスト

 ## エラー
 * EID : 存在しないIDです。
 * EPARAM : 変更できないパラメータです 
 * EEDIT : 変更に失敗しました

# 参加者
 Base: /participants
 C: /participants
 R: /participants/{id}
 R: /participants
 U: /participants/{id}
 D: /participants/{id}

## １つの参加者に保存するデータ
 * id : 参加者ID UUID
 * tournament_id : トーナメントID
 * order : 参加者の順番 参加順で連番 (変更不可(複雑さを避けるため))
 * name : 名前 変更可
 * external_id : 外部ID（外部システム連携用） 変更可

 ## エラー
 * EID : 存在しないIDです。
 * EPARAM : 変更できないパラメータです 
 * EEDIT : 変更に失敗しました

# マッチ
 参加人数により計算され増減する。
 Base: /matches
 C: /matches - 自動作成のため使用不可
 R: /matches/{id}
 R: /matches
 U: /matches/{id} - 複雑さを避けるため使用不可
 D: /matches/{id} - 自動作成のため使用不可

 U: /matches/{id}/start マッチの開始
 U: /matches/{id}/done マッチの終了
 R: /matches/{tournament_id}/next 次のマッチの取得 statusがdone or skipでないorderが最も若いマッチ

## /matches/{id}/done
### リクエストボディに含める情報
 * winners
 * losers
 * tie_players

## １つのマッチに保存するデータ
 * id : マッチID　連番
 * tournament_id : トーナメントID
 * order : マッチの順番 連番 トーナメント内で重複しない値 (変更不可)
 * type : 種類 - [(seed <- 後で追加するかも), versus]
 * status : ステータス - [ready, in_progress, done, skip] 変更可
 * participants : 参加者 participantsのorderで昇順でソートされる。
 * winners : 勝者
 * losers : 敗者
 * tie_players : 引き分け者
 
## エラー
 * EID : 存在しないIDです。
 * EPARAM : 変更できないパラメータです 
 * EEDIT : 変更に失敗しました
