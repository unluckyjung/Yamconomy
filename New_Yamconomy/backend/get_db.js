//db_connect는 db 연결 시 아래의 내용 중복 기입을 막기 위해 작성된 내부 함수입니다. 사용 시 var connection = db_connect(); 등으로 사용할 수 있으며 사용 후에는 connection.query(~~ 등으로 바로 사용할 수 있습ㄴ다.)
db_connect = function() {
	var mysql = require('mysql');
	var connection = mysql.createConnection( {
		host : 'localhost',
		user : 'root',
		password : 'rladydtlr',
		database : 'hanium'
	});
	return connection;
}

//로그인 가입 시 아이디 중복을 막기 위해 설치해놓음.
register_check = function(id) {
	var connection = db_connect();
	var sql = 'SELECT * FROM Account WHERE ID=?';
	var params = [id];
	connection.query(sql, params, function(error, results, fields) {
		//해당 쿼리가 끝나면 연결을 종료해야 지속적으로 연결하여 resource를 잡아먹거나 취약점 발생 안함
		connection.end();
                if(error) {
                        console.log(error);
                } else {
                        if(results == '') {
                                return true;
                        } else {
                                return false;
                        }
                }
        });
}
//테스팅용 - 이렇게 짜면 단순히 var database = require('../get_db.js'); 이렇게 불러온 후 database.test(); 이렇게 불러오면 원하는 값 리턴 또는 로그 출력 가능
exports.test = function() {
	var connection = db_connect();
	connection.query('select 1 + 1 AS solution', function(error,results,fields) {
		console.log('The solution is : ', results[0].solution);
});
	connection.end();
}

//selection test용 - 이미지 저장 되는지 확인하기 위해 사용된다.
exports.select_test = function(result) {
        var connection = db_connect();
	var sql = 'SELECT * FROM Review WHERE ID=?';
	var params = ['djzdjzdl'];
        connection.query(sql,params, function(error,results,fields) {
		connection.end();
                if(error) {
			console.log("err.. fuck");
		}
		result(null,results);
});
}

//가입 함수이다. Parameter로는 id, password, wallet을 받는다.
exports.register = function(id,pw,wallet) {
	//id 중복 체크
	var results = register_check(id);
	//만약 중복이 존재하지 않는다면 가입 진행
	if(results) {
	//connection 진행
	var connection = db_connect();
	//Parameter를 받기 위해 ?를 이용하여 처리
	var sql = 'INSERT INTO Account(ID,PW,Wallet) VALUES(?,?,?)';
	//parameter를 정의해준다.
	var params = [id, pw, wallet];
	//query문. 주의할 점은 sql, params 이렇게 들어가야 맞다.
	connection.query(sql, params, function(error, results, fields) {
		connection.end();
		if(error) {
			console.log(error);
		}
		console.log('Account Created!');
	});
	//만약 중복되는 로그인이 존재한다면 false를 리턴한다.
	} else {
		return false;
	}
}

//가입 함수이다. Parameter로는 id, password, wallet을 받는다.
exports.login = function(id,pw,result) {
        //connection 진행
        var connection = db_connect();
        //Parameter를 받기 위해 ?를 이용하여 처리
        var sql = 'SELECT * FROM Account WHERE ID=? AND PW=?';
        //parameter를 정의해준다.
        var params = [id, pw];
        //query문. 주의할 점은 sql, params 이렇게 들어가야 맞다.
	//특이한 것은 query문 밖에 변수를 선언한 후 query 안에서 사용하려고 하면 아예 사용 자체가 되지 않는다. 그러므로 다음과 같이 function을 동시에 선언한후 값을 리턴시켜야 한다.
        connection.query(sql, params, function(error, results, fields) {
		connection.end();
                if(error) {
                        console.log(error);
                } else {
			//만약 내부 결과값이 없다(로그인 정보가 없다)면 로그인 실패, 데이터가 존재할 경우 로그인 성공 진행
			if(results != '') {
	                	console.log('Login Completed!');
				result(null, 1);
			} else {
				console.log('Login Failed!');
				result(0,null);
			}
		}
        });
}

exports.write = function(id,subject,contents,image,result) {
	//connection 진행
	var connection = db_connect();
	//Parameter를 받기 위해 ?를 이용하여 처리, 참고로 게시판 번호인 Number은 
	var sql = 'INSERT INTO Review(ID,Vote,Subject,Contents,Image) VALUES(?,0,?,?,?)';
	var params = [id, subject, contents, image];
	connection.query(sql, params, function(error, results, fields) {
		connection.end();
		if(error) {
                	console.log(error);
			result(null, null);
                }
                console.log('Review Created!');
		result(0, 1);
        });

//Review 내에 있는 데이터를 select 하는 함수이다. 만약 특정한 데이터를 긁어오고 싶은 경우 상단의 select test case를 사용하면 된다.
exports.select_test = function(result) {
        var connection = db_connect();
        var sql = 'SELECT * FROM Review';
        connection.query(sql,params, function(error,results,fields) {
                connection.end();
                if(error) {
                        console.log("err.. fuck");
                }
                result(null,results);
});
}


}
