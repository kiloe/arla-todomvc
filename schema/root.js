
// The root entity is the default "start" of the AQL "graph".
//
// All arla queries start start as calls off of this entity
//
// 		root() {     <-- you will never actually write this root() call, it is implied
// 			viewer() {
// 				first_name
// 			}
// 			tasks() {
// 				text
// 				complete
// 				assignee() {
// 					first_name
// 				}
// 			}
// 		}
//
// which would return:
//
// 		{
// 			viewer: {
// 				first_name: 'bob'
// 			},
// 			tasks: [
// 				{complete: false, text: 'todo', assignee:{first_name: 'bob'}}
// 				{complete: false, text: 'todo', assignee:{first_name: 'alice'}}
// 				{complete: false, text: 'todo', assignee:{first_name: 'alice'}}
// 			]
// 		}
//
export class root {
	// Here we define a property named "viewer" that will return
	// an object of type 'member'.
	// The property has a query defined which means that rather
	// than being a field on a table, the SQL will be executed to
	// fetch the data.
	// "this.session" in the context of a query function
	// contains the "claims" returned by the authenticate function
	// which is defined in arla.configure.
	// Here "this.session.member_id" is used in the SQL to return the
	// currently logged in member fields.
	static viewer = {type:'member', query: function(){
		return [`
			select * from member
			where id = $1
		`, this.session.member_id]
	}}

	// The all_tasks() property returns all the tasks that the member is
	// authorized to see. In this case it's all the tasks that are
	// either owned by, assigned to or being watched by the current member.
	static tasks = {type:'array', of:'task', query: function(){
		return [`
			select distinct task.* from task
			left join watcher on watcher.task_id = task.id
			where watcher.member_id = $1
			or task.assignee_id = $1
			or task.owner_id = $1
			order by created_at
		`, this.session.member_id]
	}}

	// The users property returns all the users that the current viewer
	// is able to see. We limit the fields available here so as not
	// to leak any private fields to other users.
	static users = {type:'array', of:'member', query:function(){
		return `
			select id,first_name,last_name from member
		`
	}}
}
