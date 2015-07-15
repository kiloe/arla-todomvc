import React from 'react';

export default class Register extends React.Component {

	onSubmit(e){
		e.preventDefault();
		this.props.onSubmit({
			first_name: this.refs.first_name.getDOMNode().value,
			last_name: this.refs.last_name.getDOMNode().value,
			username: this.refs.username.getDOMNode().value,
			password: this.refs.password.getDOMNode().value,
		})
	}

	render() {
		let errors;
		if( this.props.error ){
			errors = <div>this.props.error</div>;
		}
		return (
			<form ref="form" onSubmit={this.onSubmit.bind(this)}>
				<input ref="first_name" placeholder="first name" />
				<input ref="last_name" placeholder="last name" />
				<input ref="username" placeholder="username" />
				<input ref="password" type="password" placeholder="password" />
				{errors}
				<button onClick={this.onSubmit.bind(this)}>Register</button>
			</form>
		)
	}

}
