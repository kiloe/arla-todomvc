import React from 'react';
import TodoApp from './components/TodoApp.react';
import Login from './components/Login';
import Register from './components/Register';
import {datastore,AUTHENTICATING,REGISTERING,UNAUTHENTICATED,AUTHENTICATED} from './datastore';

// This is the generic App component. It's job is to handle authentication and
// setup mapping of datastore.query to props for the main TodoApp Component.
class App extends React.Component {

	// setup datastore listeners
	componentWillMount(){
		console.log('mounting');
		// listen for query results and assign them to state.data
		// nothing will flow into this stream until the
		// datastore is in an ONLINE state (which means calling login or register)
		this.query = datastore.queryStream(TodoApp).onValue(v => {
			this.setState({data: v});
		}).onError(err => {
			console.warn('query failed:', err);
		})
		// keep track of state of the datastore (sign in/out)
		this.auth = datastore.stateStream().onValue( state => {
			this.setState({authentication: state});
			if( state == UNAUTHENTICATED ){
				this.setState({data: null});
			}
		})
		datastore.state.log();
	}

	// Stop listening to datastore
	componentWillUnmount(){
		console.log('unounting');
		this.query.destroy();
		this.auth.destroy();
	}

	// signin
	login({username, password}) {
		this.setState({loginError: null});
		datastore.login(username, password).catch(err => {
			this.setState({loginError: err});
		})
	}

	// signin
	logout(e) {
		e.preventDefault();
		datastore.logout();
	}

	// signup
	register(profile) {
		this.setState({registerError: null});
		datastore.register(profile).catch(err => {
			this.setState({registerError: err});
		})
	}

	// handle authentication states and render the real app with props
	render() {
		switch(this.state.authentication){
		case UNAUTHENTICATED:
		case AUTHENTICATING:
		case REGISTERING:
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
		case AUTHENTICATED:
			if( !this.state.data ){
				return <div>loading</div>;
			}
			return <TodoApp {...this.state.data} logout={this.logout.bind(this)}/>
		}
	}
}

React.render(
  <App/>,
  document.getElementById('app')
);
