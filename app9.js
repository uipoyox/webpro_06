"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log( [name, message] );
  const id = Date.now();
  const timestamp = new Date();
  // 本来はここでDBMSに保存する
  bbs.push( {id:id, name: name, message: message , likes:0} );
  res.json( {number: bbs.length } );
});

app.post("/delete", (req, res) => {
    const post_id = Number(req.body.id);
    const index = bbs.findIndex(post => post.id === post_id);
    if (index !== -1) {
        bbs.splice(index, 1);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post("/like", (req, res) => {
    const post_id = Number(req.body.id);
    const post = bbs.find(bbs => bbs.id == post_id);
    if (post) {
        if (!post.likes) post.likes = 0;  
        post.likes += 1;  
        res.json({ success:true, likes:post.likes });
    }else res.json({ success:false });
  });

app.post("/edit", (req, res) => {
    const post_id = Number(req.body.id);
    const newMessage = req.body.message;

    let post = bbs.find(post => post.id === post_id);
    if (post) {
        post.message = newMessage;
        res.json({ success: true, message: "編集完了" });
    } else {
        res.status(404).json({ success: false, message: "投稿が見つかりません" });
    }
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));