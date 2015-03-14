
// This function is called by the Ident service after registration of a uuid
// and password. It's job is to create the user's profile.
export function createIdentity(values) {
	this.insert('member', values);
}

// This function is called by the Ident service to translate a friendly
// lookup name (like an email adress or username) to a uuid.
export function lookupIdentity(ref) {
	return this.query('select id from member where lower(username) = lower($1)', ref);
}

export function createTask({id, text, member_id}) {
	this.insert('task', {
		id: id,
		text: text,
		owner_id: member_id,
		assignee_id: member_id
	});
}

export function toggleAllTasks() {
	this.query(`
		with tasks as (
			select bool_and(complete) as complete from task
		)
		update task set complete = not (select complete from tasks)
	`);
}

export function markTaskIncomplete(id) {
	this.update('task', {complete: false}, 'id = $1', id);
}

export function markTaskComplete(id){
	this.update('task', {complete: true}, 'id = $1', id);
}

export function setTaskText(id, text) {
	this.update('task', {text: text}, 'id = $1', id);
}

export function destroyTask(id){
	this.destroy('task', 'id = $1', id);
}

export function destroyCompletedTasks() {
	this.destroy('task', 'complete = true');
}
