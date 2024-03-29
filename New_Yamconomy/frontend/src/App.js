import React, {Component} from 'react';
import { Route, Link } from 'react-router-dom';
import Clock from 'react-live-clock';
import Jquery from 'jquery';
import Slider from 'react-slick';
import ReactDOM from 'react-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';
import './App.css';
import make_transaction_to_contract from './js_file/send_hex.js';
import get_hex_from_contract from './js_file/get_hex.js';
import SHA256 from './js_file/Sha256.js';

//import * from './js_file/web3.min.js';

export class Topper extends Component {
   
	constructor(props) {
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
			ID: ''
		};
	}
   
        componentDidMount() { 
                if(localStorage.getItem("userInfo")) {
                        const userInfo =  JSON.parse(localStorage.getItem("userInfo")).id;
                        this.setState({ ID:userInfo });
                }
    }
   
        render() {
                return (
                        <div class="topper-text">
                                <div class="top-logo">
                                        <a href={'/'}>YAMCONOMY</a>
                                </div>
                                <div class="top-button">
                                <table> {
					this.state.ID ? 
					<tr>
                                                <td><a href={'write'}>글쓰기</a></td>
                				<td><a href={'logout'}>로그아웃</a></td>
						<td><a href={'store_register'}>가게 등록</a></td>
        				</tr> 
					:
					<tr>
				        	<td><a href={'login'}>로그인</a></td>
            					<td><a href={'register'}>회원가입</a></td>
         				</tr>
				}
                                </table>
                                </div><div class="top-clear"></div>
                        </div>
                );
        }

}

export class Footer extends Component {
	render(){
		return (
			<div class="footer-text">Copyright djzdjzdl and SOFTK. All right reserved</div>
		);
	}
			
}

export class Home extends Component {


	constructor(props) {
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.state = {
                        ID:'',
			date_h: 0,
			date_m: 0,
			date_s: 0
                };
	}

	componentDidMount() {
		if(localStorage.getItem("userInfo")) {
			const userInfo =  JSON.parse(localStorage.getItem("userInfo")).id;
			//userinfo 값 제대로 나오는지 체크하는 용
			
			this.setState({ ID:userInfo });
		}	
		setInterval(() => this.remainingtime(), 1000);
	}

	remainingtime() {
		var cd = new Date();
		var td = new Date("2019-10-30 10:00:00");
		var nt = parseInt(cd.getTime());
		var tt = parseInt(td.getTime());
		var rt = parseInt(parseInt(tt-nt)/1000);
		var rth = parseInt(parseInt(rt)/3600)>100?parseInt(parseInt(rt)/3600):zeroPadding(parseInt(parseInt(rt)/3600), 2);
		var rtm = zeroPadding(parseInt(parseInt(parseInt(rt)%3600)/60), 2);
		var rts = zeroPadding(parseInt(rt)%60, 2);
		
		function zeroPadding(num, digit) {
			var zero = '';
			for(var i=0;i<digit;i++) {
				zero += '0';
			}
			return (zero + num).slice(-digit);
		}

		this.setState({
			date_h: rth,
			date_m: rtm,
			date_s: rts
		});
	}

	render() {
		return (
			<div>
                                <div class="clock">
					<table class="time-table">
                                        	<tr><p class="now">현재시각 : <Clock format={'YYYY-MM-DD ddd hh:mm:ss A'} ticking={true} timezone={'Asia/Seoul'}/></p><br /></tr>
						<tr><div class="text-remaintime">다음보상까지 남은 시간</div></tr>
						<tr><div class="remaintime-container"><div class="remaintime">{this.state.date_h}:{this.state.date_m}:{this.state.date_s}</div></div></tr>
					</table><br /><br />
                                </div>
				<hr class="list-start" />
				<div class="card-class">
					<Card data="recent_review" labelname="최근 작성된 리뷰"/>
					<Card data="recent_review" labelname="한식"/>
					<Card data="recent_review" labelname="양식"/>
					<Card data="recent_review" labelname="중식"/>
					<Card data="recent_review" labelname="일식"/>
				</div>
			</div>
		);
	}
}

export class Article extends Component {

        render() {
                var image = this.props.data.Image, title = this.props.data.Subject, subtitle = this.props.data.Contents, number = this.props.data.Number, S_name = this.props.data.G_ID;
		//var url = number+"/"+title+"/"+subtitle+"/"+image;
		//var url = "/api/Review/"+number;
		var url = "/Review/"+number;
                return(
                        <figure className="snip1584">
				<img src={image} />
                               	<figcaption>
                                       	<h3>{title}</h3>
                                       	<h5>{S_name}</h5>
                               	</figcaption><a href={url}></a>
                        </figure>
                );
        }
}

export class News extends Component {
        render() {
                var data = this.props.data;
                var newsTemplate;
                var card_settings = {
                        dots: true,
                        infinite: true,
                        speed: 500,
                        slidesToShow: 4,
                        slidesToScroll: 1,
			autoplay: true,
                        swipeToSlide: true
                };
                if(data.length>0) {
                        newsTemplate = data.map(function(item, index) {
                                return (
                                        <div key={index}>
                                                <Article data={item} />
                                        </div>
                                )
                        })
                } else {
                        newsTemplate = <p>Please add some cards</p>
                }
                return (
                        <div className='news'>
                                <Slider {...card_settings}>{newsTemplate}</Slider>
                                <strong className={'news__count ' + (data.length>0?'':'none') }>
                                </strong>
                        </div>
                );
        }
}

export class Card extends Component {
        render() {
		var data = this.props.data, labelname = this.props.labelname;
		var card_data = require("./json_dir/"+data+".json");
                return (
			<div>
				<p class="label-review-title">{labelname}</p>	
                        	<div className='app'>
                                	<News data={card_data} />
				</div>
				<br /><br /><br />
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
			<div class="login-field">
				<form class="form-login">
					<p class="login-text">로그인</p>
					<table class="login-table">
						<tr><input class="login-id-field" onChange={this.handleIDChange} onKeyPress={this.handleKeyPress} placeholder="ID" type="text" required /></tr>
		                        	<tr><input class="login-pw-field" onChange={this.handlePWChange} onKeyPress={this.handleKeyPress} placeholder="Passwd" type="password" required /></tr>
                				<tr><button class="login-button" onClick={this.logining} type="button">로그인</button></tr>
					</table>
		                </form>
			</div>
		);
	}
}

export class register extends Component {
        render() {
                return (
                        <div class="register-field">
				<form class="form-register" method="post" action="/api/register_check">
					<p class="register-text">회원가입</p>
					<table class="register-table">
	                        		<tr><td class="register-info"><text class="register-infotext">아이디</text></td><td><input class="register-id-field" name="usr[id]" placeholder="ID" type="text" required /></td></tr>
                        			<tr><td class="register-info"><text class="register-infotext">패스워드</text></td><td><input class="register-pw-field" name="usr[pw]" id="pw" placeholder="Passwd" type="password" required /></td></tr>
                         			<tr><td class="register-info"><text class="register-infotext">패스워드 확인</text></td><td><input class="register-pc-field" name="pw_check" id="pw_check" placeholder="Passwd_check" type="password" /></td></tr>
                        			<tr><td class="register-info"><text class="register-infotext">지갑주소</text></td><td><input class="register-wl-field" name="usr[wallet]" id="wallet" placeholder="Wallet" type="text" required /></td></tr>
                         			<tr><td class="register-info"><text class="register-infotext">지갑주소 확인</text></td><td><input class="register-wc-field" name="wallet_check" id="wallet_check" placeholder="Wallet_check" type="text" /></td></tr>
						<tr><td colspan="2"><input class="register-button" type="submit" value="가입" /></td></tr>
					</table>
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
                axios.post('/api/write_check', data, config)
                .then( res => {
                        //res 안에 array로 데이터가 담겨있다.
			var hdata = SHA256(res.data.number.toString()+this.state.subject+this.state.contents);
			console.log(res.data.number, hdata);
			make_transaction_to_contract(parseInt(res.data.number), hdata);
                })
                .catch(function(err) {
                        console.log(err);
                        console.log("error occured, 관리자에게 문의하세요.");
                });
        }

        render() {
                return (
                        <div class="write-class">
								<p class="write-text">리뷰작성</p>
								<div class="write-container">
                        	 			<form class="write-form" enctype="multipart/form-data">
												<table>
                        								<tr><input class="write-form-title" onChange={this.handleSubjectChange} onKeyPress={this.handleKeyPress} placeholder="제목" type="text" required/></tr>
                        								<tr><textarea class="write-form-content" rows="20" cols="44" onChange={this.handleContentsChange} onKeyPress={this.handleKeyPress} placeholder="내용" type="textarea" required /></tr>
                 										<tr><input class="write-form-image"onChange={e => this.handleImageChange(e)} placeholder="이미지" type="file" /></tr>
														<tr><button class="write-form-button" onClick={this.writing} type="button">글쓰기</button></tr>
												</table>
                						</form>
								</div>
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

export class s_register extends Component {

	 constructor(props) {
                if(!localStorage.getItem("userInfo") ) {
                        alert('로그인을 먼저 해주세요');
                        window.location.href='/login';
                }
                super(props);
                //이거 바인딩 선언을 안 해주면 내부 state를 사용하지 못한다. 일반적인 함수도 전부 선언해줘야 한다.
                this.handlesnameChange = this.handlesnameChange.bind(this);
                this.handlesaddrChange = this.handlesaddrChange.bind(this);
		this.handlesphoneChange = this.handlesphoneChange.bind(this);
		this.handleflagChange = this.handleflagChange.bind(this);
                this.handleImageChange = this.handleImageChange.bind(this);
                this.registering = this.registering.bind(this);
                this.handleKeyPress = this.handleKeyPress.bind(this);
                this.state = {
                        s_name: '',
                        s_addr: '',
			s_phone: '',
			flag: 0,
                        image: null
                };
        }
	
	 handlesnameChange(e) {
                console.log(e.target.value);
                this.setState({
                        s_name:e.target.value
                });
        }

        handlesaddrChange(e) {
                console.log(e.target.value);
                this.setState({
                        s_addr:e.target.value
                });
        }

	handlesphoneChange(e) {
		console.log(e.target.value);
		this.setState({
			s_phone:e.target.value
		});
	}

	handleflagChange(e) {
		console.log(e.target.value);
		this.setState({
			flag:e.target.value
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

	registering() {
        	//const userInfo =  JSON.parse(localStorage.getItem("userInfo")).id;
                const data = new FormData();
                data.append('name', this.state.s_name);
                data.append('addr', this.state.s_addr);
                data.append('phone', this.state.s_phone);
		data.append('flag', this.state.flag);
                data.append('image', this.state.image);
                const config = {
                	headers: {
                        	'content-type': 'multipart/form-data'
                                //enctype: 'multipart/form-data'
                        }
                }

                axios.post('/api/s_register_check', data, config)
                .then( res => {
                        //res 안에 array로 데이터가 담겨있다.
                        //alert(JSON.stringify(res.data));
                        if(res.data === "Success") {
                                alert("가게 등록 성공!");
                                //localStorage를 이용한 세션 저장
                                window.location.href = '/';
                        } else {
                                alert("가게 등록 실패!");
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
                                 <form className="form-store_reg" enctype="multipart/form-data">
                                        <input onChange={this.handlesnameChange} onKeyPress={this.handleKeyPress} placeholder="가게 이름" type="text" required/>
                                        <input onChange={this.handlesaddrChange} onKeyPress={this.handleKeyPress} placeholder="가게 주소" type="text" required/>
					<input onChange={this.handlesphoneChange} onKeyPress={this.handleKeyPress} placeholder="가게 전화번호" type="text" required/>
					<select onChange={this.handleflagChange}>
						<option value="" selected disabled>식당 분류</option>
						<option value='0'>한식</option>
						<option value='1'>중식</option>
						<option value='2'>일식</option>
						<option value='3'>양식</option>
					</select>
                                        <input onChange={e => this.handleImageChange(e)} placeholder="이미지" type="file" />
                                        <button className="button_for_write" onClick={this.registering} type="button">가게 등록</button>
                                </form>
                        </div>

		)
	}
}

export class Review extends Component {

	constructor(props){
		super(props);
		this.componentWillMount = this.componentWillMount.bind(this);
		this.voting_cnt_inc = this.voting_cnt_inc.bind(this);
		this.state = {
			ID:'',
			Number:'',
			Subject:'',
			Contents:'',
			Vote:0,
			Image:'',
			IntegrityCheck:'',
			votingcnt: 3
                };
	}

	componentWillMount(props) {
		var numbers = this.props.match.params.number;
                axios.get('/api/Review', {
			params: {
				number: this.props.match.params.number
			}
		})
                .then( res => {
                        //res 안에 array로 데이터가 담겨있다.
                        //alert(JSON.stringify(res.data));
                        if(res.data === '') {
                                console.log("실패");
                                //localStorage를 이용한 세션 저장
                        } else {
                                console.log("성공");
				//console.log(res.data)
				var image_path = "../"+res.data[0].Image;
				this.setState({ ID:res.data[0].ID, Number:res.data[0].Number, Subject:res.data[0].Subject, Contents:res.data[0].Contents, Vote:res.data[0].Vote, Image:image_path});
	                        get_hex_from_contract(this.state.Number).then((hexvalue) => {
                                	this.setState({
						IntegrityCheck: hexvalue==SHA256(this.state.Number.toString()+this.state.Subject+this.state.Contents)?true:false
                                	});
                                	console.log("체인에서 " + this.state.Number+ "로 가져온  HASH 값 : "+hexvalue);
					//console.log("현재글 number : " + this.state.Number);	//현재글 번호짝어보려고
					//
					console.log("해싱시키는 문자열 : "+this.state.Number+this.state.Subject+this.state.Contents);
					console.log("현재글 HASH 값 : "+SHA256(this.state.Number.toString()+this.state.Subject+this.state.Contents));
					console.log(this.state.IntegrityCheck);
					//if(this.state.IntegrityCheck == true) alert("이 리뷰는 검증된 리뷰입니다");
					//else alert("이 리뷰는 검증되지 않은  리뷰입니다");
                		});
			}
		}).catch(function(err) {
                        console.log(err);
                        console.log("error occured, 관리자에게 문의하세요.");
                });
        }

		voting_cnt_inc(props) {
				this.setState({votingcnt: this.state.votingcnt+1});
				console.log(this.state.votingcnt);
				alert("이 리뷰를 추천했습니다 (+1)");
		}

        render() {
                return (
                        <div class="review-class">
						 		<div class="review-container">
										<div class="review-title">
												<table class="review-title-table">
														<tr class="review-title-table-row"><div class="review-title-table-title">{this.state.Subject}</div><div class="review-title-table-integrity">{this.state.IntegrityCheck?
														"[검증]"
														:
														<font color="red">[검증에러]</font>
														}
														</div>
														</tr>
												</table>
										</div>
										<hr class="review-hr"/>
										<div class="review-image">
												<img src={this.state.Image} />
										</div>
										<div class="review-content">
												{this.state.Contents}
										</div>
										<hr class="review-hr"/>
										<div class="review-button">
												<input type="button" class="review-votingbutton" onClick={this.voting_cnt_inc} value={this.state.votingcnt} />
										</div>
								</div>
                        </div>
                );
        }
}
