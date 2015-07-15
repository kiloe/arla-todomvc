
// defines an entity type "member".
export class member {

	static id          = {type: 'uuid'}
	static first_name  = {type: 'text'}
	static last_name   = {type: 'text'}
	static username    = {type: 'text', index:true}
	static password    = {type: 'text'}

	// The tasks() call fetches all the tasks for a member that are
	// visible to the current viewer.
	static tasks = {type:'array', of:'task', query: function(){
		return `
			select tasks.id, tasks.text, tasks.complete
			from all_tasks
			left join tasks on watcher.task_id = tasks.id
			where watcher.member_id = $this.id
			or tasks.assignee_id = $this.id
		`
	}}
}
