import React from 'react';
import Component from './Component';

export default class Login extends Component {

	onSubmit(e){
		e.preventDefault();
		this.props.onSubmit({
			username: this.refs.username.getDOMNode().value,
			password: this.refs.password.getDOMNode().value
		})
	}

	render() {
		let errors;
		if( this.props.error ){
			errors = <div>this.props.error</div>;
		}
		return (
			<form ref="form" onSubmit={this.onSubmit.bind(this)}>
				<input ref="username" placeholder="username" />
				<input ref="password" placeholder="password" type="password" />
				{errors}
				<button onClick={this.onSubmit.bind(this)}>Login</button>
			</form>
		)
	}

}
