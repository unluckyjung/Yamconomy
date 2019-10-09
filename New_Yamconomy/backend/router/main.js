//POST식 전송을 위해 bodyParser 불러오기
var bodyParser = require('body-parser');
//Hashing 위해 Crypto 불러오기
var crypto = require('crypto');
//get_db 내 query 함수 불러오기 위해 database로 불러오기, 놀라운 점은 페이지 따로 가서 일일이 함수를 불러올 필요 없이 request body 또는 query 내 데이터를 읽어 여기서 처리하게끔 하면 된다!
var database = require('../get_db.js');
//세션 연결을 위해 가져옴
var session = require('express-session');
//업로드를 위해 가져왔다.
var multer = require('multer');
//이미지 파일만 저장 시 function 이용해서 시간+'-'+이름으로 저장할 수 있게끔 함
//만약 파일명을 변경하고 싶다면 file.name cb 후자를 변경하면 됨
//저장 경로를 바꾸고 싶다면 destination cb 후자를 변경하면 된다.
var upload = multer({
	storage: multer.diskStorage({
		destination: function(req,file,cb) {
			cb(null, 'uploads');
		},
		filename: function(req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname);
		}
	})
});
//하나의 모듈로 만들어 app 구현을 따로 필요없이 여기서 할 수 있게 함
module.exports = function(app) {
	//세션 사용 위해 설정
	app.use(session({
		key: 'sid',
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
	}));

	//여기서 urlencoded를 써야 정상적으로 POST가 작동한다.
	app.use(bodyParser.urlencoded({ extended:true}));
	//index.html 
	app.get('/', function(req, res) {
		console.log(req.session);
		//앙 렌더링띠
		res.render('index.html', {session:req.session});
		
	});
	//login.html
	app.get('/login', function(req, res) {
		res.render('login.html');
		//그냥 database 테스트 하기 위해 넣음. 쓸모는 없다.
		//database.test();
	});
	//register.html
	app.get('/register', function(req, res) {
                res.render('register.html');
                //그냥 database 테스트 하기 위해 넣음. 쓸모는 없다.
                //database.test();
        });

	//frontend 연동 테스트용 - 성공함. 사용 시 /api/~~ 이렇게 써줘야 한다.
	app.get('/api/hello', function(req, res) {
		console.log('처리');
		res.send({message:'Hello..?'});
	});

	//get 테스트 체크용 - 정상작동
	//app.get('/login_check', function(req, res) {
	//	var data = req.query.data;
	//	console.log(data);
	//	res.render('login_check.html',{data:data, method:"get"} );
	//});
	
	//select 테스트 체크용 - 정상작동
	app.get('/selection_test', function(req, res) {
		//database에서 select_test 함수를 사용한다. 단순히 이름이 djzdjzdl이면 데이터를 가져와 읽는다.
		database.select_test( function(err, data) {
			//여기서 path를 utf8로 변경해주어야 하는데, 그렇지 않으면 문자가 깨지는 경우가 생긴다
			var path = data[0].Image.toString('utf8');
			console.log(path);
			//이후 select한 다음 나오는 데이터 중 첫 번째 데이터를 가져와 POST 방식으로 보낸다.
			res.render('selection_test.html', {id:data[0].ID, number:data[0].Number, subject:data[0].Subject, contents:data[0].Contents, image:path});
		});
	});
	
	//post 테스트 체크용 - 여기서 urlencoded 써줘야 작동함;; 좆병신
	app.post('/login_check', function(req, res) {
		console.log(req.body);
		//ID, PW, Wallet 받아서 POST로 넘겨주기
		var ID = req.body.usr.id;
		var PW = req.body.usr.pw;
		var PW_HASH = crypto.createHash('sha1');
		PW_HASH.update(PW);
		var PW_OUTPUT = PW_HASH.digest('hex');
		//만약 어떠한 데이터 값을 받아야 하는 경우 다음과 같이 질의해야 한다. 아래는 select 문의 예제이다.
		//login 시 function으로 데이터를 받아 처리한다. 아래는 로그인 가능 불가능에 대한 것 뿐이니, result가 null이냐 아니냐에 따라서만 처리한다.
		database.login(ID,PW_OUTPUT, function(err,result) {
		if(result == null) {
			res.send("<script>alert('로그인 실패!');window.location.href = '/login';</script>");
		} else {
			console.log('Success!');
			req.session.user_id = ID;
			res.send("<script>alert('로그인 완료!');window.location.href = '/';</script>");
                //res.render('login_check.html', {ID:ID,PW:PW_OUTPUT,result:result, method:"post"});
			}
		});
	});

	//register 진행 시 값이 있는지 확인하고 없는 경우 가입한다.
	app.post('/register_check', function(req, res) {
                console.log(req.body);
                //ID, PW, Wallet 받아서 POST로 넘겨주기
                var ID = req.body.usr.id;
                var PW = req.body.usr.pw;
		var Wallet = req.body.usr.wallet;
		//입력받은 PW Hashing 처리
                var PW_HASH = crypto.createHash('sha1');
                PW_HASH.update(PW);
                var PW_OUTPUT = PW_HASH.digest('hex');
		//가입 후 정상적으로 처리된 경우 완료, 안될경우 실패 표시, 참고로 res.send와 res.render은 동시 사용 불가능하다. header가 둘 중 한번 이미 전송된 상태라 한번을 못 받기 때문.
                var result = database.register(ID,PW_OUTPUT,Wallet);
		if(result) {
		res.send("<script>alert('회원 가입 완료');window.location.href = '/';</script>"); }
		else {
			//이미 작성한 데이터가 있으므로 history.back() 함수를 이용하여 입력한 데이터를 보존시킨다
		res.send("<script>alert('회원 가입 실패, 동일 아이디가 존재합니다.');window.history.back();</script>");
		}
		//데이터 전송 체크용 설정
                //res.render('register_check.html', {ID:ID,PW:PW_OUTPUT,Wallet:Wallet, method:"post"});
        });

	//logout을 위해 만들었다. 단순히 현재 존재하는 session을 없앤다.
	app.get('/logout', function(req, res) {
		//session check를 위해 console 띄우기.
		console.log("session logout = " +req.session.user_id);
		req.session.destroy(function(err) {
			if(err) console.error('error!',err);
			//정상적으로 처리된 경우 alert 표시
			res.send("<script>alert('로그아웃 되었습니다.');window.location.href = '/';</script>");
		});
	});
	
	//글쓰기를 위한 routing 진행. iframe 또는 새창 띄워서 쓸 예정
	app.get('/write', function(req, res) {
		res.render('write.html',{session:req.session});
	});

	//글쓰기 체크용으로 만든 페이지이다. upload를 반영한다.
	app.post('/write_check', upload.single("image"), function(req, res) {
		//테스트를 위한 로그 찍음
		console.log(req.body);
		console.log(req.file.path);
		//ID, Subject, Contents 데이터를 받는다.
		var ID = req.body.review.id;
		var Subject = req.body.review.subject;
		var Contents = req.body.review.contents;
		//이후 Review에 Insertion을 진행하는데 여기서 파일 경로로 image를 저장해야 추후 불러올 수 있다.
		database.write(ID,Subject,Contents,req.file.path, function(err,data) {
			if(data) {
                	        res.send("<script>alert('글쓰기 완료');window.location.href = '/';</script>");
                	} else {
                	        res.send("<script>alert('글쓰기 실패');window.history.back();</script>");
                	}
		});
	});

}
