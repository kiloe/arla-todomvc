
// defines an entity type "member".
export class member {

	static first_name  = {type: 'text'}
	static last_name   = {type: 'text'}
	static username    = {type: 'text', index:true}
	static password    = {type: 'text'}

	// beforeChange is called before any INSERT or UPDATE of member.
	// It can be used for validation or altering the field data before COMMIT
	beforeChange(){
		if( this.username.length < 3 ){
			// UserError errors will be passed back to the client
			// any other type of error will result in a generic message
			// like "a problem ocured" being sent to the client.
			throw new UserError('username must be at least 3 characters');
		}
	}

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
