
// The root entity is a propertyless entity that sets up
// the data that visible to the currently logged in member.
//
// All arla queries start start as edges off of the special "root" entity
//
// 		root() {
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
export var root = {
	edges: {
		// The viewer() call returns the currently logged in user.
		// There is nothing special about this edge, 'viewer' is
		// just a convention to mean 'the currently logged in user'.
		// There is however something special about the $identidy variable.
		// $identity contains the current user id (as returned from the lookupIdentity
    // function and can be used in queries.
		viewer() {
			return {
				type: 'member',
				query: [`
					select * from member
					where id = $1
				`, this.member_id]
			}
		},
		// The all_tasks() call returns all the tasks that the member is
		// authorized to see. In this case it's all the tasks that are
		// either owned by, assigned to or being watched by the current member.
		tasks() {
			return {
				type: 'array',
				of: 'task',
				query: `
					select distinct task.* from task
					left join watcher on watcher.task_id = task.id
					where watcher.member_id = '${this.member_id}'
					or task.assignee_id = '${this.member_id}'
					or task.owner_id = '${this.member_id}'
					order by created_at
				`
			}
		},
		// The root users() call returns all the users that the current viewer
		// is able to see.
		users() {
			return {
				type: 'array',
				of: 'member',
				query: `
					select id,first_name,last_name from member
				`
			}
		}
	}
}
