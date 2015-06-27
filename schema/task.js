
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
