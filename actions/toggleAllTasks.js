// toggleAllTasks inverts the complete state of all tasks.
export function toggleAllTasks() {
	return [`
		with tasks as (
			select bool_and(complete) as complete
			from task
			where owner_id = $1
		)
		update task
		set complete = not (select complete from tasks)
		where owner_id = $1
	`, this.session.member_id];
}
