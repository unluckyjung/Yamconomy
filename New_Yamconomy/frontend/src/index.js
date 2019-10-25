import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, login, register, write, logout } from './App.js';

ReactDOM.render(
	<Router>
		<div>
			<Route exact path="/" component={Home}/>
			<Route path="/login" component={login} />
			<Route path="/register" component={register} />
			<Route path="/write" component={write} />
			<Route path="/logout" component={logout} />
		</div>
	</Router>,
	document.getElementById('root')
)
