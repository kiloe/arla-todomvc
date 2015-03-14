import React from 'react';
import Component from './Component.js';
import cx from 'react/lib/cx';
import TodoTextInput from './TodoTextInput.react';
import datastore from '../datastore';

export default class TodoItem extends Component {

	constructor(props){
		super(props);
		this.state = {isEditing: false};
	}

	render() {
		let task = this.props.task;

		let input = this.state.isEditing ? <TodoTextInput
			className="edit"
			onSave={this.save.bind(this)}
			value={task.text}
		/> : undefined;

		// List items should get the class 'editing' when editing
		// and 'completed' when marked as completed.
		// Note that 'completed' is a classification while 'complete' is a state.
		// This differentiation between classification and state becomes important
		// in the naming of view actions toggleComplete() vs. destroyCompleted().
		return (
			<li className={cx({
				'completed': task.complete,
				'editing': this.state.isEditing
			})}
			key={task.id}>
				<div className="view">
				<input
					className="toggle"
					type="checkbox"
					checked={task.complete}
					onChange={this.toggle.bind(this)}
				/>
				<label onDoubleClick={this.edit.bind(this)}>
					{task.text}
				</label>
				<button className="destroy" onClick={this.destroy.bind(this)} />
				</div>
				{input}
			</li>
		);
	}

	toggle() {
		if( this.props.task.complete ){
			datastore.markTaskIncomplete(this.props.task.id);
		} else {
			datastore.markTaskComplete(this.props.task.id);
		}
	}

	edit() {
		this.setState({isEditing: true});
	}

	/**
	* Event handler called within TodoTextInput.
	* Defining this here allows TodoTextInput to be used in multiple places
	* in different ways.
	* @param  {string} text
	*/
	save(text) {
		datastore.setTaskText(this.props.task.id, text);
		this.setState({isEditing: false});
	}

	destroy() {
		datastore.destroyTask(this.props.task.id);
	}

}

TodoItem.queries = params => {return{
	Task: `
		complete
		text
	`
}}
