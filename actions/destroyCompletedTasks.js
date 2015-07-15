// destroyCompletedTasks deletes all tasks already marked as completed.
export function destroyCompletedTasks() {
	return [`
		delete from task
		where complete = true
		and (owner_id = $1 or assignee_id = $1)
	`, this.session.member_id];
}
