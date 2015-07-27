import Footer from './Footer.react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React from 'react';

// TodoApp is the main Component of the application. It has no state itself as
// this is managed by it's owner (the generic App Component). Having no state
// makes it simpler to test.
export default class TodoApp extends React.Component {

	// The "root" query is the top of the query tree
	static queries = {
		root: () => `
			user:viewer() {
				first_name
				${Header.queries.User()}
				tasks().sort(id) {
					${MainSection.queries.Task()}
					${Footer.queries.Task()}
				}
			}
		`
	}

	render() {
		return (
			<div>
				<section id="todoapp">
					<Header active={this.props.user} />
					<MainSection tasks={this.props.user.tasks} />
					<Footer tasks={this.props.user.tasks} />
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
