// markTaskIncomplete sets a task to be incomplete
export function markTaskIncomplete(id) {
	return [`
		update task set complete = false
		where id = $1 and owner_id = $2
	`, id, this.session.member_id];
}
