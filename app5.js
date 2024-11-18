const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  let judgement = '';

  if( !req.query.check1 ){
    if( num==1 && hand=='グー' || num==2 && hand=='チョキ' || num==3 && hand=='パー' ) judgement = '引き分け';
    else if( num==1 && hand=='パー' || num==2 && hand=='グー' || num==3 && hand=='チョキ' ) judgement = '勝ち',win += 1;
    else if( num==1 && hand=='チョキ' || num==2 && hand=='パー' || num==3 && hand=='グー' || hand=='なさけない' ) judgement = '負け';
  }
  else if( req.query.reqcheck1 ){
    if( num==1 && hand=='グー' || num==2 && hand=='チョキ' || num==3 && hand=='パー' ) judgement = '引き分け';
    else if( num==1 && hand=='パー' || num==2 && hand=='グー' || num==3 && hand=='チョキ' ) judgement = '負け';
    else if( num==1 && hand=='チョキ' || num==2 && hand=='パー' || num==3 && hand=='グー' || hand=='なさけない' ) judgement = '勝ち',win += 1;
  }
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));

app.get("/wish", (req, res) => {
  const value = req.query.radio;
  const num = Math.floor(Math.random() * 1000 + 1);
   
  let total = Number( req.query.total );
  let three = Number( req.query.three );
  let four = Number( req.query.four );
  let five = Number( req.query.five );
  let fourCounter = Number(req.query.fourCounter);
  let fiveCounter = Number(req.query.fiveCounter);
  let fiveceiling = 0;
  let tentotal =[];

  if (isNaN(total)) total = 0;
  if (isNaN(three)) three = 0;
  if (isNaN(four)) four = 0;
  if (isNaN(five)) five = 0;
  if (isNaN(fourCounter)) fourCounter = 0;
  if (isNaN(fiveCounter)) fiveCounter = 0;

  let result = '';

  if( value==1 ){
    const num = Math.floor(Math.random() * 1000 + 1);
    fiveceiling = fiveCounter > 73 ? (fiveCounter - 73) * 60 : 0; //負の値になることを防ぐ
    if( fourCounter == 9 )four += 1,result = '星4' , fourCounter = 0 , fiveCounter += 1 , tentotal.push('星4');
      else if (num <= 943 - fiveceiling) {
        three += 1 , result = '星3' , fourCounter += 1 , fiveCounter += 1 , tentotal.push('星3');
      } else if (num >= 995 - fiveceiling) {
        five += 1, result = '星5' , fourCounter += 1 , fiveCounter = 0 , tentotal.push('星5');
      } else {
        four += 1, result = '星4' , fourCounter += 0 , fiveCounter += 1 , tentotal.push('星4');
      }
    total += 1;
  }
  else if( value==2 ){
    for (let i = 0; i < 10; i++) {
      const num = Math.floor(Math.random() * 1000 + 1);
      fiveceiling = fiveCounter > 73 ? (fiveCounter - 73) * 60 : 0;
      if( fourCounter == 9 )four += 1,result = '星4' , fourCounter = 0 , fiveCounter += 1 , tentotal.push('星4');
      else if (num <= 943 - fiveceiling) {
        three += 1 , result = '星3' , fourCounter += 1 , fiveCounter += 1 , tentotal.push('星3');
      } else if (num >= 995 - fiveceiling) {
        five += 1, result = '星5' , fourCounter += 1 , fiveCounter = 0 , tentotal.push('星5');
      } else {
        four += 1, result = '星4' , fourCounter += 0 , fiveCounter += 1 , tentotal.push('星4');
      }

    console.log( fiveceiling );//デバッグ用

    }
    total += 10;
  }

  console.log( result , num , fourCounter , fiveCounter  );

  const display = {
    result: result,
    total: total,
    three: three,
    four: four,
    five: five,
    fourCounter: fourCounter,
    fiveCounter: fiveCounter,
    fiveceiling: fiveceiling,
    tentotal: tentotal,
  }

  res.render( 'wish', display );
});

app.get("/zeller", (req, res) => {
  const value = req.query.number;

  let Y = Number(value.substring(0, 4));
  let M = Number(value.substring(4, 6));
  let D = Number(value.substring(6, 8));

  let result = "";

  if (value && value.length == 8) {
    let year = Number(value.substring(0, 4));
    let month = Number(value.substring(4, 6));
    let day = Number(value.substring(6, 8));

    // 1月または2月の場合前年を使用し、月を13または14にする
    if (month == 1 || month == 2) {
      month += 12;
      year -= 1;
    }

    // ツェラーの公式の計算
    const yearlow = year % 100;
    const C = Math.floor(year / 100);
    const step1 = Math.floor(yearlow / 4);
    const step2 = yearlow;
    const step3 = Math.floor(13 * (month + 1) / 5);
    const step4 = day;
    const step5 = Math.floor(C / 4) - 2 * C;

    // 合計を7で割った余りを計算 
    const step6 = (step1 + step2 + step3 + step4 + step5) % 7;

    const xday = (step6 + 7) % 7;

    const weekdays = ['土', '日', '月', '火', '水', '木', '金'];
    result = weekdays[xday];
  } else {
    result = "8桁の生年月日を入力してください。";
  }

  console.log(result);

  const display = {
    result: result,
    Y: Y,
    M: M,
    D: D,
  };

  res.render('zeller', display);
});