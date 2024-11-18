# webpro_06

## ファイル一覧
ファイル名 | 説明
-|-
app5.js | プログラム本体
public/jannken.html | じゃんけん開始画面
public/wish.html | 祈願開始画面
janken.ejs | WEB表記内容
wish.ejs | WEB表記内容

## 起動方法
1. ターミナルにて```node app5.js```でプログラムを起動
1. Webブラウザで
localhost:8080/public/wish.html
にアクセスする
1. 単発または10連を選択する

## 大まかなチャート
```mermaid
flowchart TD;

start["開始"];
end1["終了"]
if{"単発または10連"}
one["1回のみ祈願"]
ten["for文で10回祈願"]

start --> if
if -->|単発| one
one --> end1
if -->|10連| ten
ten --> end1
```
#### 祈願内部のフローチャート
```mermaid
flowchart TD;
wish["開始"]
if1{"9回連続で星4が出てない"}
yesfour["星4を排出"]
if2{"乱数がある値＊1より低い"}
low1["星3を排出"]
if3{"乱数がある値＊2より高い"}
high1["星5を排出"]
last["星4を排出"]
end1["終了"]

wish --> if1
if1 -->|yes| yesfour
yesfour --> end1
if1 -->|no| if2
if2 -->|yes|low1
low1 --> end1
if2 -->|no| if3
if3 -->|yes| high1
high1 --> end1
if3 -->|no| last
last --> end1
```
*1 ある値は 943-fiveceiling である．fiveceilingは星5の確率上昇及び星3確率減少の処理に使用．
```javascript
num <= 943 - fiveceiling
```
```javascript
fiveceiling = fiveCounter > 73 ? (fiveCounter - 73) * 60 : 0;
```
*2 ある値は 995-fiveceiling である．
```javascript
num >= 995 - fiveceiling
```

## 機能
1. 10回に1度は必ず星4が排出される
1. 90回までに星5は必ず排出される(天井要素)
1. 74回目からは星5の排出確率が6%ずつ増加，代わりに星3の排出確率が減少

## 排出確率
レアリティ |  確率
-|-
星3 | 94.3%
星4 | 5.1%
星5 | 0.6%