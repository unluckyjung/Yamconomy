//서드 파티 express 써서 서버 구축
var express = require('express');
//express~
var app = express();
//router를 router/main.ejs를 이용하되 app을 붙여 사용하게 함으로써 굳이 여기서 app을 일일히 구현하지 않아도 router에서 원하는 대로 사용 가능하게 함
var router = require('./router/main') (app);

//구시대 유물
//디렉토리 이름 + view를 사용하게 하여 view 내 홈페이지 세팅
//app.set('views', __dirname + '/view');
//그 아랫줄까지 ejs 엔진 쓴다는 의미이다
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);
//
//server 80번 포트로 연다는 뜻
var server = app.listen(5000, function() {
	console.log("Server Starting... port : 5000");
});
//image같은 정적 데이터 서비스를 제공하기 위해 사용된다.
//앞의 경로는 제공하려는 위치(예를 들어 ~~~/uploads/~~~ 이런 식으로 사용됨.
//뒤의 static 다음에 다오는 것은 디렉토리 명이다.
app.use('/uploads', express.static('uploads'));
