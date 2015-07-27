import React from 'react';
import datastore from '../datastore';

export default class Footer extends React.Component {

  static queries = {
    Task: () => `
      complete
    `
  }

  render() {
      var tasks = this.props.tasks || [];

      if (tasks.length === 0) {
          return null;
      }

      var complete = tasks.filter(t => t.complete).length;

      var itemsLeft = tasks.length - complete;
      var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
      itemsLeftPhrase += 'remaining';

      // Undefined and thus not rendered if no completed items are left.
      var clearCompletedButton;
      if (complete > 0) {
          clearCompletedButton = <button
              id="clear-completed"
              onClick={this.clearCompleted.bind(this)}>
              Clear completed ({complete})
          </button>;
      }

      return (
          <footer id="footer">
              <span id="todo-count">
                  <strong>
                      {itemsLeft}
                  </strong>
                  {itemsLeftPhrase}
              </span>
              {clearCompletedButton}
          </footer>
      );
  }

  clearCompleted() {
    datastore.destroyCompletedTasks();
  }

}
