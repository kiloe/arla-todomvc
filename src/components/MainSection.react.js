import React from 'react';
import TodoItem from './TodoItem.react';
import datastore from '../datastore';

export default class MainSection extends React.Component {

  static queries = {
    Task: () => `
      id
      complete
      ${TodoItem.queries.Task()}
    `
  }

  render() {
      let tasks = this.props.tasks || [];

      // This section should be hidden by default
      // and shown when there are todos remaining.
      if (tasks.length === 0) {
          return null;
      }

      let items = tasks.map( t => {
          return <TodoItem key={t.id} task={t} />
      })

      let allComplete = !tasks.some(t => !t.complete)

      return (
          <section id="main">
          <input
              id="toggle-all"
              type="checkbox"
              onChange={this.toggleCompleteAll.bind(this)}
              checked={allComplete ? 'checked' : ''}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul id="todo-list">{items}</ul>
          </section>
      );
  }

  toggleCompleteAll() {
    datastore.toggleAllTasks();
  }

}
