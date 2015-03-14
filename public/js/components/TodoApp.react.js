
import Footer from './Footer.react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React from 'react';
import Component from './Component.js';

// TodoApp is the main Component of the application. It has no state itself as
// this is managed by it's owner (the generic App Component). Having no state
// makes it simpler to test.
export default class TodoApp extends Component {

	render() {
		return (
			<div>
	            <section id="todoapp">
					<Header active={this.props.user} />
					<MainSection tasks={this.props.tasks} />
					<Footer tasks={this.props.tasks} />
	            </section>
				<footer id="info">
					<p>Double-click to edit a todo</p>
					<p>You are logged in as {this.props.first_name} <a href="#" onClick={this.props.logout}>logout</a></p>
					<p>An Arla example of <a href="http://todomvc.com">TodoMVC</a></p>
				</footer>
			</div>
		);
	}

}

// This is the query builder that will be called by datastore.query in App.
// The include param is a function that will lookup the next part of the query
// from the given child Components.
// The root of the query graph is the currently logged in user. Each top-level
// attribute is either a property or an edge as defined in schema.js
TodoApp.query = (params,include) => {
	return `
		viewer() {
			first_name
			${include(Header, 'User')}
		}
		tasks() {
			${include(MainSection, 'Task')}
			${include(Footer, 'Task')}
		}

	`
}
