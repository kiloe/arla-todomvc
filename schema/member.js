
// defines an entity type "member".
export var member = {

	properties:{
		id          : {type: 'uuid'},
		first_name  : {type: 'text'},
		last_name   : {type: 'text'},
		username    : {type: 'text', index:true},
		email       : {type: 'text', index:true, nullable:true},

	},

	edges: {
		// The tasks() call fetches all the tasks for a member that are
		// visible to the current viewer.
		tasks(){
			return {
				type: 'task',
				query: `
					select tasks.id, tasks.text, tasks.complete
					from all_tasks
					left join tasks on watcher.task_id = tasks.id
					where watcher.member_id = $this.id
					or tasks.assignee_id = $this.id
				`
			}
		}
	}
}
