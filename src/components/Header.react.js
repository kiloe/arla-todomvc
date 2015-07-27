import React from 'react';
import TodoTextInput from './TodoTextInput.react';
import uuid from 'uuid';
import datastore from '../datastore';

export default class Header extends React.Component {

	static queries = {
		User: () => `
			first_name
		`
	}

	render() {
		return (
			<header id="header">
			<h1>todos</h1>
			<TodoTextInput
    			id="new-todo"
    			placeholder="What needs to be done?"
    			onSave={this.create.bind(this)}
			/>
			</header>
		);
	}

	create(text){
		if( text.trim() ){
			datastore.createTask({
				id: uuid.v4(),
				text: text,
			})
		}
	}

}
