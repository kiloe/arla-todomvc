import React from 'react';
import TodoApp from './components/TodoApp.react';
import Login from './components/Login';
import Register from './components/Register';
import datastore from './datastore';

// queryFor returns a query builder function. It will Ask
// each React.Component what data it requires and build the query
function queryFor(component){
	return function(){
		return component.queries.root()
	}
}

// This is the generic App component. It's job is to handle authentication and
// setup mapping of datastore.query to props for the main TodoApp Component.
class App extends React.Component {

	// setup datastore listeners
	constructor(props){
		super(props);

		// init state
		this.state = {
			authenticated: false,
			data: null
		};

		// track authenticated state changes
		datastore.on('change', state => {
			this.setState({authenticated: state == 'authenticated'});
		})

		// listen for query results and assign them to state.data
		// nothing will flow into this stream until the
		// datastore is in an AUTHENTICATED state
		this.query = datastore.prepare(queryFor(TodoApp))
			.on('data', data => {
				this.setState({data: data});
			})
			.on('error', err => {
				console.warn('query failed:', err)
			})
			.poll(20000);
	}

	// Stop listening to datastore
	componentWillUnmount(){
		this.query.stop();
	}

	// signin
	login({username, password}) {
		datastore.connect({username, password})
	}

	// signin
	logout(e) {
		e.preventDefault();
		datastore.deauthenticate();
		this.setState({data: null});
	}

	// signup
	register(profile) {
		datastore.register(profile);
	}

	// handle authentication states and render the real app with props
	render() {
		if( !this.state.authenticated ){
			return (
				<div id="login">
					<header id="header">
						<h1>todos</h1>
					</header>
					<h2>Login:</h2>
					<Login onSubmit={this.login.bind(this)} />
					<b>{this.state.loginError}</b>
					<hr/>
					<h2>or Register:</h2>
					<Register onSubmit={this.register.bind(this)} />
					<b>{this.state.registerError}</b>
				</div>
			);
		}
		if( !this.state.data ){
			return (
				<div id="login">
					<header id="header">
						<h1>todos</h1>
					</header>
					<h2>Loading...</h2>
				</div>
			);
		}
		return <TodoApp {...this.state.data} logout={this.logout.bind(this)}/>
	}
}

React.render(
  <App/>,
  document.getElementById('app')
);
