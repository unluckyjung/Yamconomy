import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

export class Home extends Component {

	constructor(props) {
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
                        ID:''
                };
	}

	componentDidMount() {
		if(localStorage.getItem("userInfo")) {
			const userInfo =  JSON.parse(localStorage.getItem("userInfo")).id;
			//userinfo 값 제대로 나오는지 체크하는 용
			
			alert(userInfo);
			
			this.setState({ ID:userInfo });
		}
}

	render() {
		return (
			<div>
				<h2> hello bitchs~ This is home! </h2>
			<li>	
			<Link to={'/login'}> 로그인</Link>
			</li>
			<li>
			<Link to={'/register'}>회원가입</Link>
			</li>
			<li>
			<Link to={'/write'}>글쓰기</Link>
			</li>
			<li>
			<Link to={'/logout'}>로그아웃</Link>
			</li>
			<footer>Copyright djzdjzdl. All right reserved</footer>
			</div>
		);
	}
}

export class login extends Component {

	constructor(props) {
		super(props);
		//이거 바인딩 선언을 안 해주면 내부 state를 사용하지 못한다. 일반적인 함수도 전부 선언해줘야 한다.
		this.handleIDChange = this.handleIDChange.bind(this);
		this.handlePWChange = this.handlePWChange.bind(this);
		this.logining = this.logining.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.state = {
			ID: '',
			PW: ''
		};
	}

	handleIDChange(e) {
		console.log(e.target.value);
                this.setState({
			ID:e.target.value
		});
        }

        handlePWChange(e) {
		console.log(e.target.value);
                this.setState({
			PW:e.target.value
		});
        }

	handleKeyPress(e) {
		if(e.charCode===13) {
			this.logining();
		}
	}

	logining() {
                axios.post('/api/login_check', {
			ID: this.state.ID,
			PW: this.state.PW
		})
		.then( res => {
			//res 안에 array로 데이터가 담겨있다.
			//alert(JSON.stringify(res.data));
			if(res.data === "Success") {
				alert("로그인 성공!");
				//localStorage를 이용한 세션 저장
				localStorage.setItem(
					"userInfo",
					JSON.stringify({
						id : this.state.ID
					})
				);
				window.location.href = '/';
			} else {
				alert("로그인 실패! 아이디 또는 패스워드가 틀립니다.");
			}

			
		})
		.catch(function(err) {
			console.log(err);
			console.log("error occured, 관리자에게 문의하세요.");
		});
        }

	render() {
		return (
			<div>
				<h2> 로그인 페이지</h2>
				<form className="form-login">
                        		<input onChange={this.handleIDChange} onKeyPress={this.handleKeyPress} placeholder="ID" type="text" required />
		                        <input onChange={this.handlePWChange} onKeyPress={this.handleKeyPress} placeholder="Passwd" type="password" required />
                			<button className="button_for_login" onClick={this.logining} type="button">로그인</button>
		                </form>
			</div>
		);
	}
}

export class register extends Component {
        render() {
                return (
                        <div>
                                <h2> 가입 페이지</h2>
			                <form method="post" action="/api/register_check">
                        			<input name="usr[id]" placeholder="ID" type="text" required />
                        			<input name="usr[pw]" id="pw" placeholder="Passwd" type="password" required />
                         			<input name="pw_check" id="pw_check" placeholder="Passwd_check" type="password" />
                        			<input name="usr[wallet]" id="wallet" placeholder="Wallet" type="text" required />
                         			<input name="wallet_check" id="wallet_check" placeholder="Wallet_check" type="text" />
                <input type="submit" value="가입" />
                </form>
                        </div>
                )
        }
}

export class write extends Component {

        constructor(props) {	
		if(!localStorage.getItem("userInfo") ) {
                        alert('로그인을 먼저 해주세요');
                        window.location.href='/login';
                }
                super(props);
                //이거 바인딩 선언을 안 해주면 내부 state를 사용하지 못한다. 일반적인 함수도 전부 선언해줘야 한다.
                this.handleSubjectChange = this.handleSubjectChange.bind(this);
                this.handleContentsChange = this.handleContentsChange.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
                this.writing = this.writing.bind(this);
                this.handleKeyPress = this.handleKeyPress.bind(this);
                this.state = {
                        subject: '',
                        contents: '',
			image: null
                };
        }

        handleSubjectChange(e) {
                console.log(e.target.value);
                this.setState({
                        subject:e.target.value
                });
        }

        handleContentsChange(e) {
                console.log(e.target.value);
                this.setState({
                        contents:e.target.value
                });
        }

	handleImageChange(e) {
		console.log(e.target.files[0]);
		this.setState({
			image:e.target.files[0]
		});
	}

        handleKeyPress(e) {
                if(e.charCode===13) {
                        this.writing();
                }
        }

	        writing() {
			const userInfo =  JSON.parse(localStorage.getItem("userInfo")).id;
			const data = new FormData();
			data.append('id', userInfo);
			data.append('subject', this.state.subject);
			data.append('contents', this.state.contents);
			data.append('image', this.state.image);

			const config = {
				headers: {
                                'content-type': 'multipart/form-data'
                                //enctype: 'multipart/form-data'
                        	}
			}

			console.log(this.state.image);
                axios.post('/api/write_check', data, config//{
			//headers: {
			//	'content-type': 'multipart/form-data'
			//	//enctype: 'multipart/form-data'
			//}
                        //id: userInfo,
                        //subject: this.state.subject,
			//contents: this.state.contents,
			//image: this.state.image
		//}
		)
                .then( res => {
                        //res 안에 array로 데이터가 담겨있다.
                        //alert(JSON.stringify(res.data));
                        if(res.data === "Success") {
                                alert("글쓰기 성공!");
                                //localStorage를 이용한 세션 저장

                                
                                window.location.href = '/';
                        } else {
                                alert("글쓰기 실패!");
                        }


                })
                .catch(function(err) {
                        console.log(err);
                        console.log("error occured, 관리자에게 문의하세요.");
                });
        }

        render() {
                return (
                        <div>
                        	 <form className="form-writing" enctype="multipart/form-data">
                        		<input onChange={this.handleSubjectChange} onKeyPress={this.handleKeyPress} placeholder="제목" type="text" required/>
                        		<input onChange={this.handleContentsChange} onKeyPress={this.handleKeyPress} placeholder="내용" type="text" required/>
                        		<input onChange={e => this.handleImageChange(e)} placeholder="이미지" type="file" />
                			<button className="button_for_write" onClick={this.writing} type="button">글쓰기</button>
                		</form>
                        </div>
                )
        }
}

export class logout extends Component {

	constructor(props) {
		super(props)
		if(localStorage.getItem("userInfo") ) {
			localStorage.clear();
			alert('수고하셨습니다.');
			window.location.href='/';
		}
	}
}
