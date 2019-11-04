import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, login, register, write, logout, Topper, Footer, s_register, Review} from './App.js';

ReactDOM.render(
	<Router>
		<div>
			<Route component={Topper} />
			<Route exact path="/" component={Home} />
			<Route path="/login" component={login} />
			<Route path="/register" component={register} />
			<Route path="/write" component={write} />
			<Route path="/logout" component={logout} />
			<Route path="/store_register" component={s_register} />
			<Route path="/Review/:number/:id/:subject/:contents/:image/:image_path" component={Review} />
			<Route component={Footer} />
		</div>
	</Router>,
	document.getElementById('root')
);

