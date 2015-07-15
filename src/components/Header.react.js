import React from 'react';
import TodoTextInput from './TodoTextInput.react';
import datastore from '../datastore';

export default class Header extends React.Component {

	static queries = (params,include) => { return {
		User: `
			first_name
		`
	} }

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

	create(text) {
		if( text.trim() ){
			datastore.createTask({
                id: datastore.uuid(),
                text: text,
                member_id: datastore.userId()
            })
		}
	}

}
