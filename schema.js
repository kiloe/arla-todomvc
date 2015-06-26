
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
		// There is however something special about the $viewer variable.
		// $viewer contains the current user id and can be used in queries.
		viewer() {
			return {
				type: 'member',
				query: `select * from member where id = $viewer`
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
					where watcher.member_id = $viewer
					or task.assignee_id = $viewer
					or task.owner_id = $viewer
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

export var watcher = {
	properties: {
		id          : {type: 'uuid'},
		task_id     : {type: 'uuid', for:'task'},
		member_id   : {type: 'uuid', for:'member'}
	}
}

export var task = {
	properties: {
		id          : {type: 'uuid'},
		text        : {type: 'text'},
		complete    : {type: 'boolean'},
		private     : {type: 'boolean'},
		created_at  : {type: 'timestamptz', def:'now()'},
		owner_id    : {type: 'uuid'},
		assignee_id : {type: 'uuid'},
		watcher_ids : {type: 'uuid[]', def:"'{}'::uuid[]"}
	},
	edges: {
		owner(){
			return {
				type: 'member',
				query: `
					select id,first_name,last_name
					from member
					where id = $this.member_id
				`
			}
		},
		assignee(){
			return {
				type: 'member',
				query: `
					select id,first_name,last_name
					from member where id = $this.assignee_id
				`
			}
		},
		watchers(){
			return {
				type: 'array',
				of: 'member',
				query: `
					select member.id, member.first_name, member.last_name
					from member
					where member.id in $this.watcher_ids
				`
			}
		}
	}
}
