// markTaskComplete sets a task as done
export function markTaskComplete(id){
	return [`
		update task set complete = true
		where id = $1 and (owner_id = $2 or assignee_id = $2)
	`, id, this.session.member_id];
}
