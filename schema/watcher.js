
export var watcher = {
	properties: {
		id          : {type: 'uuid'},
		task_id     : {type: 'uuid', for:'task'},
		member_id   : {type: 'uuid', for:'member'}
	}
}
